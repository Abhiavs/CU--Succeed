import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { inMemoryStore } from "@/lib/store";

/*
 * ============================================================
 * VALID WHEEL TYPES
 * ============================================================
 */

const VALID_WHEEL_TYPES = ["PRE", "POST"];

/*
 * ============================================================
 * GET WHEEL SCORE
 *
 * Examples:
 *
 * /api/wheel?type=PRE
 * /api/wheel?type=POST
 * ============================================================
 */

export async function GET(req: Request) {
  try {
    const session =
      await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        {
          error:
            "Unauthorized. Please sign in first.",
        },
        {
          status: 401,
        }
      );
    }

    const studentId =
      session.user.id;

    /*
     * ============================================================
     * GET WHEEL TYPE
     * ============================================================
     */

    const { searchParams } =
      new URL(req.url);

    const type =
      searchParams.get("type") || "PRE";

    if (
      !VALID_WHEEL_TYPES.includes(type)
    ) {
      return NextResponse.json(
        {
          error:
            "Wheel type must be PRE or POST",
        },
        {
          status: 400,
        }
      );
    }

    /*
     * ============================================================
     * GET PERMANENT WHEEL SCORE
     *
     * IMPORTANT:
     * PRE and POST are stored separately.
     * ============================================================
     */

    const wheelScore =
      await prisma.wheelScore.findFirst({
        where: {
          studentId,
          type,
        },

        orderBy: {
          createdAt: "desc",
        },
      });

    /*
     * ============================================================
     * GET WHEEL ATTEMPT
     *
     * Keeping your existing WHEEL category.
     * ============================================================
     */

    const wheelAttempt =
      await prisma.attempt.findFirst({
        where: {
          studentId,
          category: "WHEEL",
          status: "COMPLETED",
        },

        orderBy: {
          createdAt: "desc",
        },
      });

    /*
     * ============================================================
     * RETURN PERMANENT DATA
     * ============================================================
     */

    if (wheelScore) {
      return NextResponse.json({
        completed: true,

        type,

        averageScore:
          wheelScore.averageScore,

        dimensions:
          wheelScore.dimensions,

        attemptId:
          wheelAttempt?.id || null,
      });
    }

    /*
     * ============================================================
     * TEMPORARY FALLBACK
     *
     * PRE uses existing temporary store.
     *
     * POST currently returns empty until submitted.
     * ============================================================
     */

    const state =
      inMemoryStore.getState(studentId);

    if (type === "PRE") {
      return NextResponse.json({
        completed:
          state.wheelCompleted || false,

        type,

        averageScore:
          state.wheelAverage || 0,

        dimensions:
          state.wheelScores || {},

        attemptId:
          wheelAttempt?.id || null,
      });
    }

    return NextResponse.json({
      completed: false,

      type,

      averageScore: 0,

      dimensions: {},

      attemptId: null,
    });

  } catch (error) {
    console.error(
      "GET /api/wheel error:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Failed to load wheel data",
      },
      {
        status: 500,
      }
    );
  }
}

/*
 * ============================================================
 * SUBMIT WHEEL
 * ============================================================
 */

