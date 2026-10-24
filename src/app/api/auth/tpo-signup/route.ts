import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const { name, email, password, collegeName } = await req.json();

    if (!name?.trim() || !email?.trim() || !password || !collegeName?.trim()) {
      return NextResponse.json({ error: "All fields are required." }, { status: 400 });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const existing = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (existing) {
      return NextResponse.json({ error: "Email already registered." }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const tpoUser = await prisma.user.create({
      data: {
        name: name.trim(),
        email: normalizedEmail,
        password: hashedPassword,
        role: "TPO",
        collegeName: collegeName.trim(),
      },
    });

    return NextResponse.json({ success: true, userId: tpoUser.id });
  } catch (error) {
    console.error("TPO signup error:", error);
    return NextResponse.json({ error: "Failed to create TPO account." }, { status: 500 });
  }
}
