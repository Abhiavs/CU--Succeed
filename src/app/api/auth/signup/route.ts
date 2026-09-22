import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const { name, email, password, rollNumber, branch, batch, year, assessmentType, collegeName } =
      await req.json();

    const normalizedEmail = typeof email === "string" ? email.trim().toLowerCase() : "";
    if (!name?.trim() || !normalizedEmail || !password || !rollNumber?.trim() || !branch?.trim() || !collegeName?.trim()) {
      return NextResponse.json({ error: "Name, email, password, roll number, branch, and college are required." }, { status: 400 });
    }
    // Roll numbers are compact codes (e.g. "42", "21CS045") — reject
    // sentences/branch names students paste into the field.
    const normalizedRoll = rollNumber.trim();
    if (!/\d/.test(normalizedRoll) || /\s/.test(normalizedRoll) || normalizedRoll.length > 15) {
      return NextResponse.json({ error: "Please enter a valid roll number (numbers only, no spaces — e.g. 42 or 21CS045)." }, { status: 400 });
    }
    if (!["Batch 2.1"].includes(batch)) {
      return NextResponse.json({ error: "Please select a valid batch." }, { status: 400 });
    }
    if (!/^\S+@\S+\.\S+$/.test(normalizedEmail)) {
      return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
    }
    if (password.length < 8) {
      return NextResponse.json({ error: "Password must contain at least 8 characters." }, { status: 400 });
    }
    if (year && year !== "1st") {
      return NextResponse.json({ error: "Registration is currently available to first-year students only." }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    try {
      const existingUser = await prisma.user.findUnique({ where: { email: normalizedEmail } });
      if (existingUser) {
        return NextResponse.json({ error: "A student with this email already exists." }, { status: 400 });
      }

      const user = await prisma.user.create({
        data: {
          name: name.trim(),
          email: normalizedEmail,
          password: hashedPassword,
          role: "STUDENT",
          rollNumber: rollNumber.trim(),
          branch: branch.trim(),
          batch: batch.trim(),
          year: "1st",
          assessmentType: "PRE",
          collegeName: collegeName.trim(),
        },
      });
      return NextResponse.json({ success: true, userId: user.id }, { status: 201 });
    } catch (dbErr) {
      console.error("Student account creation failed.", dbErr);
      return NextResponse.json({ error: "Unable to create the account. Please try again." }, { status: 503 });
    }
  } catch (error) {
    console.error("Signup error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
