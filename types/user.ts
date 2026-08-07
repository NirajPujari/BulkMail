import { JwtPayload } from "jsonwebtoken";

export type Role = "everyone" | "user" | "admin";

export interface User {
  name: string;
  userId: string;
  email: string;
  role: Role;
  googleConnected?: boolean;
  googleEmail?: string | null;
  emailsSentToday?: number;
  dailyQuotaLimit?: number;
  remainingQuota?: number;
}

export interface TokenPayload extends User, JwtPayload {}
