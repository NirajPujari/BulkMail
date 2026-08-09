import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { verifyToken } from "@/lib/jwt";
import { sendProviderEmail } from "@/lib/email/dispatcher";
import { checkQuotaAvailable, incrementUserQuota, getUserQuotaInfo } from "@/lib/email/quota";
import { renderTemplate } from "@/lib/email/template";
import { RecipientVariableItem } from "@/types/campaign";

// Helper to get userId from Authorization header
function getUserIdFromRequest(req: NextRequest): string | null {
  const auth = req.headers.get("authorization");
  if (!auth || !auth.startsWith("Bearer ")) {
    return null;
  }
  const token = auth.slice(7);
  const payload = verifyToken(token);
  return payload ? payload.userId : null;
}

export async function POST(req: NextRequest) {
  try {
    const userId = getUserIdFromRequest(req);
    if (!userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // Check user's Google connection state in DB
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        googleConnected: true,
        googleEmail: true,
      },
    });

    if (!user || !user.googleConnected || !user.googleEmail) {
      return NextResponse.json(
        { message: "Google account not connected. Please connect your Google account before sending emails." },
        { status: 400 }
      );
    }

    const { id, subject, body, recipients, recipientData } = await req.json();

    if (!subject || !body) {
      return NextResponse.json(
        { message: "Subject and body are required" },
        { status: 400 }
      );
    }

    // Determine structured recipient list
    let targetRecipients: RecipientVariableItem[] = [];

    if (Array.isArray(recipientData) && recipientData.length > 0) {
      targetRecipients = recipientData.filter((r) => r.email && r.email.includes("@"));
    } else if (recipients) {
      const parsedEmails = recipients
        .split(/[\n,;]+/)
        .map((email: string) => email.trim())
        .filter((email: string) => email.length > 0 && email.includes("@"));

      targetRecipients = parsedEmails.map((email: string) => ({ email, variables: {} }));
    }

    if (targetRecipients.length === 0) {
      return NextResponse.json(
        { message: "No valid recipient email addresses found" },
        { status: 400 }
      );
    }

    // Pre-flight Daily Quota Check
    const quotaCheck = await checkQuotaAvailable(userId, targetRecipients.length);
    if (!quotaCheck.allowed) {
      return NextResponse.json(
        { message: quotaCheck.message },
        { status: 400 }
      );
    }

    // Check if there is an active running campaign
    const activeCampaign = await prisma.campaign.findFirst({
      where: {
        userId,
        status: "sending",
      },
    });

    if (activeCampaign) {
      return NextResponse.json(
        { message: "A campaign is already running. Please wait for it to complete." },
        { status: 400 }
      );
    }

    const recipientsDbPayload = JSON.stringify(targetRecipients);

    // CRITICAL EXECUTION REQUIREMENT:
    // Every launch MUST create a brand new Campaign execution record with its own unique ID.
    // If 'id' was passed (e.g. editing a draft), mark the old draft as updated/launched or archive it.
    if (id) {
      const existing = await prisma.campaign.findUnique({ where: { id } });
      if (existing && existing.userId === userId && existing.status === "draft") {
        await prisma.campaign.update({
          where: { id },
          data: { status: "launched" },
        }).catch(() => {});
      }
    }

    const campaignExecution = await prisma.campaign.create({
      data: {
        subject,
        body,
        recipients: recipientsDbPayload,
        status: "sending",
        sentCount: 0,
        totalCount: targetRecipients.length,
        logs: `[System] Initialized new campaign execution: "${subject}"...\n[System] Found ${targetRecipients.length} recipient(s).`,
        userId,
      },
    });

    const campaignId = campaignExecution.id;

    // Create CampaignRecipient records for open tracking analytics
    try {
      await prisma.campaignRecipient.createMany({
        data: targetRecipients.map((r) => ({
          campaignId,
          email: r.email.toLowerCase().trim(),
          status: "sent",
          variables: (r.variables as any) || {},
          opened: false,
          openCount: 0,
        })),
        skipDuplicates: true,
      });
    } catch (createErr) {
      console.error("Failed to create campaign recipient tracking rows:", createErr);
    }

    // Determine Base URL for Open Tracking Pixel
    const origin = req.headers.get("origin") || req.nextUrl.origin || "http://localhost:3000";
    const appUrl = process.env.APP_URL || process.env.NEXT_PUBLIC_APP_URL || origin;

    // Trigger background send process via Gmail API
    sendCampaignBackground(userId, campaignId, subject, body, targetRecipients, user.googleEmail, appUrl);

    return NextResponse.json({
      message: "Campaign queued and starting personalized execution in background via Gmail API.",
      campaignId,
    });
  } catch (error) {
    console.error("Queue campaign error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

async function sendCampaignBackground(
  userId: string,
  campaignId: string,
  subject: string,
  body: string,
  recipients: RecipientVariableItem[],
  senderEmail: string,
  appUrl: string
) {
  let sent = 0;
  let failed = 0;
  let logsAccumulator = "";

  // Helper to append logs to DB
  const appendLog = async (msg: string) => {
    try {
      const campaign = await prisma.campaign.findUnique({
        where: { id: campaignId },
        select: { logs: true },
      });
      const currentLogs = campaign?.logs || "";
      logsAccumulator = currentLogs ? `${currentLogs}\n${msg}` : msg;

      await prisma.campaign.update({
        where: { id: campaignId },
        data: { logs: logsAccumulator },
      });
    } catch (e) {
      console.error("Failed to update logs:", e);
    }
  };

  await appendLog(`[System] Initialized Gmail API personalized dispatch engine.`);
  await appendLog(`[System] Authenticating connected Gmail sender identity: <${senderEmail}>... Success.`);

  for (let i = 0; i < recipients.length; i++) {
    const item = recipients[i];
    const email = item.email;

    // Check remaining quota before attempting dispatch
    const currentQuota = await getUserQuotaInfo(userId);
    if (currentQuota.remainingQuota <= 0) {
      await appendLog(
        `[Quota Reached] Daily Gmail API quota exhausted (${currentQuota.emailsSentToday}/${currentQuota.dailyQuotaLimit}). Halting remaining dispatches.`
      );
      break;
    }

    // Render personalized subject and body for this recipient
    const personalizedSubject = renderTemplate(subject, item.variables);
    let personalizedBody = renderTemplate(body, item.variables);

    // Inject Open Tracking Pixel
    const trackingPixelUrl = `${appUrl}/api/track/open?c=${campaignId}&r=${encodeURIComponent(email)}`;
    const trackingPixelHtml = `<img src="${trackingPixelUrl}" width="1" height="1" style="display:none !important; width:1px; height:1px; opacity:0;" alt="" />`;

    if (personalizedBody.toLowerCase().includes("</body>")) {
      personalizedBody = personalizedBody.replace(/<\/body>/i, `${trackingPixelHtml}</body>`);
    } else {
      personalizedBody = `${personalizedBody}\n\n${trackingPixelHtml}`;
    }

    await appendLog(`[Sending] Personalizing & dispatching via Gmail API to ${email}...`);

    try {
      const result = await sendProviderEmail({
        userId,
        to: email,
        subject: personalizedSubject,
        body: personalizedBody,
      });

      sent++;
      await incrementUserQuota(userId, 1);
      await appendLog(`[Success] Delivered personalized email to ${email} via Gmail API (Message ID: ${result.id})`);
    } catch (err) {
      failed++;
      console.error(`Error dispatching to ${email}:`, err);
      await appendLog(`[Failed] Error dispatching to ${email}: ${err}`);
    }

    // Update sent count periodically
    try {
      await prisma.campaign.update({
        where: { id: campaignId },
        data: { sentCount: sent },
      });
    } catch (e) {
      console.error("Failed to update sent count:", e);
    }

    // 1-second delay between emails to respect Gmail API quota
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }

  const finalStatus = failed === recipients.length ? "failed" : "completed";
  await appendLog(`[System] Gmail API personalized background dispatcher finished.`);
  await appendLog(`[Summary] Sent: ${sent}, Failed: ${failed}, Total: ${recipients.length}`);

  try {
    await prisma.campaign.update({
      where: { id: campaignId },
      data: { status: finalStatus },
    });
  } catch (e) {
    console.error("Failed to set final status:", e);
  }
}
