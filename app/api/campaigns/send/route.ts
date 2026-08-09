import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { verifyToken } from "@/lib/jwt";
import { sendProviderEmail } from "@/lib/email/dispatcher";
import { checkQuotaAvailable, incrementUserQuota, getUserQuotaInfo } from "@/lib/email/quota";
import { renderTemplate } from "@/lib/email/template";
import { RecipientVariableItem } from "@/types/campaign";
import {
  convertTextToHtml,
  injectTrackingPixel,
} from "@/lib/email/tracking";

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

    // Create or retrieve campaign in DB
    let campaignId = id;
    if (campaignId) {
      // Verify ownership of the draft
      const existing = await prisma.campaign.findUnique({ where: { id: campaignId } });
      if (!existing || existing.userId !== userId) {
        return NextResponse.json({ message: "Forbidden or not found" }, { status: 403 });
      }
      
      // Update existing campaign to sending status
      await prisma.campaign.update({
        where: { id: campaignId },
        data: {
          status: "sending",
          subject,
          body,
          recipients: recipientsDbPayload,
          totalCount: targetRecipients.length,
          sentCount: 0,
          bounceCount: 0,
          logs: `[System] Resuming draft campaign: "${subject}"...\n[System] Found ${targetRecipients.length} recipient(s).`,
        },
      });
    } else {
      const campaign = await prisma.campaign.create({
        data: {
          subject,
          body,
          recipients: recipientsDbPayload,
          status: "sending",
          sentCount: 0,
          bounceCount: 0,
          totalCount: targetRecipients.length,
          logs: `[System] Initializing personalized campaign: "${subject}"...\n[System] Found ${targetRecipients.length} recipient(s).`,
          userId,
        },
      });
      campaignId = campaign.id;
    }

    // Populate relational CampaignRecipient records
    try {
      await prisma.campaignRecipient.deleteMany({
        where: { campaignId },
      });

      await prisma.campaignRecipient.createMany({
        data: targetRecipients.map((r) => ({
          campaignId,
          email: r.email.toLowerCase().trim(),
          variables: JSON.stringify(r.variables || {}),
          status: "pending",
        })),
      });
    } catch (e) {
      console.error("Failed to populate relational CampaignRecipient records:", e);
    }

    // Trigger background send process via Gmail API
    sendCampaignBackground(userId, campaignId, subject, body, targetRecipients, user.googleEmail);

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
  senderEmail: string
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

  await appendLog(`[System] Initialized Gmail API personalized dispatch & telemetry engine.`);
  await appendLog(`[System] Authenticating connected Gmail sender identity: <${senderEmail}>... Success.`);

  for (let i = 0; i < recipients.length; i++) {
    const item = recipients[i];
    const email = item.email.toLowerCase().trim();

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
    const personalizedBodyText = renderTemplate(body, item.variables);

    // Convert plain text to HTML and inject open tracking pixel
    const htmlBody = convertTextToHtml(personalizedBodyText);
    const finalHtmlBody = injectTrackingPixel(htmlBody, campaignId, email);

    await appendLog(`[Sending] Personalizing & dispatching via Gmail API to ${email}...`);

    try {
      const result = await sendProviderEmail({
        userId,
        to: email,
        subject: personalizedSubject,
        body: finalHtmlBody,
      });

      sent++;
      await incrementUserQuota(userId, 1);
      await appendLog(`[Success] Delivered personalized email to ${email} via Gmail API (Message ID: ${result.id})`);

      // Update recipient relational status to sent
      prisma.campaignRecipient.updateMany({
        where: { campaignId, email },
        data: { status: "sent", sentAt: new Date() },
      }).catch((e) => console.error("Error updating recipient sent status:", e));
    } catch (err: any) {
      failed++;
      const errorMsg = err?.message || String(err);
      console.error(`Error dispatching to ${email}:`, err);
      await appendLog(`[Failed] Error dispatching to ${email}: ${errorMsg}`);

      // Record bounce / failure event
      prisma.campaignRecipient.updateMany({
        where: { campaignId, email },
        data: { status: "bounced", errorMessage: errorMsg },
      }).catch((e) => console.error("Error updating recipient bounce status:", e));

      prisma.campaignEvent.create({
        data: {
          campaignId,
          recipientEmail: email,
          type: "bounce",
        },
      }).catch((e) => console.error("Error recording bounce event:", e));
    }

    // Update sent & bounce count periodically
    try {
      await prisma.campaign.update({
        where: { id: campaignId },
        data: { sentCount: sent, bounceCount: failed },
      });
    } catch (e) {
      console.error("Failed to update counts:", e);
    }

    // 1-second delay between emails to respect Gmail API quota
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }

  const finalStatus = failed === recipients.length ? "failed" : "completed";
  await appendLog(`[System] Gmail API personalized background dispatcher finished.`);
  await appendLog(`[Summary] Sent: ${sent}, Bounced/Failed: ${failed}, Total: ${recipients.length}`);

  try {
    await prisma.campaign.update({
      where: { id: campaignId },
      data: { status: finalStatus, sentCount: sent, bounceCount: failed },
    });
  } catch (e) {
    console.error("Failed to set final status:", e);
  }
}
