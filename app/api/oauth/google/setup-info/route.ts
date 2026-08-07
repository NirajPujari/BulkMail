import { NextRequest, NextResponse } from "next/server";
import { decryptToken } from "@/lib/crypto";

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const token = url.searchParams.get("token");

    if (!token) {
      return NextResponse.json({ message: "Token missing" }, { status: 400 });
    }

    const decrypted = decryptToken(token);
    if (!decrypted) {
      return NextResponse.json({ message: "Invalid or expired token" }, { status: 400 });
    }

    const { email, name, expiresAt } = JSON.parse(decrypted);

    if (expiresAt && Date.now() > expiresAt) {
      return NextResponse.json({ message: "Setup session expired" }, { status: 400 });
    }

    return NextResponse.json({
      email,
      name,
    });
  } catch (error) {
    console.error("Google setup info error:", error);
    return NextResponse.json({ message: "Invalid setup token" }, { status: 400 });
  }
}
