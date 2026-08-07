import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { decryptToken, hashPassword } from "@/lib/crypto";
import { generateToken } from "@/lib/jwt";
import { Role } from "@/types/user";

export async function POST(req: NextRequest) {
  try {
    const { setupToken, name, password } = await req.json();

    if (!setupToken || !password) {
      return NextResponse.json(
        { message: "Setup token and password are required" },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { message: "Password must be at least 6 characters long" },
        { status: 400 }
      );
    }

    // Decrypt setup token
    const decryptedPayload = decryptToken(setupToken);
    if (!decryptedPayload) {
      return NextResponse.json(
        { message: "Invalid or corrupted setup session. Please sign in with Google again." },
        { status: 400 }
      );
    }

    const { email, name: googleName, encryptedRefreshToken, expiresAt } = JSON.parse(decryptedPayload);

    if (!email || (expiresAt && Date.now() > expiresAt)) {
      return NextResponse.json(
        { message: "Setup session expired. Please sign in with Google again." },
        { status: 400 }
      );
    }

    // Verify user doesn't already exist
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { message: "An account with this email already exists. Please log in directly." },
        { status: 400 }
      );
    }

    // Hash password and create User record
    const hashedPassword = hashPassword(password);
    const userName = name && name.trim().length > 0 ? name.trim() : (googleName || email.split("@")[0]);

    const newUser = await prisma.user.create({
      data: {
        name: userName,
        email: email,
        password: hashedPassword,
        role: "user",
        googleConnected: true,
        googleEmail: email,
        ...(encryptedRefreshToken && { googleRefreshToken: encryptedRefreshToken }),
      },
    });

    // Generate JWT session token
    const jwtToken = generateToken({
      userId: newUser.id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role as Role,
    });

    return NextResponse.json({
      message: "Account setup complete!",
      token: jwtToken,
    });
  } catch (error) {
    console.error("Google complete setup error:", error);
    return NextResponse.json(
      { message: (error as Error).message || "Internal server error during account setup" },
      { status: 500 }
    );
  }
}
