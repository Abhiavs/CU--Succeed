import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "OFFICIAL") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await req.json();
    
    // Validate
    if (!data.title || !data.type || !data.programId || !data.questionIds || data.questionIds.length === 0) {
      return NextResponse.json({ error: "Missing required fields or no questions selected" }, { status: 400 });
    }

    // Create the assessment
    const assessment = await prisma.assessment.create({
      data: {
        title: data.title,
        description: data.description || null,
        type: data.type,
        isActive: true,
        programId: data.programId,
        questions: {
          create: data.questionIds.map((qId: string) => ({
            questionId: qId
          }))
        }
      }
    });

    return NextResponse.json(assessment, { status: 201 });

  } catch (error) {
    console.error("Error creating assessment:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
