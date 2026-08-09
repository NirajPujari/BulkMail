import crypto from "crypto";

const SECRET = process.env.JWT_SECRET || "dootx_secure_tracking_secret";

/**
 * Gets the base application URL for generating public tracking links.
 */
export function getBaseUrl(): string {
  const url =
    process.env.NEXT_PUBLIC_APP_URL ||
    process.env.APP_URL ||
    "http://localhost:3000";
  return url.replace(/\/+$/, "");
}

/**
 * Generates an HMAC signature to secure tracking parameters against tampering.
 */
export function generateTrackingSignature(
  campaignId: string,
  recipientEmail: string,
  extra = ""
): string {
  const data = `${campaignId}:${recipientEmail.toLowerCase().trim()}:${extra}`;
  return crypto
    .createHmac("sha256", SECRET)
    .update(data)
    .digest("hex")
    .substring(0, 16);
}

/**
 * Safely verifies tracking parameter signatures.
 */
export function verifyTrackingSignature(
  signature: string,
  campaignId: string,
  recipientEmail: string,
  extra = ""
): boolean {
  if (!signature || typeof signature !== "string") return false;
  try {
    const expected = generateTrackingSignature(campaignId, recipientEmail, extra);
    return crypto.timingSafeEqual(
      Buffer.from(signature.trim()),
      Buffer.from(expected.trim())
    );
  } catch {
    return false;
  }
}

/**
 * Converts a plain text email body to clean HTML with paragraph breaks.
 */
export function convertTextToHtml(textBody: string): string {
  if (!textBody) return "<div></div>";

  // If text already looks like HTML (has html tags), return as is
  if (/<[a-z][\s\S]*>/i.test(textBody)) {
    return textBody;
  }

  // Escape HTML tags
  const escaped = textBody
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

  // Convert URLs to standard HTML anchor tags (direct, unwrapped)
  const urlRegex = /(https?:\/\/[^\s<]+)/g;
  const linked = escaped.replace(urlRegex, (url) => {
    return `<a href="${url}" target="_blank" rel="noopener noreferrer">${url}</a>`;
  });

  // Convert line breaks to <br />
  const formattedHtml = linked.replace(/\r\n|\r|\n/g, "<br />");

  return `<div style="font-family: Arial, sans-serif; font-size: 14px; line-height: 1.6; color: #111827;">${formattedHtml}</div>`;
}

/**
 * Appends a 1x1 transparent open tracking GIF pixel to the email HTML body.
 */
export function injectTrackingPixel(
  bodyHtml: string,
  campaignId: string,
  recipientEmail: string
): string {
  const baseUrl = getBaseUrl();
  const sig = generateTrackingSignature(campaignId, recipientEmail, "open");
  const pixelUrl = `${baseUrl}/api/track/open?c=${encodeURIComponent(
    campaignId
  )}&r=${encodeURIComponent(recipientEmail)}&sig=${sig}`;

  const pixelTag = `<img src="${pixelUrl}" width="1" height="1" border="0" alt="" style="display:none !important; max-height:0px; max-width:0px; overflow:hidden; opacity:0;" />`;

  // Append before </body> if present, else at the end
  if (/<\/body>/i.test(bodyHtml)) {
    return bodyHtml.replace(/<\/body>/i, `${pixelTag}</body>`);
  }
  return `${bodyHtml}\n${pixelTag}`;
}
