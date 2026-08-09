import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { verifyToken } from "@/lib/jwt";

function getUserIdFromRequest(req: NextRequest): string | null {
  const auth = req.headers.get("authorization");
  if (!auth || !auth.startsWith("Bearer ")) {
    return null;
  }
  const token = auth.slice(7);
  const payload = verifyToken(token);
  return payload ? payload.userId : null;
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const userId = getUserIdFromRequest(req);
    if (!userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { id: campaignId } = await params;

    if (!campaignId) {
      return NextResponse.json(
        { message: "Campaign ID is required" },
        { status: 400 }
      );
    }

    // Fetch campaign and verify user ownership (Data Isolation)
    const campaign = await prisma.campaign.findUnique({
      where: { id: campaignId },
      include: {
        relaunchedFrom: {
          select: {
            id: true,
            subject: true,
            createdAt: true,
          },
        },
        relaunches: {
          select: {
            id: true,
            subject: true,
            createdAt: true,
            status: true,
          },
        },
      },
    });

    if (!campaign || campaign.userId !== userId) {
      return NextResponse.json(
        { message: "Campaign not found or access forbidden" },
        { status: 404 }
      );
    }

    // Fetch all events for THIS campaign exclusively (Strict Isolation)
    const events = await prisma.campaignEvent.findMany({
      where: { campaignId },
      orderBy: { createdAt: "desc" },
    });

    // Fetch relational recipient data for THIS campaign
    const recipientRecords = await prisma.campaignRecipient.findMany({
      where: { campaignId },
    });

    // Compute Open Events & Unique Opens
    const openEvents = events.filter((e) => e.type === "open");
    const uniqueOpenEmails = new Set(openEvents.map((e) => e.recipientEmail));
    const totalOpens = openEvents.length;
    const uniqueOpens = uniqueOpenEmails.size;

    // Compute Bounce Events
    const bounceEvents = events.filter((e) => e.type === "bounce");

    // Metrics & Safe Division
    const sentCount = campaign.sentCount;
    const totalCount = campaign.totalCount > 0 ? campaign.totalCount : recipientRecords.length;
    const bounceCount = campaign.bounceCount > 0 ? campaign.bounceCount : bounceEvents.length;

    const openRate =
      sentCount > 0 ? Math.min(100, Math.round((uniqueOpens / sentCount) * 1000) / 10) : 0;
    const bounceRate =
      totalCount > 0 ? Math.min(100, Math.round((bounceCount / totalCount) * 1000) / 10) : 0;

    // Build recipient-level telemetry activity map
    const recipientActivityMap = new Map<
      string,
      {
        email: string;
        variables: Record<string, string>;
        status: string;
        sentAt: Date | null;
        errorMessage: string | null;
        openCount: number;
        lastActivity: Date | null;
      }
    >();

    // Initialize with database recipients or parsed JSON recipients
    if (recipientRecords.length > 0) {
      recipientRecords.forEach((r) => {
        let varsObj = {};
        try {
          if (r.variables) varsObj = JSON.parse(r.variables);
        } catch {}
        recipientActivityMap.set(r.email.toLowerCase(), {
          email: r.email,
          variables: varsObj,
          status: r.status,
          sentAt: r.sentAt,
          errorMessage: r.errorMessage,
          openCount: 0,
          lastActivity: r.sentAt,
        });
      });
    } else if (campaign.recipients) {
      try {
        const parsedRecipients = JSON.parse(campaign.recipients);
        if (Array.isArray(parsedRecipients)) {
          parsedRecipients.forEach((item: any) => {
            const e = (item.email || String(item)).toLowerCase().trim();
            recipientActivityMap.set(e, {
              email: item.email || e,
              variables: item.variables || {},
              status: sentCount > 0 ? "sent" : "pending",
              sentAt: null,
              errorMessage: null,
              openCount: 0,
              lastActivity: null,
            });
          });
        }
      } catch {}
    }

    // Populate open events per recipient
    events.forEach((ev) => {
      const emailKey = ev.recipientEmail.toLowerCase();
      const existing = recipientActivityMap.get(emailKey) || {
        email: ev.recipientEmail,
        variables: {},
        status: "sent",
        sentAt: null,
        errorMessage: null,
        openCount: 0,
        lastActivity: ev.createdAt,
      };

      if (ev.type === "open") existing.openCount += 1;
      if (!existing.lastActivity || new Date(ev.createdAt) > new Date(existing.lastActivity)) {
        existing.lastActivity = ev.createdAt;
      }

      recipientActivityMap.set(emailKey, existing);
    });

    const recipientActivityList = Array.from(recipientActivityMap.values());

    // Build Time-Series Engagement Chart Data (grouped by hour/day)
    const timelineMap = new Map<string, { time: string; opens: number }>();

    events.forEach((ev) => {
      const d = new Date(ev.createdAt);
      const hourKey = `${d.getMonth() + 1}/${d.getDate()} ${String(d.getHours()).padStart(2, "0")}:00`;
      const current = timelineMap.get(hourKey) || { time: hourKey, opens: 0 };
      if (ev.type === "open") current.opens += 1;
      timelineMap.set(hourKey, current);
    });

    const timeline = Array.from(timelineMap.values()).reverse();

    return NextResponse.json({
      campaign: {
        id: campaign.id,
        subject: campaign.subject,
        body: campaign.body,
        status: campaign.status,
        createdAt: campaign.createdAt,
        updatedAt: campaign.updatedAt,
        logs: campaign.logs,
        relaunchedFrom: campaign.relaunchedFrom,
        relaunches: campaign.relaunches,
      },
      metrics: {
        totalCount,
        sentCount,
        bounceCount,
        totalOpens,
        uniqueOpens,
        openRate,
        bounceRate,
      },
      recipients: recipientActivityList,
      timeline,
      recentEvents: events.slice(0, 50),
    });
  } catch (error) {
    console.error("Campaign analytics error:", error);
    return NextResponse.json(
      { message: "Failed to fetch campaign analytics" },
      { status: 500 }
    );
  }
}
