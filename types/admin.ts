export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: "user" | "admin";
  createdAt: string;
  campaignCount: number;
}

export interface AdminStats {
  totalUsers: number;
  totalCampaigns: number;
  totalEmailsSent: number;
  activeCampaigns: number;
}