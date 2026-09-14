import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { inMemoryStore } from "@/lib/store";
import { scorePsychometric } from "@/lib/psychometricScoring";

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
       *
       * 4 options per question, scored 1–4.
       * Sections: Self-Belief & Self-Awareness (Q1–10),
       * Communication & Social Confidence (Q11–20),
       * Action, Resilience & Decision-Making (Q21–30).
       * Total possible: 30–120.
       * ============================================================
       */
      const psychometricResult = assessmentCategory === "PSYCHOMETRIC"
        ? scorePsychometric(
            dbQuestions.map((question) => ({
              id: question.id,
              parameter: question.parameter,
              options:
                question.options as {
                  id: string;
                  text: string;
                }[],
              correctAnswer:
                question.correctAnswer,
            })),
            submittedAnswers
          )
        : null;

      if (psychometricResult) {
        scorePercentage =
          psychometricResult.scorePercentage;
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
        const sectionScores = psychometricResult?.sections.reduce(
          (acc, section) => {
            acc[section.sectionId] = section.rawScore;
            return acc;
          },
          {} as Record<string, number>
        );

        inMemoryStore.updateState(studentId, {
          psychometricCompleted: true,
          psychometricScore: scorePercentage,
          psychometricRawTotal: psychometricResult?.totalRawScore ?? 0,
          psychometricSectionScores: {
            "self-belief":
              sectionScores?.["self-belief"] ?? 0,
            communication:
              sectionScores?.["communication"] ?? 0,
            "action-resilience":
              sectionScores?.["action-resilience"] ?? 0,
          },
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
        psychometricResult:
          assessmentCategory === "PSYCHOMETRIC"
            ? psychometricResult
            : undefined,
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