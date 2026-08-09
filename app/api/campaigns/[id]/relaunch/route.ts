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

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const userId = getUserIdFromRequest(req);
    if (!userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { id: originalCampaignId } = await params;

    if (!originalCampaignId) {
      return NextResponse.json(
        { message: "Original campaign ID is required" },
        { status: 400 }
      );
    }

    // Fetch original campaign and verify user ownership
    const originalCampaign = await prisma.campaign.findUnique({
      where: { id: originalCampaignId },
    });

    if (!originalCampaign || originalCampaign.userId !== userId) {
      return NextResponse.json(
        { message: "Original campaign not found or forbidden" },
        { status: 404 }
      );
    }

    // Create a new campaign instance preserving original configuration & recipient data
    const relaunchedSubject = originalCampaign.subject.startsWith("[Relaunch]")
      ? originalCampaign.subject
      : `[Relaunch] ${originalCampaign.subject}`;

    const newCampaign = await prisma.campaign.create({
      data: {
        subject: relaunchedSubject,
        body: originalCampaign.body,
        recipients: originalCampaign.recipients,
        status: "draft",
        sentCount: 0,
        bounceCount: 0,
        totalCount: originalCampaign.totalCount,
        logs: `[System] Relaunched campaign created from original execution ID: "${originalCampaign.id}".\n[System] Ready for review and dispatch.`,
        relaunchedFromId: originalCampaign.id,
        userId: userId,
      },
    });

    return NextResponse.json({
      message: "Campaign relaunched successfully as a new draft execution.",
      newCampaignId: newCampaign.id,
      campaign: newCampaign,
    });
  } catch (error) {
    console.error("Relaunch campaign error:", error);
    return NextResponse.json(
      { message: "Failed to relaunch campaign" },
      { status: 500 }
    );
  }
}
