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
    if (!data.text || !data.type) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Create the question in the database
    const question = await prisma.question.create({
      data: {
        text: data.text,
        type: data.type,
        parameter: data.parameter || null,
        correctAnswer: data.correctAnswer || null,
        options: data.options || [],
      }
    });

    return NextResponse.json(question, { status: 201 });

  } catch (error) {
    console.error("Error creating question:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
