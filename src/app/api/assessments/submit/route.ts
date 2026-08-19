import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { inMemoryStore } from "@/lib/store";
import { PSYCHOMETRIC_QUESTIONS, APTITUDE_QUESTIONS } from "@/lib/assessmentData";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    const studentId = session?.user?.id || "guest-student";

    const contentType = req.headers.get("content-type") || "";
    let assessmentCategory = "APTITUDE";
    let scorePercentage = 75;
    let submittedAnswers: Record<string, string> = {};

    if (contentType.includes("application/json")) {
      const body = await req.json();
      assessmentCategory = body.category || "APTITUDE";
      submittedAnswers = body.answers || {};

      if (assessmentCategory === "PSYCHOMETRIC") {
        let totalScore = 0;
        let maxScore = PSYCHOMETRIC_QUESTIONS.length * 5;

        PSYCHOMETRIC_QUESTIONS.forEach((q) => {
          const chosenOptId = submittedAnswers[q.id];
          const matchedOpt = q.options.find((o) => o.id === chosenOptId);
          if (matchedOpt) {
            totalScore += matchedOpt.score;
          } else {
            totalScore += 3; // neutral default
          }
        });

        scorePercentage = Math.round((totalScore / maxScore) * 100);

        inMemoryStore.updateState(studentId, {
          psychometricCompleted: true,
          psychometricScore: scorePercentage,
          psychometricAttemptId: "att_psy_" + Date.now(),
        });
      } else {
        // Aptitude
        let correctCount = 0;
        const total = APTITUDE_QUESTIONS.length;

        APTITUDE_QUESTIONS.forEach((q) => {
          const chosen = submittedAnswers[q.id];
          if (chosen === q.correctAnswer) {
            correctCount++;
          }
        });

        scorePercentage = Math.round((correctCount / total) * 100);

        inMemoryStore.updateState(studentId, {
          aptitudeCompleted: true,
          aptitudeScore: scorePercentage,
          aptitudeAttemptId: "att_apt_" + Date.now(),
        });
      }

      // Try saving attempt in DB
      try {
        if (session?.user?.id) {
          const attempt = await (prisma.attempt as any).create({
            data: {
              studentId: session.user.id,
              assessmentId: "assessment-" + assessmentCategory.toLowerCase(),
              status: "COMPLETED",
              score: scorePercentage,
              category: assessmentCategory,
              endTime: new Date(),
            },
          });

          if (scorePercentage >= 60) {
            await (prisma.certificate as any).create({
              data: {
                studentId: session.user.id,
                programId: "prog_succeed_core",
                assessmentResultId: attempt.id,
              },
            });
          }
        }
      } catch (dbErr) {
        console.warn("DB attempt save skipped:", dbErr);
      }

      return NextResponse.json({
        success: true,
        category: assessmentCategory,
        score: scorePercentage,
        redirectUrl: "/student/results",
      });
    }

    // Form data submit fallback
    const formData = await req.formData();
    const assessmentId = formData.get("assessmentId")?.toString() || "default";

    const attemptId = "att_" + Date.now();
    inMemoryStore.updateState(studentId, {
      aptitudeCompleted: true,
      aptitudeScore: 80,
      aptitudeAttemptId: attemptId,
    });

    return NextResponse.redirect(new URL("/student/results", req.url), 303);
  } catch (error) {
    console.error("Error submitting assessment:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
