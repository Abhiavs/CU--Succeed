import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { inMemoryStore } from "@/lib/store";
import { calculateCompositeProfile } from "@/lib/assessmentData";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    const studentId = session?.user?.id || "guest-student";
    const state = inMemoryStore.getState(studentId);

    const composite = calculateCompositeProfile(
      state.psychometricScore || 78,
      state.aptitudeScore || 75,
      state.wheelScores
    );

    return NextResponse.json({
      student: {
        id: session?.user?.id || "guest",
        name: session?.user?.name || "Student",
        email: session?.user?.email || "student@example.com",
        rollNumber: session?.user?.rollNumber || "SUC-2026-042",
        branch: session?.user?.branch || "Computer Science & Engineering",
        year: session?.user?.year || "3rd",
        assessmentType: session?.user?.assessmentType || "PRE",
        collegeName: session?.user?.collegeName || "Succeed Academy of Technology",
      },
      state,
      composite,
    });
  } catch (error) {
    console.error("GET /api/student/state error:", error);
    return NextResponse.json({ error: "Failed to fetch student state" }, { status: 500 });
  }
}
