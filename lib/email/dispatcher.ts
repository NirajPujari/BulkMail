import { sendGmailEmail } from "./google";
import { SendProviderEmailParams } from "./mail";

/**
 * Extensible email provider dispatcher.
 * Currently routes all campaign email dispatches to Google Gmail API.
 */
export async function sendProviderEmail(params: SendProviderEmailParams): Promise<{ id: string }> {
  const provider = params.provider || "google";

  switch (provider) {
    case "google":
    default:
      return await sendGmailEmail(params);
  }
}
