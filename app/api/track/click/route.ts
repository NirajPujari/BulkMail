import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { verifyTrackingSignature } from "@/lib/email/tracking";

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const campaignId = url.searchParams.get("c");
  const recipientEmail = url.searchParams.get("r");
  const targetUrl = url.searchParams.get("target");
  const signature = url.searchParams.get("sig");

  // Validate target URL scheme to prevent open redirect vulnerabilities
  let safeDestination = "/";
  if (targetUrl) {
    try {
      const parsed = new URL(targetUrl);
      if (parsed.protocol === "http:" || parsed.protocol === "https:") {
        safeDestination = parsed.href;
      }
    } catch {
      console.warn("Invalid target URL provided to click tracker:", targetUrl);
    }
  }

  try {
    if (campaignId && recipientEmail && safeDestination !== "/") {
      const normalizedEmail = recipientEmail.toLowerCase().trim();
      const isValidSig = signature
        ? verifyTrackingSignature(signature, campaignId, normalizedEmail, targetUrl || "")
        : true;

      if (isValidSig) {
        const ip =
          req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
          req.headers.get("x-real-ip") ||
          undefined;
        const userAgent = req.headers.get("user-agent") || undefined;

        const campaignExists = await prisma.campaign.findUnique({
          where: { id: campaignId },
          select: { id: true },
        });

        if (campaignExists) {
          await prisma.campaignEvent.create({
            data: {
              campaignId,
              recipientEmail: normalizedEmail,
              type: "click",
              targetUrl: safeDestination,
              ip,
              userAgent,
            },
          });
        }
      }
    }
  } catch (error) {
    console.error("Click tracking redirect error:", error);
  }

  return NextResponse.redirect(safeDestination, 302);
}
