import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const PROGRAM_ID = "prog_succeed_core";

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        {
          error: "Unauthorized",
        },
        {
          status: 401,
        }
      );
    }

    const { searchParams } =
      new URL(req.url);

    const category =
      searchParams.get("category");

    if (
      category !== "PSYCHOMETRIC" &&
      category !== "APTITUDE"
    ) {
      return NextResponse.json(
        {
          error: "Invalid assessment category.",
        },
        {
          status: 400,
        }
      );
    }

    const assessment =
      await prisma.assessment.findFirst({
        where: {
          programId: PROGRAM_ID,
          type: category,
          isActive: true,
        },

        include: {
          questions: {
            include: {
              question: true,
            },
          },
        },
      });

    if (!assessment) {
      return NextResponse.json(
        {
          error:
            "Assessment not found or unavailable.",
        },
        {
          status: 404,
        }
      );
    }

    const questions =
      assessment.questions.map(
        (assessmentQuestion) => {
          const question =
            assessmentQuestion.question;

          return {
            id: question.id,
            text: question.text,
            type: question.type,
            parameter:
              question.parameter,
            options:
              question.options,
          };
        }
      );

    return NextResponse.json({
      assessment: {
        id: assessment.id,
        title: assessment.title,
        type: assessment.type,
      },

      questions,
    });
  } catch (error) {
    console.error(
      "Error fetching assessment questions:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Unable to fetch assessment questions.",
      },
      {
        status: 500,
      }
    );
  }
}