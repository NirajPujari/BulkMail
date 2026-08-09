import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { verifyTrackingSignature } from "@/lib/email/tracking";

// 1x1 transparent GIF image buffer
const TRANSPARENT_GIF = Buffer.from(
  "R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7",
  "base64"
);

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const campaignId = url.searchParams.get("c");
    const recipientEmail = url.searchParams.get("r");
    const signature = url.searchParams.get("sig");

    if (campaignId && recipientEmail) {
      const normalizedEmail = recipientEmail.toLowerCase().trim();
      const isValidSig = signature
        ? verifyTrackingSignature(signature, campaignId, normalizedEmail, "open")
        : true;

      if (isValidSig) {
        const ip =
          req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
          req.headers.get("x-real-ip") ||
          undefined;
        const userAgent = req.headers.get("user-agent") || undefined;

        // Verify campaign exists before logging event
        const campaignExists = await prisma.campaign.findUnique({
          where: { id: campaignId },
          select: { id: true },
        });

        if (campaignExists) {
          // Asynchronously record open event
          await prisma.campaignEvent.create({
            data: {
              campaignId,
              recipientEmail: normalizedEmail,
              type: "open",
              ip,
              userAgent,
            },
          });
        }
      }
    }
  } catch (error) {
    console.error("Open tracking pixel error:", error);
  }

  // Return transparent 1x1 GIF with strict no-cache headers
  return new NextResponse(TRANSPARENT_GIF, {
    status: 200,
    headers: {
      "Content-Type": "image/gif",
      "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0",
      Pragma: "no-cache",
      Expires: "0",
    },
  });
}
