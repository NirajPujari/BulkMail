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

export async function GET(req: NextRequest) {
  try {
    const userId = getUserIdFromRequest(req);
    if (!userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const url = new URL(req.url);
    const campaignId = url.searchParams.get("id");

    // GET single campaign execution detail
    if (campaignId) {
      const campaign = await prisma.campaign.findFirst({
        where: {
          id: campaignId,
          userId, // Strict data isolation by userId
        },
        include: {
          recipientRecords: {
            orderBy: { createdAt: "asc" },
          },
        },
      });

      if (!campaign) {
        return NextResponse.json(
          { message: "Campaign execution not found or forbidden" },
          { status: 404 }
        );
      }

      // Parse recipient variable fallback list if recipientRecords is empty
      let recipientItems: Array<{
        email: string;
        opened: boolean;
        openedAt: Date | null;
        openCount: number;
        status: string;
      }> = [];

      if (campaign.recipientRecords.length > 0) {
        recipientItems = campaign.recipientRecords.map((r) => ({
          email: r.email,
          opened: r.opened,
          openedAt: r.openedAt,
          openCount: r.openCount,
          status: r.status,
        }));
      } else {
        // Fallback parsing from stored recipients JSON string
        try {
          const parsed = JSON.parse(campaign.recipients);
          if (Array.isArray(parsed)) {
            recipientItems = parsed.map((item: any) => ({
              email: typeof item === "string" ? item : item.email,
              opened: false,
              openedAt: null,
              openCount: 0,
              status: "sent",
            }));
          }
        } catch {
          const emails = campaign.recipients
            .split(/[\n,;]+/)
            .map((e) => e.trim())
            .filter((e) => e.length > 0 && e.includes("@"));

          recipientItems = emails.map((e) => ({
            email: e,
            opened: false,
            openedAt: null,
            openCount: 0,
            status: "sent",
          }));
        }
      }

      const openedCount = recipientItems.filter((r) => r.opened).length;
      const notOpenedCount = Math.max(0, campaign.sentCount - openedCount);
      const openRate =
        campaign.sentCount > 0
          ? Math.round((openedCount / campaign.sentCount) * 1000) / 10
          : 0;

      return NextResponse.json({
        id: campaign.id,
        subject: campaign.subject,
        body: campaign.body,
        status: campaign.status,
        launchedAt: campaign.createdAt,
        totalCount: campaign.totalCount,
        sentCount: campaign.sentCount,
        openedCount,
        notOpenedCount,
        openRate,
        logs: campaign.logs,
        recipients: recipientItems,
      });
    }

    // GET list of all campaign executions for this user
    const campaigns = await prisma.campaign.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      include: {
        recipientRecords: {
          select: {
            opened: true,
          },
        },
      },
    });

    const executionList = campaigns.map((c) => {
      const openedCount = c.recipientRecords.filter((r) => r.opened).length;
      const openRate =
        c.sentCount > 0
          ? Math.round((openedCount / c.sentCount) * 1000) / 10
          : 0;

      return {
        id: c.id,
        subject: c.subject,
        status: c.status,
        sentCount: c.sentCount,
        totalCount: c.totalCount,
        openedCount,
        openRate,
        launchedAt: c.createdAt,
      };
    });

    return NextResponse.json(executionList);
  } catch (error) {
    console.error("Fetch campaign analytics error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
