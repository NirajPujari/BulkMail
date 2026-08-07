import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/jwt";
import { prisma } from "@/lib/db";
import { getUserQuotaInfo } from "@/lib/email/quota";
import { hashPassword, verifyPassword } from "@/lib/crypto";

export async function GET(req: NextRequest) {
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

    const dbUser = await prisma.user.findUnique({
      where: { id: userPayload.userId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        googleConnected: true,
        googleEmail: true,
      },
    });

    if (!dbUser) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const quotaInfo = await getUserQuotaInfo(dbUser.id);

    return NextResponse.json({
      user: {
        userId: dbUser.id,
        name: dbUser.name,
        email: dbUser.email,
        role: dbUser.role,
        googleConnected: dbUser.googleConnected,
        googleEmail: dbUser.googleEmail,
        emailsSentToday: quotaInfo.emailsSentToday,
        dailyQuotaLimit: quotaInfo.dailyQuotaLimit,
        remainingQuota: quotaInfo.remainingQuota,
      },
    });
  } catch (error) {
    console.error("Fetch me error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
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

    const { name, currentPassword, newPassword } = await req.json();

    const dbUser = await prisma.user.findUnique({
      where: { id: userPayload.userId },
    });

    if (!dbUser) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const updateData: { name?: string; password?: string } = {};

    // Name update
    if (name !== undefined) {
      const trimmedName = String(name).trim();
      if (!trimmedName) {
        return NextResponse.json({ message: "Display name cannot be empty" }, { status: 400 });
      }
      updateData.name = trimmedName;
    }

    // Password update
    if (currentPassword || newPassword) {
      if (!currentPassword || !newPassword) {
        return NextResponse.json(
          { message: "Both current password and new password are required" },
          { status: 400 }
        );
      }

      if (newPassword.length < 6) {
        return NextResponse.json(
          { message: "New password must be at least 6 characters long" },
          { status: 400 }
        );
      }

      const isCurrentValid = verifyPassword(currentPassword, dbUser.password);
      if (!isCurrentValid) {
        return NextResponse.json(
          { message: "Current password is incorrect" },
          { status: 400 }
        );
      }

      updateData.password = hashPassword(newPassword);
    }

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json({ message: "No updates provided" }, { status: 400 });
    }

    const updatedUser = await prisma.user.update({
      where: { id: dbUser.id },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        googleConnected: true,
        googleEmail: true,
      },
    });

    const quotaInfo = await getUserQuotaInfo(updatedUser.id);

    return NextResponse.json({
      message: "Profile updated successfully",
      user: {
        userId: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        googleConnected: updatedUser.googleConnected,
        googleEmail: updatedUser.googleEmail,
        emailsSentToday: quotaInfo.emailsSentToday,
        dailyQuotaLimit: quotaInfo.dailyQuotaLimit,
        remainingQuota: quotaInfo.remainingQuota,
      },
    });
  } catch (error) {
    console.error("Update me error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
