import { prisma } from "@/lib/db";
import { decryptToken } from "@/lib/crypto";
import { SendGmailEmailParams } from "./mail";



/**
 * Retrieves a fresh Google Access Token using the user's stored encrypted Refresh Token.
 * Automatically updates token expiry timestamp in DB.
 */
export async function getGoogleAccessToken(userId: string): Promise<{ accessToken: string; googleEmail: string }> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      googleConnected: true,
      googleEmail: true,
      googleRefreshToken: true,
    },
  });

  if (!user || !user.googleConnected || !user.googleRefreshToken || !user.googleEmail) {
    throw new Error("No connected Google account found. Please connect your Google account in the dashboard.");
  }

  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  if (!clientId || !clientSecret) {
    throw new Error("GOOGLE_CLIENT_ID or GOOGLE_CLIENT_SECRET environment variable missing.");
  }

  const refreshToken = decryptToken(user.googleRefreshToken);
  if (!refreshToken) {
    throw new Error("Failed to decrypt Google refresh token. Please reconnect your account.");
  }

  const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      refresh_token: refreshToken,
      grant_type: "refresh_token",
    }),
  });

  const tokenData = await tokenRes.json();

  if (!tokenRes.ok || tokenData.error) {
    if (tokenData.error === "invalid_grant" || tokenData.error === "unauthorized_client") {
      // Mark disconnected if revoked
      await prisma.user.update({
        where: { id: userId },
        data: { googleConnected: false },
      });
      throw new Error("Google access was revoked or expired. Please reconnect your account.");
    }
    throw new Error(`Google token refresh failed: ${tokenData.error_description || tokenData.error || "Unknown error"}`);
  }

  const { access_token, expires_in } = tokenData;
  const tokenExpiry = new Date(Date.now() + (expires_in || 3600) * 1000);

  // Update token expiry in DB asynchronously
  prisma.user.update({
    where: { id: userId },
    data: { googleTokenExpiry: tokenExpiry },
  }).catch((err) => console.error("Failed to update token expiry:", err));

  return {
    accessToken: access_token,
    googleEmail: user.googleEmail,
  };
}

/**
 * Builds RFC2822 formatted raw MIME message base64url encoded.
 * Uses text/html MIME type so tracking pixels and HTML layout elements render properly.
 */
function buildRawMimeMessage(to: string, from: string, subject: string, body: string): string {
  const utf8Subject = `=?utf-8?B?${Buffer.from(subject).toString("base64")}?=`;

  // Format plain text body as HTML container with pre-wrap if not full HTML document
  const htmlContent =
    body.includes("<html") || body.includes("<body") || body.includes("<div") || body.includes("<p")
      ? body
      : `<div style="font-family: sans-serif; font-size: 14px; line-height: 1.6; color: #111827; white-space: pre-wrap;">${body}</div>`;

  const messageParts = [
    `From: ${from}`,
    `To: ${to}`,
    `Subject: ${utf8Subject}`,
    `Content-Type: text/html; charset=utf-8`,
    `MIME-Version: 1.0`,
    ``,
    htmlContent,
  ];

  const mimeString = messageParts.join("\r\n");
  return Buffer.from(mimeString)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

/**
 * Dispatches an email via Google Gmail API v1.
 * Retries once after a 401 Unauthorized before failing.
 */
export async function sendGmailEmail({ userId, to, subject, body }: SendGmailEmailParams): Promise<{ id: string }> {
  let { accessToken, googleEmail } = await getGoogleAccessToken(userId);
  const rawMessage = buildRawMimeMessage(to, googleEmail, subject, body);

  let response = await fetch("https://gmail.googleapis.com/gmail/v1/users/me/messages/send", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ raw: rawMessage }),
  });

  // Retry once on 401 Unauthorized
  if (response.status === 401) {
    console.warn("Gmail API returned 401 Unauthorized. Retrying with fresh access token...");
    const refreshed = await getGoogleAccessToken(userId);
    accessToken = refreshed.accessToken;
    googleEmail = refreshed.googleEmail;

    const freshRawMessage = buildRawMimeMessage(to, googleEmail, subject, body);

    response = await fetch("https://gmail.googleapis.com/gmail/v1/users/me/messages/send", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ raw: freshRawMessage }),
    });
  }

  const resData = await response.json();

  if (!response.ok || resData.error) {
    const errorDetails = resData.error?.message || resData.error || "Gmail API dispatch error";
    throw new Error(`Gmail Transmission Error: ${errorDetails}`);
  }

  return { id: resData.id || "N/A" };
}
