import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { defaultEmailService } from "@/lib/email/service";
import crypto from "crypto";

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json(
        { message: "Email is required" },
        { status: 400 }
      );
    }

    const normalizedEmail = email.toLowerCase().trim();

    const user = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (!user) {
      return NextResponse.json(
        { message: "No account found with this email address" },
        { status: 404 }
      );
    }

    // Generate secure random reset token
    const token = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour expiry

    // Save token to DB
    await prisma.user.update({
      where: { id: user.id },
      data: {
        resetToken: token,
        resetTokenExpiry: expiresAt,
      },
    });

    // Build reset URL
    const origin = req.headers.get("origin") || req.nextUrl.origin || "http://localhost:3000";
    const resetUrl = `${origin}/reset-password?token=${token}`;

    try {
      await defaultEmailService.sendEmail({
        to: normalizedEmail,
        subject: "BulkMail - Password Reset Request",
        text: `Hello ${user.name},\n\nYou requested to reset your password for BulkMail.\n\nPlease click the link below to reset your password:\n${resetUrl}\n\nThis link will expire in 1 hour.\n\nIf you did not request a password reset, please ignore this email.`,
      });
    } catch (emailError) {
      console.error("Failed to send transactional reset email:", emailError);
      console.log(`[Development Mode Reset URL]: ${resetUrl}`);
    }

    return NextResponse.json({
      message: "Reset email sent successfully",
    });
  } catch (error) {
    console.error("Forgot password error:", error);
    return NextResponse.json(
      { message: "Internal server error during password reset" },
      { status: 500 }
    );
  }
}
