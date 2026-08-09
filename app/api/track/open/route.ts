import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// 1x1 Transparent PNG Image Buffer
const TRANSPARENT_PNG = Buffer.from(
  "iVBORw0KGgoAAAANSU56AKgAAAAgAAAAAQMAAAA6B9c7AAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAACXBIWXMAAA7EAAAOxAGVKw4bAAAADUlEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=",
  "base64"
);

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const executionId = url.searchParams.get("c");
    const rawEmail = url.searchParams.get("r");

    // Check for pre-fetch headers sent by email clients/scanners
    const purposeHeader =
      req.headers.get("purpose") ||
      req.headers.get("sec-purpose") ||
      req.headers.get("x-purpose");

    const isPrefetch =
      purposeHeader && purposeHeader.toLowerCase().includes("prefetch");

    const userAgent = req.headers.get("user-agent") || "Unknown";
    const ipAddress =
      req.headers.get("x-forwarded-for")?.split(",")[0] ||
      req.headers.get("x-real-ip") ||
      "127.0.0.1";

    console.log(`[Open Tracking Triggered] ExecId: ${executionId}, Recipient: ${rawEmail}, IP: ${ipAddress}, UserAgent: ${userAgent}, Prefetch: ${isPrefetch}`);

    // If request is a pre-fetch attempt by background scanner, return 1x1 PNG without logging open
    if (isPrefetch) {
      console.log(`[Open Tracking Ignored] Filtered out background prefetch request for ${rawEmail}`);
      return returnPixelResponse();
    }

    if (executionId && rawEmail) {
      const email = rawEmail.toLowerCase().trim();

      // Process open event asynchronously without blocking response
      (async () => {
        try {
          // Find recipient record for this exact campaign execution and email
          const recipientRecord = await prisma.campaignRecipient.findFirst({
            where: {
              executionId,
              email,
            },
          });

          if (recipientRecord) {
            const now = new Date();

            // Record open event log
            await prisma.campaignOpenEvent.create({
              data: {
                executionId,
                recipientId: recipientRecord.id,
                openedAt: now,
                ipAddress,
                userAgent,
              },
            });

            // Update recipient status to opened
            await prisma.campaignRecipient.update({
              where: { id: recipientRecord.id },
              data: {
                opened: true,
                openedAt: recipientRecord.openedAt || now,
                openCount: { increment: 1 },
              },
            });

            console.log(`[Open Tracked Successfully] Recorded open for ${email} in execution ${executionId}`);
          }
        } catch (dbError) {
          console.error("Failed to record email open tracking event:", dbError);
        }
      })();
    }
  } catch (error) {
    console.error("Tracking pixel error:", error);
  }

  return returnPixelResponse();
}

function returnPixelResponse() {
  return new NextResponse(TRANSPARENT_PNG, {
    status: 200,
    headers: {
      "Content-Type": "image/png",
      "Content-Length": TRANSPARENT_PNG.length.toString(),
      "Cache-Control":
        "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0",
      Pragma: "no-cache",
      Expires: "0",
    },
  });
}
