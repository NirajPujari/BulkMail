import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { verifyToken } from "@/lib/jwt";

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

export async function GET(req: NextRequest) {
  try {
    const userId = getUserIdFromRequest(req);
    if (!userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const url = new URL(req.url);
    const id = url.searchParams.get("id");

    if (id) {
      const campaign = await prisma.campaign.findUnique({
        where: { id },
      });

      if (!campaign || campaign.userId !== userId) {
        return NextResponse.json({ message: "Forbidden or not found" }, { status: 403 });
      }

      return NextResponse.json(campaign);
    }

    const campaigns = await prisma.campaign.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(campaigns);
  } catch (error) {
    console.error("Fetch campaigns error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const userId = getUserIdFromRequest(req);
    if (!userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { subject, body, recipients, status, sentCount, totalCount } = await req.json();

    if (!subject || !body || !recipients) {
      return NextResponse.json(
        { message: "Subject, body, and recipients are required" },
        { status: 400 }
      );
    }

    const campaign = await prisma.campaign.create({
      data: {
        subject,
        body,
        recipients,
        status: status || "completed",
        sentCount: sentCount || 0,
        totalCount: totalCount || 0,
        userId,
      },
    });

    return NextResponse.json(campaign);
  } catch (error) {
    console.error("Create campaign error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const userId = getUserIdFromRequest(req);
    if (!userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { id, subject, body, recipients, status, sentCount, totalCount } = await req.json();

    if (!id) {
      return NextResponse.json({ message: "Campaign ID required" }, { status: 400 });
    }

    // Verify ownership
    const existing = await prisma.campaign.findUnique({ where: { id } });
    if (!existing || existing.userId !== userId) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    const updated = await prisma.campaign.update({
      where: { id },
      data: {
        subject,
        body,
        recipients,
        status: status || existing.status,
        sentCount: sentCount !== undefined ? sentCount : existing.sentCount,
        totalCount: totalCount !== undefined ? totalCount : existing.totalCount,
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Update campaign error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const userId = getUserIdFromRequest(req);
    if (!userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const url = new URL(req.url);
    const id = url.searchParams.get("id");

    if (!id) {
      return NextResponse.json({ message: "Campaign ID required" }, { status: 400 });
    }

    // Verify ownership
    const campaign = await prisma.campaign.findUnique({ where: { id } });
    if (!campaign || campaign.userId !== userId) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    await prisma.campaign.delete({ where: { id } });

    return NextResponse.json({ message: "Campaign deleted successfully" });
  } catch (error) {
    console.error("Delete campaign error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
