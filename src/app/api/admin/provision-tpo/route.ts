import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user || session.user.role !== "OFFICIAL") {
      return NextResponse.json({ error: "Unauthorized. Platform admin access required." }, { status: 403 });
    }

    const body = await req.json().catch(() => null);
    if (!body) {
      return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
    }

    const { name, email, password, collegeName } = body;

    if (!name?.trim() || !email?.trim() || !password || !collegeName?.trim()) {
      return NextResponse.json({ error: "All fields are required." }, { status: 400 });
    }

    const normalizedEmail = email.trim().toLowerCase();

    // Check if user exists
    let existing = null;
    try {
      existing = await prisma.user.findUnique({
        where: { email: normalizedEmail },
      });
    } catch (dbErr: any) {
      console.error("Database query error during TPO provisioning check:", dbErr?.message || dbErr);
      return NextResponse.json({ error: "Database connection error. Please try again." }, { status: 500 });
    }

    if (existing) {
      return NextResponse.json({ error: "An account with this email already exists." }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    let tpoUser;
    try {
      tpoUser = await prisma.user.create({
        data: {
          name: name.trim(),
          email: normalizedEmail,
          password: hashedPassword,
          role: "TPO",
          collegeName: collegeName.trim(),
        },
      });
    } catch (createErr: any) {
      console.error("Database create error during TPO provisioning:", createErr?.message || createErr);
      return NextResponse.json({ error: "Failed to create TPO user in database." }, { status: 500 });
    }

    return NextResponse.json({ success: true, userId: tpoUser.id });
  } catch (error: any) {
    console.error("Provision TPO unexpected error:", error?.message || error);
    return NextResponse.json({ error: "Failed to provision TPO account due to server error." }, { status: 500 });
  }
}
