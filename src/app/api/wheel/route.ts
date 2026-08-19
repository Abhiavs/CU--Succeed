import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { inMemoryStore } from "@/lib/store";

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    const studentId = session?.user?.id || "guest-student";

    const state = inMemoryStore.getState(studentId);

    try {
      if (session?.user?.id && (prisma as any).wheelScore) {
        const dbWheel = await (prisma as any).wheelScore.findFirst({
          where: { studentId: session.user.id },
          orderBy: { createdAt: "desc" },
        });

        if (dbWheel) {
          return NextResponse.json({
            completed: true,
            averageScore: dbWheel.averageScore,
            dimensions: dbWheel.dimensions,
          });
        }
      }
    } catch (err) {
      console.warn("DB fetch wheel skipped:", err);
    }

    return NextResponse.json({
      completed: state.wheelCompleted,
      averageScore: state.wheelAverage,
      dimensions: state.wheelScores,
    });
  } catch (error) {
    console.error("GET /api/wheel error:", error);
    return NextResponse.json({ error: "Failed to load wheel data" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    const studentId = session?.user?.id || "guest-student";

    const body = await req.json();
    const { dimensions, type, year } = body;

    if (!dimensions || typeof dimensions !== "object") {
      return NextResponse.json({ error: "Invalid dimensions payload" }, { status: 400 });
    }

    const keys = Object.keys(dimensions);
    const sum = keys.reduce((acc, k) => acc + Number(dimensions[k] || 0), 0);
    const avg = keys.length > 0 ? sum / keys.length : 0;

    // Update in-memory state
    inMemoryStore.updateState(studentId, {
      wheelCompleted: true,
      wheelAverage: Math.round(avg * 10) / 10,
      wheelScores: dimensions,
    });

    // Attempt saving to DB
    try {
      if (session?.user?.id && (prisma as any).wheelScore) {
        await (prisma as any).wheelScore.create({
          data: {
            studentId: session.user.id,
            type: type || "PRE",
            year: year || "3rd",
            dimensions: dimensions,
            totalScore: sum,
            averageScore: avg,
          },
        });
      }
    } catch (dbErr) {
      console.warn("DB save wheel skipped, saved in store:", dbErr);
    }

    return NextResponse.json({
      success: true,
      averageScore: Math.round(avg * 10) / 10,
      dimensions,
    });
  } catch (error) {
    console.error("POST /api/wheel error:", error);
    return NextResponse.json({ error: "Failed to save wheel score" }, { status: 500 });
  }
}
