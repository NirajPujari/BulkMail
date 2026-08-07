import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { decryptToken, encryptToken } from "@/lib/crypto";
import { generateToken } from "@/lib/jwt";
import { Role } from "@/types/user";

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const baseUrl =
    process.env.APP_URL ||
    `${url.protocol}//${url.host}`;
    console.log(baseUrl)

  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const oauthError = url.searchParams.get("error");

  if (oauthError) {
    const errorMsg = encodeURIComponent(`Google OAuth denied: ${oauthError}`);
    return NextResponse.redirect(`${baseUrl}/oauth/google/error?message=${errorMsg}`);
  }

  if (!code || !state) {
    const errorMsg = encodeURIComponent("Missing authorization code or state parameter");
    return NextResponse.redirect(`${baseUrl}/oauth/google/error?message=${errorMsg}`);
  }

  try {
    // Decrypt state parameter
    const decryptedState = decryptToken(state);
    if (!decryptedState) {
      const errorMsg = encodeURIComponent("Invalid OAuth state parameter");
      return NextResponse.redirect(`${baseUrl}/oauth/google/error?message=${errorMsg}`);
    }

    const parsedState = JSON.parse(decryptedState);
    const { userId, mode, timestamp } = parsedState;

    if (Date.now() - timestamp > 10 * 60 * 1000) {
      const errorMsg = encodeURIComponent("OAuth session expired. Please try again.");
      return NextResponse.redirect(`${baseUrl}/oauth/google/error?message=${errorMsg}`);
    }

    const clientId = process.env.GOOGLE_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
    if (!clientId || !clientSecret) {
      const errorMsg = encodeURIComponent("Google OAuth environment configuration missing");
      return NextResponse.redirect(`${baseUrl}/oauth/google/error?message=${errorMsg}`);
    }

    const redirectUri = `${baseUrl}/api/oauth/google/callback`;

    // Exchange code for tokens
    const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        grant_type: "authorization_code",
      }),
    });

    const tokenData = await tokenRes.json();
    if (!tokenRes.ok || tokenData.error) {
      const errorMsg = encodeURIComponent(
        tokenData.error_description || tokenData.error || "Failed to exchange authorization code"
      );
      return NextResponse.redirect(`${baseUrl}/oauth/google/error?message=${errorMsg}`);
    }

    const { access_token, refresh_token, expires_in } = tokenData;

    // Fetch user profile email & name
    const profileRes = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
      headers: { Authorization: `Bearer ${access_token}` },
    });

    const profileData = await profileRes.json();
    if (!profileRes.ok || !profileData.email) {
      const errorMsg = encodeURIComponent("Failed to retrieve Google user profile");
      return NextResponse.redirect(`${baseUrl}/oauth/google/error?message=${errorMsg}`);
    }

    const googleEmail = profileData.email.toLowerCase().trim();
    const googleName = profileData.name || googleEmail.split("@")[0];
    const encryptedRefreshToken = refresh_token ? encryptToken(refresh_token) : undefined;
    const tokenExpiry = new Date(Date.now() + (expires_in || 3600) * 1000);

    // MODE: Auth Login / Signup
    if (mode === "auth") {
      let user = await prisma.user.findUnique({
        where: { email: googleEmail },
      });

      if (!user) {
        // First-time signup: redirect to /setup-account to create password & complete profile
        const setupPayload = JSON.stringify({
          email: googleEmail,
          name: googleName,
          encryptedRefreshToken,
          expiresAt: Date.now() + 15 * 60 * 1000, // 15 min expiry
        });
        const setupToken = encryptToken(setupPayload);

        return NextResponse.redirect(
          `${baseUrl}/setup-account?token=${encodeURIComponent(setupToken)}`
        );
      }

      // Existing user: Update credentials and login directly
      user = await prisma.user.update({
        where: { id: user.id },
        data: {
          googleConnected: true,
          googleEmail: googleEmail,
          ...(encryptedRefreshToken && { googleRefreshToken: encryptedRefreshToken }),
          googleTokenExpiry: tokenExpiry,
        },
      });

      // Generate Dootx JWT session token
      const jwtToken = generateToken({
        userId: user.id,
        name: user.name,
        email: user.email,
        role: user.role as Role,
      });

      return NextResponse.redirect(`${baseUrl}/oauth/google/success?jwt=${encodeURIComponent(jwtToken)}`);
    }

    // MODE: Connect Google Account to existing logged in user
    if (!userId) {
      const errorMsg = encodeURIComponent("User ID missing from connection request");
      return NextResponse.redirect(`${baseUrl}/oauth/google/error?message=${errorMsg}`);
    }

    await prisma.user.update({
      where: { id: userId },
      data: {
        googleConnected: true,
        googleEmail: googleEmail,
        ...(encryptedRefreshToken && { googleRefreshToken: encryptedRefreshToken }),
        googleTokenExpiry: tokenExpiry,
      },
    });

    return NextResponse.redirect(`${baseUrl}/oauth/google/success`);
  } catch (error) {
    console.error("Google OAuth callback error:", error);
    const errorMsg = encodeURIComponent((error as Error).message || "An unexpected error occurred during Google OAuth callback");
    return NextResponse.redirect(`${baseUrl}/oauth/google/error?message=${errorMsg}`);
  }
}
