import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(
  request: NextRequest
) {
  try {
    /*
     * =====================================================
     * AUTHORIZATION
     * =====================================================
     */

    const session =
      await getServerSession(authOptions);

    if (
      !session?.user ||
      session.user.role !== "OFFICIAL"
    ) {
      return NextResponse.json(
        {
          success: false,
          error: "Unauthorized",
        },
        {
          status: 401,
        }
      );
    }

    /*
     * =====================================================
     * READ REQUEST
     * =====================================================
     */

    const contentType =
      request.headers.get(
        "content-type"
      ) || "";

    let attemptId:
      | string
      | null = null;

    let wheelScoreId:
      | string
      | null = null;

    let allowed:
      | boolean
      | null = null;

    /*
     * =====================================================
     * JSON REQUEST
     * =====================================================
     */

    if (
      contentType.includes(
        "application/json"
      )
    ) {
      const body =
        await request.json();

      attemptId =
        body.attemptId || null;

      wheelScoreId =
        body.wheelScoreId || null;

      allowed =
        body.allowed === true ||
        body.allowed === "true";
    }

    /*
     * =====================================================
     * FORM REQUEST
     * =====================================================
     */

    else if (
      contentType.includes(
        "application/x-www-form-urlencoded"
      ) ||
      contentType.includes(
        "multipart/form-data"
      )
    ) {
      const formData =
        await request.formData();

      attemptId =
        formData
          .get("attemptId")
          ?.toString() || null;

      wheelScoreId =
        formData
          .get("wheelScoreId")
          ?.toString() || null;

      const allowedValue =
        formData
          .get("allowed")
          ?.toString();

      allowed =
        allowedValue === "true" ||
        allowedValue === "1";
    }

    /*
     * =====================================================
     * VALIDATION
     * =====================================================
     */

    if (
      !attemptId &&
      !wheelScoreId
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "attemptId or wheelScoreId is required",
        },
        {
          status: 400,
        }
      );
    }

    if (allowed === null) {
      return NextResponse.json(
        {
          success: false,
          error:
            "allowed value is required",
        },
        {
          status: 400,
        }
      );
    }

    /*
     * =====================================================
     * UPDATE NORMAL ATTEMPT
     * =====================================================
     */

    if (attemptId) {

      const existingAttempt =
        await prisma.attempt.findUnique({
          where: {
            id: attemptId,
          },
        });

      if (!existingAttempt) {
        return NextResponse.json(
          {
            success: false,
            error:
              "Attempt not found",
          },
          {
            status: 404,
          }
        );
      }

      const updatedAttempt =
        await prisma.attempt.update({
          where: {
            id: attemptId,
          },

          data: {
            reattemptAllowed:
              allowed,
          },
        });

      return NextResponse.json({
        success: true,

        message: allowed
          ? "Reattempt permission has been granted."
          : "Reattempt permission has been removed.",

        type: "ATTEMPT",

        attempt:
          updatedAttempt,
      });
    }

    /*
     * =====================================================
     * UPDATE WHEEL SCORE
     * =====================================================
     */

    if (wheelScoreId) {

      const existingWheelScore =
        await prisma.wheelScore.findUnique({
          where: {
            id: wheelScoreId,
          },
        });

      if (!existingWheelScore) {
        return NextResponse.json(
          {
            success: false,
            error:
              "Wheel score not found",
          },
          {
            status: 404,
          }
        );
      }

      const updatedWheelScore =
        await prisma.wheelScore.update({
          where: {
            id: wheelScoreId,
          },

          data: {
            reattemptAllowed:
              allowed,
          },
        });

      return NextResponse.json({
        success: true,

        message: allowed
          ? "Wheel reattempt permission has been granted."
          : "Wheel reattempt permission has been removed.",

        type: "WHEEL",

        wheelScore:
          updatedWheelScore,
      });
    }

    return NextResponse.json(
      {
        success: false,
        error:
          "Unable to process request",
      },
      {
        status: 400,
      }
    );

  } catch (error: any) {

    console.error(
      "REATTEMPT ERROR:",
      error
    );

    return NextResponse.json(
      {
        success: false,

        error:
          "Failed to update reattempt permission",

        details:
          error?.message ||
          "Unknown error",
      },
      {
        status: 500,
      }
    );
  }
}