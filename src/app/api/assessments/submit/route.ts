import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { inMemoryStore } from "@/lib/store";

const PROGRAM_ID = "prog_succeed_core";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized. Please sign in first." },
        { status: 401 }
      );
    }

    const studentId = session.user.id;
    const contentType = req.headers.get("content-type") || "";

    /*
     * ============================================================
     * JSON SUBMISSION
     * ============================================================
     */
    if (contentType.includes("application/json")) {
      const body = await req.json();

      const assessmentCategory =
        body.category === "PSYCHOMETRIC"
          ? "PSYCHOMETRIC"
          : body.category === "APTITUDE"
          ? "APTITUDE"
          : null;

      const submittedAnswers: Record<string, string> =
        body.answers || {};

      console.log("=================================");
console.log("ASSESSMENT SUBMISSION DEBUG");
console.log("CATEGORY:", assessmentCategory);
console.log("RAW BODY:", body);
console.log("SUBMITTED ANSWERS:", submittedAnswers);
console.log("ANSWER KEYS:", Object.keys(submittedAnswers));
console.log("=================================");

      if (!assessmentCategory) {
        return NextResponse.json(
          { error: "Invalid assessment category." },
          { status: 400 }
        );
      }

      /*
       * ============================================================
       * FIND ASSESSMENT
       * ============================================================
       */
      const assessment = await prisma.assessment.findFirst({
        where: {
          programId: PROGRAM_ID,
          type: assessmentCategory,
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
            error: `${assessmentCategory} assessment is not configured.`,
          },
          { status: 404 }
        );
      }

      /*
       * ============================================================
       * ASSESSMENT MUST BE ACTIVE
       * ============================================================
       */
      if (!assessment.isActive) {
        return NextResponse.json(
          {
            error: "This assessment is currently unavailable.",
          },
          { status: 403 }
        );
      }

      /*
       * ============================================================
       * CHECK COMPLETED ATTEMPT
       * ============================================================
       */
      const completedAttempt = await prisma.attempt.findFirst({
        where: {
          studentId,
          assessmentId: assessment.id,
          status: "COMPLETED",
        },
      });

      if (completedAttempt) {
        return NextResponse.json(
          {
            error:
              "This assessment has already been finalized. Another attempt requires administrator permission.",
            alreadyAttempted: true,
            attemptId: completedAttempt.id,
          },
          { status: 409 }
        );
      }

      /*
       * ============================================================
       * GET QUESTIONS FROM DATABASE
       * ============================================================
       */
      const dbQuestions = assessment.questions.map(
        (assessmentQuestion) => assessmentQuestion.question
      );
      
      console.log(
  "DATABASE QUESTION IDs:",
  dbQuestions.map((question) => question.id)
);

      if (dbQuestions.length === 0) {
        return NextResponse.json(
          {
            error:
              "No questions have been added to this assessment.",
          },
          { status: 400 }
        );
      }

      /*
       * ============================================================
       * CALCULATE SCORE
       * ============================================================
       */
      let scorePercentage = 0;

      /*
       * ============================================================
       * PSYCHOMETRIC SCORING
       * ============================================================
       */
      if (assessmentCategory === "PSYCHOMETRIC") {
        let totalScore = 0;

        const maxScore = dbQuestions.length * 5;

        dbQuestions.forEach((question) => {
          const options =
            question.options as {
              id: string;
              text: string;
            }[];

          const chosenOptionId =
            submittedAnswers[question.id];

          const correctAnswer =
            question.correctAnswer;

          const chosenIndex =
            options.findIndex(
              (option) =>
                option.id === chosenOptionId
            );

          const correctIndex =
            options.findIndex(
              (option) =>
                option.id === correctAnswer
            );

          /*
           * Invalid or missing answer.
           */
          if (
            chosenIndex === -1 ||
            correctIndex === -1
          ) {
            totalScore += 1;
            return;
          }

          /*
           * Distance from preferred answer.
           */
          const distance = Math.abs(
            chosenIndex - correctIndex
          );

          /*
           * Correct = 5
           * 1 step away = 4
           * 2 steps away = 3
           * 3 steps away = 2
           * 4 steps away = 1
           */
          const marks = Math.max(
            1,
            5 - distance
          );

          totalScore += marks;
        });

        scorePercentage =
          maxScore > 0
            ? Math.round(
                (totalScore / maxScore) * 100
              )
            : 0;
      }

      /*
       * ============================================================
       * APTITUDE SCORING
       * ============================================================
       */
      else {
        let correctCount = 0;

        const totalQuestions =
          dbQuestions.length;

        dbQuestions.forEach((question) => {
          const chosenAnswer =
            submittedAnswers[question.id];

          if (
            chosenAnswer ===
            question.correctAnswer
          ) {
            correctCount++;
          }
        });

        scorePercentage =
          totalQuestions > 0
            ? Math.round(
                (correctCount / totalQuestions) * 100
              )
            : 0;
      }

      /*
       * ============================================================
       * FIND EXISTING IN-PROGRESS ATTEMPT
       * ============================================================
       */
      const inProgressAttempt =
        await prisma.attempt.findFirst({
          where: {
            studentId,
            assessmentId: assessment.id,
            status: "IN_PROGRESS",
          },
        });

      let attempt;

      /*
       * ============================================================
       * UPDATE EXISTING ATTEMPT
       * ============================================================
       */
      if (inProgressAttempt) {
        attempt = await prisma.attempt.update({
          where: {
            id: inProgressAttempt.id,
          },

          data: {
            score: scorePercentage,
            category: assessmentCategory,
            status: "COMPLETED",
            endTime: new Date(),
          },
        });
      }

      /*
       * ============================================================
       * CREATE NEW ATTEMPT
       * ============================================================
       */
      else {
        attempt = await prisma.attempt.create({
          data: {
            studentId,
            assessmentId: assessment.id,
            status: "COMPLETED",
            score: scorePercentage,
            category: assessmentCategory,
            endTime: new Date(),
          },
        });
      }

     /*
 * ============================================================
 * SAVE INDIVIDUAL ANSWERS
 * ============================================================
 */

await prisma.attemptAnswer.deleteMany({
  where: {
    attemptId: attempt.id,
  },
});

await prisma.attemptAnswer.createMany({
  data: dbQuestions.map((question) => {
    const selectedAnswer =
      submittedAnswers[question.id] || null;

    console.log("SAVING ANSWER:", {
      questionId: question.id,
      selectedAnswer,
    });

    return {
      attemptId: attempt.id,

      questionId: question.id,

      selectedAnswer,

      isCorrect:
        assessmentCategory === "PSYCHOMETRIC"
          ? null
          : selectedAnswer === question.correctAnswer,
    };
  }),
});

      /*
       * ============================================================
       * UPDATE IN-MEMORY STATE
       * ============================================================
       */
      if (assessmentCategory === "PSYCHOMETRIC") {
        inMemoryStore.updateState(studentId, {
          psychometricCompleted: true,
          psychometricScore: scorePercentage,
          psychometricAttemptId: attempt.id,
        });
      } else {
        inMemoryStore.updateState(studentId, {
          aptitudeCompleted: true,
          aptitudeScore: scorePercentage,
          aptitudeAttemptId: attempt.id,
        });
      }

      /*
       * ============================================================
       * SUCCESS
       * ============================================================
       */
      return NextResponse.json({
        success: true,
        category: assessmentCategory,
        score: scorePercentage,
        attemptId: attempt.id,
        redirectUrl: "/student/wheel",
      });
    }

    /*
     * ============================================================
     * FORM DATA FALLBACK
     * ============================================================
     */
    const formData = await req.formData();

    const assessmentId = formData
      .get("assessmentId")
      ?.toString();

    if (!assessmentId) {
      return NextResponse.json(
        {
          error: "Assessment ID is required.",
        },
        {
          status: 400,
        }
      );
    }

    const assessment =
      await prisma.assessment.findUnique({
        where: {
          id: assessmentId,
        },
      });

    if (!assessment) {
      return NextResponse.json(
        {
          error: "Assessment not found.",
        },
        {
          status: 404,
        }
      );
    }

    if (!assessment.isActive) {
      return NextResponse.json(
        {
          error:
            "This assessment is currently unavailable.",
        },
        {
          status: 403,
        }
      );
    }

    const completedAttempt =
      await prisma.attempt.findFirst({
        where: {
          studentId,
          assessmentId: assessment.id,
          status: "COMPLETED",
        },
      });

    if (completedAttempt) {
      return NextResponse.json(
        {
          error:
            "This assessment has already been finalized. Another attempt requires administrator permission.",
          alreadyAttempted: true,
          attemptId: completedAttempt.id,
        },
        {
          status: 409,
        }
      );
    }

    return NextResponse.redirect(
      new URL("/student/wheel", req.url),
      303
    );
  } catch (error) {
    console.error(
      "Error submitting assessment:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Unable to submit assessment. Please try again.",
      },
      {
        status: 500,
      }
    );
  }
}