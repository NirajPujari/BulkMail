import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { verifyToken } from "@/lib/jwt";

function getAdminUserFromRequest(req: NextRequest) {
  const auth = req.headers.get("authorization");
  if (!auth || !auth.startsWith("Bearer ")) {
    return null;
  }
  const token = auth.slice(7);
  const payload = verifyToken(token);
  if (!payload || payload.role !== "admin") {
    return null;
  }
  return payload;
}

export async function GET(req: NextRequest) {
  try {
    const admin = getAdminUserFromRequest(req);
    if (!admin) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: { campaigns: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    const formattedUsers = users.map((u) => ({
      id: u.id,
      name: u.name,
      email: u.email,
      role: u.role,
      createdAt: u.createdAt.toISOString(),
      updatedAt: u.updatedAt.toISOString(),
      campaignCount: u._count.campaigns,
    }));

    return NextResponse.json(formattedUsers);
  } catch (error) {
    console.error("Admin fetch users error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const admin = getAdminUserFromRequest(req);
    if (!admin) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    const { id, role } = await req.json();

    if (!id || !role || !["user", "admin"].includes(role)) {
      return NextResponse.json({ message: "Invalid payload" }, { status: 400 });
    }

    if (id === admin.userId) {
      return NextResponse.json(
        { message: "You cannot change your own admin role" },
        { status: 400 }
      );
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: { role },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error("Admin update user error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const admin = getAdminUserFromRequest(req);
    if (!admin) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    const url = new URL(req.url);
    const id = url.searchParams.get("id");

    if (!id) {
      return NextResponse.json({ message: "User ID required" }, { status: 400 });
    }

    if (id === admin.userId) {
      return NextResponse.json(
        { message: "You cannot delete your own admin account" },
        { status: 400 }
      );
    }

    await prisma.user.delete({
      where: { id },
    });

    return NextResponse.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Admin delete user error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
