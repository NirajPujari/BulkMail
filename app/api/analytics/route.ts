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
    const executionId = url.searchParams.get("id");

    // GET single campaign execution detail
    if (executionId) {
      const execution = await prisma.campaignExecution.findFirst({
        where: {
          id: executionId,
          userId, // Strict data isolation by userId
        },
        include: {
          campaign: {
            select: { subject: true },
          },
          recipientRecords: {
            orderBy: { createdAt: "asc" },
          },
        },
      });

      if (!execution) {
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

      if (execution.recipientRecords.length > 0) {
        recipientItems = execution.recipientRecords.map((r) => ({
          email: r.email,
          opened: r.opened,
          openedAt: r.openedAt,
          openCount: r.openCount,
          status: r.status,
        }));
      } else {
        // Fallback parsing from stored recipients JSON string
        try {
          const parsed = JSON.parse(execution.recipients);
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
          const emails = execution.recipients
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
      const notOpenedCount = Math.max(0, execution.sentCount - openedCount);
      const openRate =
        execution.sentCount > 0
          ? Math.round((openedCount / execution.sentCount) * 1000) / 10
          : 0;

      return NextResponse.json({
        id: execution.id,
        campaignId: execution.campaignId,
        subject: execution.subject || execution.campaign?.subject || "Untitled Campaign",
        body: execution.body,
        status: execution.status,
        launchedAt: execution.createdAt,
        totalCount: execution.totalCount,
        sentCount: execution.sentCount,
        openedCount,
        notOpenedCount,
        openRate,
        logs: execution.logs,
        recipients: recipientItems,
      });
    }

    // GET list of all campaign executions for this user (Bug 2 fix: Queries CampaignExecution table)
    const executions = await prisma.campaignExecution.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      include: {
        campaign: {
          select: { subject: true },
        },
        recipientRecords: {
          select: {
            opened: true,
          },
        },
      },
    });

    const executionList = executions.map((exec) => {
      const openedCount = exec.recipientRecords.filter((r) => r.opened).length;
      const openRate =
        exec.sentCount > 0
          ? Math.round((openedCount / exec.sentCount) * 1000) / 10
          : 0;

      return {
        id: exec.id,
        campaignId: exec.campaignId,
        subject: exec.subject || exec.campaign?.subject || "Untitled Campaign",
        status: exec.status,
        sentCount: exec.sentCount,
        totalCount: exec.totalCount,
        openedCount,
        openRate,
        launchedAt: exec.createdAt,
      };
    });

    return NextResponse.json(executionList);
  } catch (error) {
    console.error("Fetch campaign analytics error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
