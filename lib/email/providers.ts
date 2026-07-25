import { Resend } from "resend";

export const resendClients = [
  new Resend(process.env.RESENT_API_1 || ""),
  new Resend(process.env.RESENT_API_2 || ""),
];
