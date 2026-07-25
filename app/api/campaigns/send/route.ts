import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { verifyToken } from "@/lib/jwt";
import { resendClients } from "@/lib/email/providers";

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

    const { id, subject, body, recipients, senderEmail } = await req.json();

    if (!subject || !body || !recipients || !senderEmail) {
      return NextResponse.json(
        { message: "Subject, body, recipients, and senderEmail are required" },
        { status: 400 }
      );
    }

    // Parse recipients
    const emails = recipients
      .split(/[\n,;]+/)
      .map((email: string) => email.trim())
      .filter((email: string) => email.length > 0 && email.includes("@"));

    if (emails.length === 0) {
      return NextResponse.json(
        { message: "No valid recipient email addresses found" },
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
          recipients: emails.join(", "),
          totalCount: emails.length,
          sentCount: 0,
          logs: `[System] Resuming draft campaign: "${subject}"...\n[System] Found ${emails.length} recipient(s).`,
        },
      });
    } else {
      const campaign = await prisma.campaign.create({
        data: {
          subject,
          body,
          recipients: emails.join(", "),
          status: "sending",
          sentCount: 0,
          totalCount: emails.length,
          logs: `[System] Initializing new campaign: "${subject}"...\n[System] Found ${emails.length} recipient(s).`,
          userId,
        },
      });
      campaignId = campaign.id;
    }

    // Trigger background send process (DO NOT await this, let it run)
    sendCampaignBackground(campaignId, subject, body, emails, senderEmail);

    // Return status immediately
    return NextResponse.json({
      message: "Campaign queued and starting execution in background.",
      campaignId,
    });
  } catch (error) {
    console.error("Queue campaign error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

async function sendCampaignBackground(
  campaignId: string,
  subject: string,
  body: string,
  emails: string[],
  senderEmail: string
) {
  let sent = 0;
  let failed = 0;
  let logsAccumulator = "";

  // Helper to load logs and append new line
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

  // Determine active clients
  const activeClients: { client: any; label: string }[] = [];
  if (process.env.RESENT_API_1 || process.env.RESEND_API_KEY_1) {
    activeClients.push({ client: resendClients[0], label: "Provider Key #1" });
  }
  if (process.env.RESENT_API_2 || process.env.RESEND_API_KEY_2) {
    activeClients.push({ client: resendClients[1], label: "Provider Key #2" });
  }

  if (activeClients.length === 0) {
    await appendLog("[Failed] Both RESENT_API_1 and RESENT_API_2 are empty/missing. Cannot transmit.");
    try {
      await prisma.campaign.update({
        where: { id: campaignId },
        data: { status: "failed" },
      });
    } catch (e) {
      console.error(e);
    }
    return;
  }

  await appendLog(`[System] Round-robin initialized with ${activeClients.length} provider keys.`);
  await appendLog(`[System] Authenticating sender identity: <${senderEmail}>... Success.`);

  for (let i = 0; i < emails.length; i++) {
    const email = emails[i];
    const clientData = activeClients[i % activeClients.length];

    await appendLog(`[Sending] Dispatching via ${clientData.label} to ${email}...`);

    try {
      const { data, error } = await clientData.client.emails.send({
        from: senderEmail,
        to: email,
        subject: subject,
        text: body,
      });

      if (error) {
        failed++;
        await appendLog(`[Failed] SMTP/Resend bounce for ${email}: ${error.message}`);
      } else {
        sent++;
        await appendLog(`[Success] Delivered to ${email} (250 OK, ID: ${data?.id || "N/A"})`);
      }
    } catch (err: any) {
      failed++;
      await appendLog(`[Failed] Error dispatching to ${email}: ${err?.message || err}`);
    }

    // Update database periodically during loop to reflect progress
    try {
      await prisma.campaign.update({
        where: { id: campaignId },
        data: {
          sentCount: sent,
        },
      });
    } catch (e) {
      console.error("Failed to update sent count:", e);
    }

    // Delay between emails (e.g. 1 second)
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }

  const finalStatus = failed === emails.length ? "failed" : "completed";
  await appendLog(`[System] Background dispatcher finished.`);
  await appendLog(`[Summary] Sent: ${sent}, Bounced: ${failed}, Total: ${emails.length}`);

  try {
    await prisma.campaign.update({
      where: { id: campaignId },
      data: {
        status: finalStatus,
      },
    });
  } catch (e) {
    console.error("Failed to set final status:", e);
  }
}
