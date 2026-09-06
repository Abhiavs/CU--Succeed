import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ attemptId: string }> }
) {
  try {
    const { attemptId } = await params;

    const attempt = await prisma.attempt.findUnique({
      where: {
        id: attemptId,
      },

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

        answers: {
          include: {
            question: {
              select: {
                id: true,
                text: true,
                type: true,
                options: true,
                correctAnswer: true,
              },
            },
          },

          orderBy: {
            createdAt: "asc",
          },
        },
      },
    });

    if (!attempt) {
      return NextResponse.json(
        {
          success: false,
          error: "Attempt not found",
        },
        {
          status: 404,
        }
      );
    }

    return NextResponse.json({
      success: true,
      attempt,
    });
  } catch (error: any) {
    console.error("ATTEMPT DETAILS ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch attempt details",
        details: error?.message,
      },
      {
        status: 500,
      }
    );
  }
}