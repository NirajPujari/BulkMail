import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { verifyToken } from "@/lib/jwt";

function getAdminUserFromRequest(req: NextRequest) {
  const auth = req.headers.get("authorization");
  if (!auth || !auth.startsWith("Bearer ")) {
    return null;
  }
  const token = auth.slice(7);
  const payload = verifyToken(token);
  if (!payload || payload.role !== "admin") {
    return null;
  }
  return payload;
}

export async function GET(req: NextRequest) {
  try {
    const admin = getAdminUserFromRequest(req);
    if (!admin) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    const [totalUsers, totalCampaigns, campaigns, activeCampaigns] =
      await Promise.all([
        prisma.user.count(),
        prisma.campaign.count(),
        prisma.campaign.findMany({
          select: { sentCount: true },
        }),
        prisma.campaign.count({
          where: { status: "sending" },
        }),
      ]);

    const totalEmailsSent = campaigns.reduce(
      (acc: number, c: { sentCount: number }) => acc + c.sentCount,
      0,
    );

    return NextResponse.json({
      totalUsers,
      totalCampaigns,
      totalEmailsSent,
      activeCampaigns,
    });
  } catch (error) {
    console.error("Admin fetch stats error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}
