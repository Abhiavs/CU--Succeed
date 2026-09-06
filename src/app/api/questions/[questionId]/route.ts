import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/*
 * ============================================================
 * GET SINGLE QUESTION
 * ============================================================
 */

export async function GET(
  req: Request,
  {
    params,
  }: {
    params: Promise<{
      questionId: string;
    }>;
  }
) {
  try {
    const { questionId } = await params;

    if (!questionId) {
      return NextResponse.json(
        {
          error: "Question ID is required",
        },
        {
          status: 400,
        }
      );
    }

    const question = await prisma.question.findUnique({
      where: {
        id: questionId,
      },
    });

    if (!question) {
      return NextResponse.json(
        {
          error: "Question not found",
        },
        {
          status: 404,
        }
      );
    }

    return NextResponse.json(question);
  } catch (error) {
    console.error("GET question error:", error);

    return NextResponse.json(
      {
        error: "Failed to fetch question",
      },
      {
        status: 500,
      }
    );
  }
}

/*
 * ============================================================
 * UPDATE QUESTION
 * ============================================================
 */

export async function PUT(
  req: Request,
  {
    params,
  }: {
    params: Promise<{
      questionId: string;
    }>;
  }
) {
  try {
    const { questionId } = await params;

    if (!questionId) {
      return NextResponse.json(
        {
          error: "Question ID is required",
        },
        {
          status: 400,
        }
      );
    }

    const body = await req.json();

    const {
      text,
      type,
      parameter,
      options,
      correctAnswer,
    } = body;

    /*
     * Validate question text
     */

    if (!text || typeof text !== "string") {
      return NextResponse.json(
        {
          error: "Question text is required",
        },
        {
          status: 400,
        }
      );
    }

    /*
     * Validate question type
     */

    if (!type || typeof type !== "string") {
      return NextResponse.json(
        {
          error: "Question type is required",
        },
        {
          status: 400,
        }
      );
    }

    /*
     * Validate options
     */

    if (!options) {
      return NextResponse.json(
        {
          error: "Question options are required",
        },
        {
          status: 400,
        }
      );
    }

    /*
     * Check question exists
     */

    const existingQuestion =
      await prisma.question.findUnique({
        where: {
          id: questionId,
        },
      });

    if (!existingQuestion) {
      return NextResponse.json(
        {
          error: "Question not found",
        },
        {
          status: 404,
        }
      );
    }

    /*
     * Update question
     */

    const updatedQuestion =
      await prisma.question.update({
        where: {
          id: questionId,
        },

        data: {
          text: text.trim(),

          type,

          parameter:
            parameter?.trim() || null,

          options,

          correctAnswer:
            correctAnswer || null,
        },
      });

    return NextResponse.json({
      success: true,

      message:
        "Question updated successfully",

      question:
        updatedQuestion,
    });
  } catch (error) {
    console.error(
      "PUT question error:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Failed to update question",
      },
      {
        status: 500,
      }
    );
  }
}

/*
 * ============================================================
 * DELETE QUESTION
 * ============================================================
 */

export async function DELETE(
  req: Request,
  {
    params,
  }: {
    params: Promise<{
      questionId: string;
    }>;
  }
) {
  try {
    const { questionId } = await params;

    if (!questionId) {
      return NextResponse.json(
        {
          error: "Question ID is required",
        },
        {
          status: 400,
        }
      );
    }

    const question =
      await prisma.question.findUnique({
        where: {
          id: questionId,
        },
      });

    if (!question) {
      return NextResponse.json(
        {
          error: "Question not found",
        },
        {
          status: 404,
        }
      );
    }

    await prisma.question.delete({
      where: {
        id: questionId,
      },
    });

    return NextResponse.json({
      success: true,

      message:
        "Question deleted successfully",
    });
  } catch (error) {
    console.error(
      "DELETE question error:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Failed to delete question",
      },
      {
        status: 500,
      }
    );
  }
}