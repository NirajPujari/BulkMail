import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { hashPassword } from "@/lib/crypto";
import { generateToken } from "@/lib/jwt";

export async function POST(req: NextRequest) {
  try {
    const { name, email, password } = await req.json();

    // Basic Validation
    if (!name || !email || !password) {
      return NextResponse.json(
        { message: "All fields (name, email, password) are required" },
        { status: 400 },
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { message: "Password must be at least 6 characters long" },
        { status: 400 },
      );
    }

    const normalizedEmail = email.toLowerCase().trim();

    const existingUser = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (existingUser) {
      return NextResponse.json(
        { message: "User with this email already exists" },
        { status: 400 },
      );
    }

    const hashedPassword = hashPassword(password);

    const newUser = await prisma.user.create({
      data: {
        name: name.trim(),
        email: normalizedEmail,
        password: hashedPassword,
        role: "user",
      },
    });

    const userPayload = {
      userId: newUser.id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role as "user" | "admin",
    };

    const token = generateToken(userPayload);

    return NextResponse.json({
      user: userPayload,
      token,
    });
  } catch (error) {
    console.error("Signup error:", error);
    return NextResponse.json(
      { message: "Internal server error during registration" },
      { status: 500 },
    );
  }
}