export async function POST(
  req: Request
) {
  try {
    const session =
      await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        {
          error:
            "Unauthorized. Please sign in first.",
        },
        {
          status: 401,
        }
      );
    }

    const studentId =
      session.user.id;

    /*
     * ============================================================
     * READ REQUEST
     * ============================================================
     */

    const body =
      await req.json();

    const {
      dimensions,

      /*
       * IMPORTANT:
       * Default is PRE.
       */
      type = "PRE",

      year = "",
    } = body;

    /*
     * ============================================================
     * VALIDATE WHEEL TYPE
     * ============================================================
     */

    if (
      !VALID_WHEEL_TYPES.includes(type)
    ) {
      return NextResponse.json(
        {
          error:
            "Wheel type must be PRE or POST",
        },
        {
          status: 400,
        }
      );
    }

    /*
     * ============================================================
     * VALIDATE DIMENSIONS
     * ============================================================
     */

    if (
      !dimensions ||
      typeof dimensions !== "object" ||
      Array.isArray(dimensions)
    ) {
      return NextResponse.json(
        {
          error:
            "Invalid dimensions payload",
        },
        {
          status: 400,
        }
      );
    }

    const keys =
      Object.keys(dimensions);

    if (keys.length === 0) {
      return NextResponse.json(
        {
          error:
            "At least one wheel dimension is required",
        },
        {
          status: 400,
        }
      );
    }

    /*
     * ============================================================
     * VALIDATE SCORES
     * ============================================================
     */

    for (const key of keys) {
      const score =
        Number(dimensions[key]);

      if (
        Number.isNaN(score) ||
        score < 0 ||
        score > 10
      ) {
        return NextResponse.json(
          {
            error:
              `Invalid score for dimension: ${key}`,
          },
          {
            status: 400,
          }
        );
      }
    }

    /*
     * ============================================================
     * CALCULATE SCORES
     * ============================================================
     */

    const totalScore =
      keys.reduce(
        (total, key) => {
          return (
            total +
            Number(
              dimensions[key] || 0
            )
          );
        },
        0
      );

    const averageScore =
      totalScore / keys.length;

    const roundedAverage =
      Math.round(
        averageScore * 10
      ) / 10;

    /*
     * ============================================================
     * FIND EXISTING SCORE
     *
     * CRITICAL:
     * Find by studentId + type.
     *
     * This prevents POST from overwriting PRE.
     * ============================================================
     */

    const existingWheelScore =
      await prisma.wheelScore.findFirst({
        where: {
          studentId,
          type,
        },

        orderBy: {
          createdAt: "desc",
        },
      });

    let wheelScore;

    /*
     * ============================================================
     * UPDATE OR CREATE WHEEL SCORE
     * ============================================================
     */

    if (existingWheelScore) {

      wheelScore =
        await prisma.wheelScore.update({
          where: {
            id:
              existingWheelScore.id,
          },

          data: {
            dimensions,

            totalScore,

            averageScore:
              roundedAverage,

            year:
              String(year),

            /*
             * Consume the granted reattempt once the
             * student submits the wheel again so the
             * dashboard option disappears after the redo.
             */

            reattemptAllowed:
              false,
          },
        });

    } else {

      wheelScore =
        await prisma.wheelScore.create({
          data: {
            studentId,

            type,

            year:
              String(year),

            dimensions,

            totalScore,

            averageScore:
              roundedAverage,
          },
        });

    }

    /*
     * ============================================================
     * CREATE WHEEL ATTEMPT
     *
     * Currently one WHEEL attempt system.
     *
     * For PRE/POST distinction, the WheelScore.type
     * is the source of truth.
     * ============================================================
     */

    const existingWheelAttempt =
      await prisma.attempt.findFirst({
        where: {
          studentId,

          category: "WHEEL",

          status: "COMPLETED",
        },

        orderBy: {
          createdAt: "desc",
        },
      });

    let wheelAttempt;

    if (existingWheelAttempt) {

      wheelAttempt =
        existingWheelAttempt;

    } else {

      wheelAttempt =
        await prisma.attempt.create({
          data: {
            studentId,

            status:
              "COMPLETED",

            category:
              "WHEEL",

            /*
             * Example:
             *
             * 7.5 → 75
             * 8.2 → 82
             */

            score:
              Math.round(
                roundedAverage * 10
              ),

            endTime:
              new Date(),
          },
        });

    }

    /*
     * ============================================================
     * TEMPORARY STATE
     *
     * Preserve your existing PRE behavior.
     * ============================================================
     */

    if (type === "PRE") {
      inMemoryStore.updateState(
        studentId,
        {
          wheelCompleted: true,

          wheelAverage:
            roundedAverage,

          wheelScores:
            dimensions,
        }
      );
    }

    /*
     * ============================================================
     * SUCCESS
     * ============================================================
     */

    return NextResponse.json({
      success: true,

      completed: true,

      type,

      averageScore:
        roundedAverage,

      totalScore,

      dimensions,

      attemptId:
        wheelAttempt.id,

      wheelScoreId:
        wheelScore.id,

      redirectUrl:
        "/student/assessment-complete",
    });

  } catch (error) {
    console.error(
      "POST /api/wheel error:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Failed to save wheel score",
      },
      {
        status: 500,
      }
    );
  }
}