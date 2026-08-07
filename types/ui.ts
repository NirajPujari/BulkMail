export interface StatsCardsProps {
  totalEmailsSent: number;
  totalCampaigns: number;
  emailsSentToday?: number;
  dailyQuotaLimit?: number;
  remainingQuota?: number;
}