import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "STUDENT") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await req.formData();
    const assessmentId = formData.get("assessmentId")?.toString();

    if (!assessmentId) {
      return NextResponse.json({ error: "Missing assessment ID" }, { status: 400 });
    }

    // Fetch the assessment and its questions to grade
    const assessment = await prisma.assessment.findUnique({
      where: { id: assessmentId },
      include: {
        questions: {
          include: {
            question: true
          }
        }
      }
    });

    if (!assessment) {
      return NextResponse.json({ error: "Assessment not found" }, { status: 404 });
    }

    let correctCount = 0;
    const totalQuestions = assessment.questions.length;
    const responses = [];

    // Grade each question
    for (const q of assessment.questions) {
      const questionId = q.question.id;
      const submittedAnswer = formData.get(`q_${questionId}`)?.toString();
      const isCorrect = submittedAnswer === q.question.correctAnswer;
      
      if (isCorrect) correctCount++;

      responses.push({
        questionId: questionId,
        answer: submittedAnswer || "",
        isCorrect: isCorrect
      });
    }

    const scorePercentage = (correctCount / totalQuestions) * 100;

    // Create the attempt
    const attempt = await prisma.attempt.create({
      data: {
        studentId: session.user.id,
        assessmentId: assessment.id,
        status: "COMPLETED",
        score: scorePercentage,
        endTime: new Date(),
        responses: {
          create: responses
        }
      }
    });

    // Generate a mock certificate if score > 50 (just for demo purposes)
    if (scorePercentage > 50) {
      await prisma.certificate.create({
        data: {
          studentId: session.user.id,
          programId: assessment.programId,
          assessmentResultId: attempt.id,
        }
      });
    }

    // Redirect back to the reports page
    return NextResponse.redirect(new URL(`/student/reports?attemptId=${attempt.id}`, req.url), 303);

  } catch (error) {
    console.error("Error submitting assessment:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
