import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  scorePsychometric,
  type PsychometricScoringResult,
} from "@/lib/psychometricScoring";
import {
  PSYCHOMETRIC_SECTIONS,
  getOverallConfidenceLevel,
  getSectionInsight,
  type PsychometricSectionId,
} from "@/lib/assessmentData";

/*
 * ============================================================
 * GET /api/student/psychometric-result
 *
 * Returns the signed-in student's psychometric results,
 * reconstructed from the DIED attempt + answer rows in the
 * database (not the volatile in-memory store), so the results
 * page always shows the real, persisted score.
 *
 * Response shape:
 *   {
 *     completed: boolean,
 *     attemptId, scorePercentage,
 *     totalRawScore, maxPossible, answeredCount,
 *     overall: { label, range },
 *     sections: [{
 *       sectionId, name, questionRange, maxScore,
 *       rawScore, maxPossible, answeredCount, percentage,
 *       tier: { label, range, paragraphs[3] }
 *     }]
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
     * Latest completed psychometric attempt.
     */
    const attempt = await prisma.attempt.findFirst({
      where: {
        studentId,
        category: "PSYCHOMETRIC",
      },
      orderBy: { createdAt: "desc" },
      include: {
        answers: {
          include: {
            question: true,
          },
        },
      },
    });

    if (!attempt || attempt.status !== "COMPLETED") {
      return NextResponse.json(
        { completed: false, sections: [] },
        { status: 200 }
      );
    }

    /*
     * Answers that came from this attempt only; question rows carry
     * `parameter`, `options`, and `correctAnswer`.
     */
    const questions = attempt.answers.map((answer) => answer.question);
    const submittedAnswers = attempt.answers.reduce<Record<string, string>>(
      (acc, answer) => {
        if (answer.selectedAnswer) {
          acc[answer.questionId] = answer.selectedAnswer;
        }
        return acc;
      },
      {}
    );

    const result: PsychometricScoringResult = scorePsychometric(
      questions.map((question) => ({
        id: question.id,
        parameter: question.parameter,
        options: (question.options ?? []) as {
          id: string;
          text: string;
        }[],
        correctAnswer: question.correctAnswer,
      })),
      submittedAnswers
    );

    const overall = getOverallConfidenceLevel(result.totalRawScore);

    const sections = PSYCHOMETRIC_SECTIONS.map((section) => {
      const sectionScore = result.sections.find(
        (s) => s.sectionId === (section.id as PsychometricSectionId)
      );

      const rawScore = sectionScore?.rawScore ?? 0;
      const maxPossible = sectionScore?.maxPossible ?? 0;
      const insight = getSectionInsight(
        section.id as PsychometricSectionId,
        rawScore
      );

      return {
        sectionId: section.id as PsychometricSectionId,
        name: section.name,
        questionRange: section.questionRange,
        maxScore: section.maxScore,
        rawScore,
        maxPossible,
        answeredCount: sectionScore?.answeredCount ?? 0,
        percentage:
          maxPossible > 0
            ? Math.round((rawScore / maxPossible) * 100)
            : 0,
        tier: {
          label: insight.tier,
          range: insight.range,
          paragraphs: insight.paragraphs,
        },
      };
    });

    return NextResponse.json({
      completed: true,
      attemptId: attempt.id,
      scorePercentage: result.scorePercentage,
      totalRawScore: result.totalRawScore,
      maxPossible: result.maxPossible,
      answeredCount: result.answeredCount,
      overall,
      sections,
    });
  } catch (error) {
    console.error("GET /api/student/psychometric-result error:", error);
    return NextResponse.json(
      { error: "Failed to load psychometric result" },
      { status: 500 }
    );
  }
}
