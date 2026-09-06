import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const CORE_PROGRAM_ID = "prog_succeed_core";

/*
 * ============================================================
 * GET POST ASSESSMENT PUBLISH STATUS
 * ============================================================
 */
export async function GET() {
  try {
    const program = await prisma.program.findUnique({
      where: { id: CORE_PROGRAM_ID },
      select: { postAssessmentPublished: true },
    });

    return NextResponse.json({
      success: true,
      published: program?.postAssessmentPublished ?? false,
    });
  } catch (error) {
    console.error("GET post publish status error:", error);
    return NextResponse.json(
      { error: "Failed to get publish status" },
      { status: 500 }
    );
  }
}

/*
 * ============================================================
 * TOGGLE POST ASSESSMENT PUBLISH STATUS
 * ============================================================
 */
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "OFFICIAL") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { published } = body;

    if (typeof published !== "boolean") {
      return NextResponse.json(
        { error: "Published status must be a boolean" },
        { status: 400 }
      );
    }

    const program = await prisma.program.update({
      where: { id: CORE_PROGRAM_ID },
      data: { postAssessmentPublished: published },
    });

    return NextResponse.json({
      success: true,
      published: program.postAssessmentPublished,
    });
  } catch (error) {
    console.error("POST publish toggle error:", error);
    return NextResponse.json(
      { error: "Failed to toggle publish status" },
      { status: 500 }
    );
  }
}
