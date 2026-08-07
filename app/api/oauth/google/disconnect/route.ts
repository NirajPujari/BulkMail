import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/jwt";
import { prisma } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const auth = req.headers.get("authorization");
    if (!auth || !auth.startsWith("Bearer ")) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const token = auth.slice(7);
    const userPayload = verifyToken(token);

    if (!userPayload) {
      return NextResponse.json({ message: "Invalid token" }, { status: 401 });
    }

    await prisma.user.update({
      where: { id: userPayload.userId },
      data: {
        googleConnected: false,
        googleEmail: null,
        googleRefreshToken: null,
        googleTokenExpiry: null,
      },
    });

    return NextResponse.json({
      message: "Google account disconnected successfully.",
    });
  } catch (error) {
    console.error("Disconnect Google error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
