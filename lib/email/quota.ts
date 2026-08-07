import { prisma } from "@/lib/db";
import { ProviderQuotaConfig, QuotaCheckResult, QuotaInfo } from "./mail";

/**
 * Extensible Provider Quota Registry.
 * Allows easy registration and configuration of daily limits for future providers (e.g. Gmail, SES, Resend).
 */
export const PROVIDER_QUOTAS: Record<string, ProviderQuotaConfig> = {
  gmail: {
    providerName: "Google Gmail API v1",
    defaultDailyLimit: 500,
  },
};

/**
 * Checks if two dates fall on different calendar days (UTC).
 */
function isDifferentDay(dateA: Date, dateB: Date): boolean {
  return (
    dateA.getUTCFullYear() !== dateB.getUTCFullYear() ||
    dateA.getUTCMonth() !== dateB.getUTCMonth() ||
    dateA.getUTCDate() !== dateB.getUTCDate()
  );
}

/**
 * Retrieves the current quota state for a given user.
 * Automatically resets daily usage counter if a new calendar day has started.
 */
export async function getUserQuotaInfo(userId: string): Promise<QuotaInfo> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      emailsSentToday: true,
      dailyQuotaLimit: true,
      lastQuotaReset: true,
    },
  });

  if (!user) {
    throw new Error("User not found for quota lookup.");
  }

  const now = new Date();
  let emailsSentToday = user.emailsSentToday ?? 0;
  const dailyQuotaLimit = user.dailyQuotaLimit ?? PROVIDER_QUOTAS.gmail.defaultDailyLimit;
  let lastQuotaReset = user.lastQuotaReset ? new Date(user.lastQuotaReset) : now;

  // Auto-reset usage if a new calendar day (UTC) has started
  if (isDifferentDay(lastQuotaReset, now)) {
    emailsSentToday = 0;
    lastQuotaReset = now;

    await prisma.user.update({
      where: { id: userId },
      data: {
        emailsSentToday: 0,
        lastQuotaReset: now,
      },
    });
  }

  const remainingQuota = Math.max(0, dailyQuotaLimit - emailsSentToday);

  return {
    emailsSentToday,
    dailyQuotaLimit,
    remainingQuota,
    lastQuotaReset,
  };
}

/**
 * Validates whether the requested email dispatch count fits within the user's remaining daily quota.
 */
export async function checkQuotaAvailable(
  userId: string,
  requestedCount: number
): Promise<QuotaCheckResult> {
  const quota = await getUserQuotaInfo(userId);

  if (requestedCount > quota.remainingQuota) {
    return {
      allowed: false,
      remainingQuota: quota.remainingQuota,
      requestedCount,
      dailyQuotaLimit: quota.dailyQuotaLimit,
      message: `Campaign size (${requestedCount} recipient${requestedCount === 1 ? "" : "s"}) exceeds your remaining daily Gmail API quota (${quota.remainingQuota} remaining today out of ${quota.dailyQuotaLimit}).`,
    };
  }

  return {
    allowed: true,
    remainingQuota: quota.remainingQuota,
    requestedCount,
    dailyQuotaLimit: quota.dailyQuotaLimit,
  };
}

/**
 * Increments the user's daily sent email count by the specified amount.
 */
export async function incrementUserQuota(userId: string, count: number = 1): Promise<QuotaInfo> {
  // Ensure daily reset check runs first
  await getUserQuotaInfo(userId);

  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: {
      emailsSentToday: {
        increment: count,
      },
    },
    select: {
      emailsSentToday: true,
      dailyQuotaLimit: true,
      lastQuotaReset: true,
    },
  });

  const emailsSentToday = updatedUser.emailsSentToday;
  const dailyQuotaLimit = updatedUser.dailyQuotaLimit;
  const remainingQuota = Math.max(0, dailyQuotaLimit - emailsSentToday);

  return {
    emailsSentToday,
    dailyQuotaLimit,
    remainingQuota,
    lastQuotaReset: updatedUser.lastQuotaReset,
  };
}
