import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { inMemoryStore } from "@/lib/store";

export async function POST(req: Request) {
  try {
    const { name, email, password, rollNumber, branch, year, assessmentType, collegeName } =
      await req.json();

    if (!name || !email || !password) {
      return NextResponse.json({ error: "Name, email, and password are required." }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const userId = "usr_" + Math.random().toString(36).substring(2, 11);

    // Save in in-memory store
    inMemoryStore.saveProfile({
      id: userId,
      name,
      email,
      rollNumber: rollNumber || "SUC-" + Math.floor(1000 + Math.random() * 9000),
      branch: branch || "Computer Science & Engineering",
      year: year || "3rd",
      assessmentType: assessmentType === "POST" ? "POST" : "PRE",
      collegeName: collegeName || "Succeed Academy of Technology",
      createdAt: new Date().toISOString(),
    });

    // Attempt saving in DB
    try {
      const existingUser = await prisma.user.findUnique({ where: { email } });
      if (existingUser) {
        return NextResponse.json({ error: "A student with this email already exists." }, { status: 400 });
      }

      await (prisma.user as any).create({
        data: {
          id: userId,
          name,
          email,
          password: hashedPassword,
          role: "STUDENT",
          rollNumber: rollNumber || null,
          branch: branch || null,
          year: year || "3rd",
          assessmentType: assessmentType || "PRE",
          collegeName: collegeName || null,
        },
      });
    } catch (dbErr) {
      console.warn("DB save skipped, stored in memory store:", dbErr);
    }

    return NextResponse.json({ success: true, userId }, { status: 201 });
  } catch (error) {
    console.error("Signup error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
