import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/jwt";
import { encryptToken } from "@/lib/crypto";

export async function GET(req: NextRequest) {
  try {
    const clientId = process.env.GOOGLE_CLIENT_ID;
    if (!clientId) {
      return NextResponse.json(
        { message: "GOOGLE_CLIENT_ID environment variable is missing" },
        { status: 500 }
      );
    }

    const url = new URL(req.url);
    const token = url.searchParams.get("token");
    const mode = url.searchParams.get("mode");

    let statePayload: string;

    if (mode === "auth") {
      // User is logging in or signing up via Google OAuth
      statePayload = JSON.stringify({
        mode: "auth",
        timestamp: Date.now(),
      });
    } else if (token) {
      // User is connecting Google account from dashboard
      const userPayload = verifyToken(token);
      if (!userPayload) {
        return NextResponse.json(
          { message: "Invalid or expired token" },
          { status: 401 }
        );
      }
      statePayload = JSON.stringify({
        userId: userPayload.userId,
        timestamp: Date.now(),
      });
    } else {
      return NextResponse.json(
        { message: "Authentication mode or user token required" },
        { status: 400 }
      );
    }

    const baseUrl =
      process.env.APP_URL ||
      `${url.protocol}//${url.host}`;
    const redirectUri = `${baseUrl}/api/oauth/google/callback`;

    const state = encryptToken(statePayload);

    const params = new URLSearchParams({
      client_id: clientId,
      redirect_uri: redirectUri,
      response_type: "code",
      scope: "openid email profile https://www.googleapis.com/auth/gmail.send",
      access_type: "offline",
      prompt: "consent",
      state: state,
    });

    const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;

    return NextResponse.redirect(googleAuthUrl);
  } catch (error) {
    console.error("Google OAuth login error:", error);
    return NextResponse.json(
      { message: "Failed to initialize Google OAuth flow" },
      { status: 500 }
    );
  }
}
