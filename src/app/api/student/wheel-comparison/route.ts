import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { buildWheelComparisonRows } from "@/lib/wheelComparison";

/*
 * ============================================================
 * GET /api/student/wheel-comparison
 *
 * Returns the signed-in student's PRE and POST wheel scores
 * paired per dimension, ready to plot as a grouped bar chart.
 *
 * PRE and POST are stored as separate WheelScore rows whose
 * `dimensions` JSON is keyed by WheelDimension id. PRE and POST
 * dimension ids differ (POST has its own rows), so the two sets
 * are paired by NORMALISED NAME rather than by id.
 *
 * Response shape:
 *   {
 *     hasPre: boolean,
 *     hasPost: boolean,
 *     preAverage: number | null,
 *     postAverage: number | null,
 *     rows: [{ name, pre: number|null, post: number|null }]
 *   }
 * ============================================================
 */

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized. Please sign in first." },
        { status: 401 }
      );
    }

    const studentId = session.user.id;

    /*
     * Latest PRE score, latest POST score — kept separate so
     * neither can overwrite the other.
     */

    const [preScore, postScore] = await Promise.all([
      prisma.wheelScore.findFirst({
        where: { studentId, type: "PRE" },
        orderBy: { createdAt: "desc" },
      }),
      prisma.wheelScore.findFirst({
        where: { studentId, type: "POST" },
        orderBy: { createdAt: "desc" },
      }),
    ]);

    /*
     * Dimension definitions. PRE drives the x-axis order; the
     * matching POST row supplies the POST-side key.
     */

    const [preDims, postDims] = await Promise.all([
      prisma.wheelDimension.findMany({
        where: { assessmentType: "PRE", isActive: true },
        orderBy: { sortOrder: "asc" },
      }),
      prisma.wheelDimension.findMany({
        where: { assessmentType: "POST", isActive: true },
        orderBy: { sortOrder: "asc" },
      }),
    ]);

    const rows = buildWheelComparisonRows(
      preScore,
      postScore,
      preDims,
      postDims
    );

    return NextResponse.json({
      success: true,
      hasPre: Boolean(preScore),
      hasPost: Boolean(postScore),
      preAverage: preScore?.averageScore ?? null,
      postAverage: postScore?.averageScore ?? null,
      rows,
    });
  } catch (error) {
    console.error("GET /api/student/wheel-comparison error:", error);

    return NextResponse.json(
      { error: "Failed to load wheel comparison" },
      { status: 500 }
    );
  }
}
