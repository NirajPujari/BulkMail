export interface SendProviderEmailParams extends SendGmailEmailParams {
  provider?: "google" | string;
}

export interface SendGmailEmailParams {
  userId: string;
  to: string;
  subject: string;
  body: string;
}

export interface QuotaInfo {
  emailsSentToday: number;
  dailyQuotaLimit: number;
  remainingQuota: number;
  lastQuotaReset: Date;
}

export interface QuotaCheckResult {
  allowed: boolean;
  remainingQuota: number;
  requestedCount: number;
  dailyQuotaLimit: number;
  message?: string;
}

export interface ProviderQuotaConfig {
  providerName: string;
  defaultDailyLimit: number;
}

export interface TransactionalEmailOptions {
  to: string;
  subject: string;
  text: string;
}

export interface EmailService {
  sendEmail(options: TransactionalEmailOptions): Promise<{ success: boolean; id?: string }>;
}