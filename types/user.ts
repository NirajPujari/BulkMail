import { JwtPayload } from "jsonwebtoken";

export type Role = "everyone" | "user" | "admin";

export interface User {
  name: string;
  userId: string;
  email: string;
  role: Role;
}

export interface TokenPayload extends User, JwtPayload {}
