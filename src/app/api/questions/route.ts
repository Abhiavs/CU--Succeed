import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "OFFICIAL") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const data = await req.json();

    /*
     * ============================================================
     * BASIC VALIDATION
     * ============================================================
     */

    if (!data.text || !data.type) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    if (!data.assessmentType) {
      return NextResponse.json(
        { error: "Assessment type is required" },
        { status: 400 }
      );
    }

    /*
     * ============================================================
     * MULTIPLE CHOICE VALIDATION
     * ============================================================
     */

    if (data.type === "MULTIPLE_CHOICE") {
      if (
        !Array.isArray(data.options) ||
        data.options.length !== 5
      ) {
        return NextResponse.json(
          {
            error:
              "Multiple choice questions must have exactly 5 options",
          },
          { status: 400 }
        );
      }

      if (!data.correctAnswer) {
        return NextResponse.json(
          {
            error:
              "Please select the highest scoring answer",
          },
          { status: 400 }
        );
      }
    }

    /*
     * ============================================================
     * FIND THE SELECTED ASSESSMENT
     * ============================================================
     */

    const assessment = await prisma.assessment.findFirst({
      where: {
        type: data.assessmentType,
        isActive: true,
      },
    });

    if (!assessment) {
      return NextResponse.json(
        {
          error: `No active ${data.assessmentType} assessment found`,
        },
        {
          status: 404,
        }
      );
    }

    /*
     * ============================================================
     * CREATE QUESTION
     * ============================================================
     */

    const question = await prisma.question.create({
      data: {
        text: data.text.trim(),

        type: data.type,

        parameter:
          data.parameter?.trim() || null,

        correctAnswer:
          data.correctAnswer || null,

        options:
          data.options || [],
      },
    });

    /*
     * ============================================================
     * LINK QUESTION TO ASSESSMENT
     * ============================================================
     */

    await prisma.assessmentQuestion.create({
      data: {
        assessmentId: assessment.id,
        questionId: question.id,
      },
    });

    /*
     * ============================================================
     * SUCCESS
     * ============================================================
     */

    return NextResponse.json(
      {
        success: true,
        question,
        assessmentId: assessment.id,
        message:
          "Question created and added to assessment successfully",
      },
      {
        status: 201,
      }
    );

  } catch (error) {
    console.error(
      "Error creating question:",
      error
    );

    return NextResponse.json(
      {
        error: "Internal Server Error",
      },
      {
        status: 500,
      }
    );
  }
}