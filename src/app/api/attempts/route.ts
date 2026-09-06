import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * ============================================================
 * GET
 * Fetch assessment attempts.
 *
 * Optional:
 * /api/attempts?studentId=xxx
 *
 * Also returns the number of individual answers saved
 * for every attempt.
 * ============================================================
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const studentId = searchParams.get("studentId");

    const attempts = await prisma.attempt.findMany({
      where: studentId
        ? {
            studentId,
          }
        : undefined,

      include: {
        student: {
          select: {
            id: true,
            name: true,
            email: true,
            rollNumber: true,
            branch: true,
            year: true,
            assessmentType: true,
            collegeName: true,
          },
        },

        assessment: {
          select: {
            id: true,
            title: true,
            type: true,
          },
        },

        /**
         * Number of AttemptAnswer records
         * saved for this attempt.
         */
        _count: {
          select: {
            answers: true,
          },
        },
      },

      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({
      success: true,
      attempts,
    });
  } catch (error: any) {
    console.error("GET ATTEMPTS ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch attempts",
        details: error?.message || "Unknown error",
      },
      {
        status: 500,
      }
    );
  }
}

/**
 * ============================================================
 * POST
 * Create an assessment attempt.
 *
 * Expected request body:
 *
 * {
 *   studentId,
 *   assessmentId,
 *   category,
 *   score,
 *   status
 * }
 * ============================================================
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const {
      studentId,
      assessmentId,
      category,
      score,
      status,
    } = body;

    if (!studentId) {
      return NextResponse.json(
        {
          success: false,
          error: "studentId is required",
        },
        {
          status: 400,
        }
      );
    }

    const attempt = await prisma.attempt.create({
      data: {
        studentId,
        assessmentId: assessmentId || null,
        category: category || null,
        score: score ?? null,
        status: status || "IN_PROGRESS",
      },

      include: {
        student: true,

        assessment: true,

        _count: {
          select: {
            answers: true,
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      attempt,
    });
  } catch (error: any) {
    console.error("CREATE ATTEMPT ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to create attempt",
        details: error?.message || "Unknown error",
      },
      {
        status: 500,
      }
    );
  }
}

/**
 * ============================================================
 * PATCH
 * Update an assessment attempt.
 *
 * Expected request body:
 *
 * {
 *   attemptId,
 *   status,
 *   score,
 *   category,
 *   reattemptAllowed
 * }
 * ============================================================
 */
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();

    const {
      attemptId,
      status,
      score,
      category,
      reattemptAllowed,
    } = body;

    if (!attemptId) {
      return NextResponse.json(
        {
          success: false,
          error: "attemptId is required",
        },
        {
          status: 400,
        }
      );
    }

    const updateData: any = {};

    if (status !== undefined) {
      updateData.status = status;
    }

    if (score !== undefined) {
      updateData.score = score;
    }

    if (category !== undefined) {
      updateData.category = category;
    }

    if (reattemptAllowed !== undefined) {
      updateData.reattemptAllowed = reattemptAllowed;
    }

    /**
     * Save completion time automatically.
     */
    if (status === "COMPLETED") {
      updateData.endTime = new Date();
    }

    const attempt = await prisma.attempt.update({
      where: {
        id: attemptId,
      },

      data: updateData,

      include: {
        student: true,

        assessment: true,

        _count: {
          select: {
            answers: true,
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      attempt,
    });
  } catch (error: any) {
    console.error("UPDATE ATTEMPT ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to update attempt",
        details: error?.message || "Unknown error",
      },
      {
        status: 500,
      }
    );
  }
}