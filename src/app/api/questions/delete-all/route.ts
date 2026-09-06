import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

/*
 * ============================================================
 * DELETE ALL QUESTIONS
 *
 * Used by the admin to clear the question bank.
 * Optionally scope deletion to one assessment type:
 *   /api/questions/delete-all?assessmentType=APTITUDE
 *   /api/questions/delete-all  (deletes ALL questions)
 * ============================================================
 */

export async function DELETE(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "OFFICIAL") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(req.url);
    const assessmentType = searchParams.get("assessmentType");

    /*
     * ============================================================
     * FIND QUESTIONS TO DELETE
     * ============================================================
     */

    let questions = [];

    if (assessmentType) {
      const assessment = await prisma.assessment.findFirst({
        where: { type: assessmentType },
      });

      if (!assessment) {
        return NextResponse.json(
          { error: `No ${assessmentType} assessment found` },
          { status: 404 }
        );
      }

      questions = (
        await prisma.assessmentQuestion.findMany({
          where: { assessmentId: assessment.id },
          include: { question: true },
        })
      ).map((aq) => aq.question);
    } else {
      questions = await prisma.question.findMany();
    }

    const questionIds = questions.map((q) => q.id);

    if (questionIds.length === 0) {
      return NextResponse.json({
        success: true,
        deletedCount: 0,
        message: "No questions to delete.",
      });
    }

    /*
     * ============================================================
     * DELETE (cascade handles AssessmentQuestion links)
     * ============================================================
     */

    const result = await prisma.question.deleteMany({
      where: { id: { in: questionIds } },
    });

    return NextResponse.json({
      success: true,
      deletedCount: result.count,
      message: `Deleted ${result.count} question${result.count === 1 ? "" : "s"} successfully.`,
    });
  } catch (error) {
    console.error("DELETE all questions error:", error);

    return NextResponse.json(
      { error: "Failed to delete questions" },
      { status: 500 }
    );
  }
}