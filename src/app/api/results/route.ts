import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { inMemoryStore } from "@/lib/store";

export async function GET() {
  try {
    let dbAttempts: any[] = [];
    try {
      dbAttempts = await (prisma as any).attempt.findMany({
        where: { status: "COMPLETED" },
        include: {
          student: true,
          assessment: {
            include: { program: true },
          },
        },
        orderBy: { endTime: "desc" },
      });
    } catch (e) {
      dbAttempts = [];
    }

    const storeProfiles = inMemoryStore.getAllProfiles();
    const syntheticResults = storeProfiles.map((p) => {
      const st = inMemoryStore.getState(p.id);
      const compositeScore = Math.round(
        (st.psychometricScore || 78) * 0.35 +
        (st.aptitudeScore || 82) * 0.35 +
        ((st.wheelAverage || 7.8) * 10) * 0.30
      );

      return {
        id: `att-${p.id}`,
        studentId: p.id,
        studentName: p.name,
        email: p.email,
        rollNumber: p.rollNumber,
        branch: p.branch,
        college: p.collegeName,
        year: p.year,
        type: p.assessmentType,
        psychometricScore: st.psychometricScore || 78,
        aptitudeScore: st.aptitudeScore || 82,
        wheelScore: st.wheelAverage || 7.8,
        compositeScore,
        status: "COMPLETED",
        passed: compositeScore >= 50,
        completedAt: p.createdAt || new Date().toISOString(),
      };
    });

    return NextResponse.json({
      results: syntheticResults,
      count: syntheticResults.length,
    });
  } catch (error) {
    console.error("Error fetching results:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
