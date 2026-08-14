import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "OFFICIAL") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await req.json();

    const { id } = await params;
    const assessment = await prisma.assessment.update({
      where: { id },
      data: { isActive: data.isActive }
    });

    return NextResponse.json(assessment, { status: 200 });
  } catch (error) {
    console.error("Error updating assessment:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "OFFICIAL") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    // Must delete related AssessmentQuestions first due to foreign keys
    await prisma.assessmentQuestion.deleteMany({
      where: { assessmentId: id }
    });

    // Delete attempts and responses for this assessment? (Cascade should ideally handle this, but checking schema).
    // Let's rely on Prisma deleting it if it doesn't fail. If there are attempts, deleting the assessment might be bad practice.
    // For safety, let's check if there are attempts.
    const attemptCount = await prisma.attempt.count({ where: { assessmentId: id } });
    if (attemptCount > 0) {
      return NextResponse.json({ error: "Cannot delete an assessment that has existing student attempts. Pause it instead." }, { status: 400 });
    }

    await prisma.assessment.delete({
      where: { id }
    });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Error deleting assessment:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
