import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

const CORE_PROGRAM_ID = "prog_succeed_core";

async function seedApplication() {
  /*
   * =========================================================
   * 1. CREATE OR UPDATE MAIN PROGRAM
   * =========================================================
   */
  const program = await prisma.program.upsert({
    where: {
      id: CORE_PROGRAM_ID,
    },

    update: {
      name: "CU-SUCCEED",
      description:
        "CU-SUCCEED assessment and student development program.",
    },

    create: {
      id: CORE_PROGRAM_ID,
      name: "CU-SUCCEED",
      description:
        "CU-SUCCEED assessment and student development program.",
    },
  });

  /*
   * =========================================================
   * 2. CREATE OR FIND APTITUDE ASSESSMENT
   *
   * Questions are NOT seeded here.
   * Questions must be added by the administrator.
   * =========================================================
   */
  let aptitude = await prisma.assessment.findFirst({
    where: {
      type: "APTITUDE",
      programId: program.id,
    },
  });

  if (!aptitude) {
    aptitude = await prisma.assessment.create({
      data: {
        title: "Aptitude Assessment",

        description:
          "Assessment of aptitude, reasoning and problem-solving abilities.",

        type: "APTITUDE",

        isActive: false,

        programId: program.id,
      },
    });
  }

  /*
   * =========================================================
   * 3. CREATE OR FIND PSYCHOMETRIC ASSESSMENT
   *
   * Questions are NOT seeded here.
   * Questions must be added by the administrator.
   * =========================================================
   */
  let psychometric = await prisma.assessment.findFirst({
    where: {
      type: "PSYCHOMETRIC",
      programId: program.id,
    },
  });

  if (!psychometric) {
    psychometric = await prisma.assessment.create({
      data: {
        title: "Psychometric Assessment",

        description:
          "Assessment designed to understand student strengths, preferences and development dimensions.",

        type: "PSYCHOMETRIC",

        isActive: true,

        programId: program.id,
      },
    });
  }

  /*
   * =========================================================
   * 4. CREATE OR UPDATE ADMIN ACCOUNT
   * =========================================================
   */

  const adminEmail = "admin@cusucceed.com";
  const adminPassword = "admin123";

  const hashedPassword = await bcrypt.hash(
    adminPassword,
    10
  );

  const admin = await prisma.user.upsert({
    where: {
      email: adminEmail,
    },

    update: {
      name: "Super Admin",
      password: hashedPassword,
      role: "OFFICIAL",
    },

    create: {
      name: "Super Admin",
      email: adminEmail,
      password: hashedPassword,
      role: "OFFICIAL",
    },
  });

  /*
   * =========================================================
   * 5. COUNT QUESTIONS CURRENTLY ASSIGNED TO ASSESSMENTS
   *
   * This only reports the count.
   * It does NOT create questions.
   * =========================================================
   */

  const aptitudeQuestionCount =
    await prisma.assessmentQuestion.count({
      where: {
        assessmentId: aptitude.id,
      },
    });

  const psychometricQuestionCount =
    await prisma.assessmentQuestion.count({
      where: {
        assessmentId: psychometric.id,
      },
    });

  /*
   * =========================================================
   * 6. RETURN RESULT
   * =========================================================
   */

  return {
    success: true,

    message:
      "CU-SUCCEED seed completed successfully.",

    admin: {
      email: admin.email,
      role: admin.role,
    },

    loginCredentials: {
      email: adminEmail,
      password: adminPassword,
    },

    program: {
      id: program.id,
      name: program.name,
    },

    assessments: {
      aptitude: {
        id: aptitude.id,
        title: aptitude.title,
        type: aptitude.type,
        isActive: aptitude.isActive,
        questionCount: aptitudeQuestionCount,
      },

      psychometric: {
        id: psychometric.id,
        title: psychometric.title,
        type: psychometric.type,
        isActive: psychometric.isActive,
        questionCount: psychometricQuestionCount,
      },
    },
  };
}

/*
 * =========================================================
 * GET
 *
 * Allows opening:
 *
 * http://localhost:3000/api/seed
 *
 * directly in the browser.
 * =========================================================
 */

export async function GET() {
  try {
    const result = await seedApplication();

    return NextResponse.json(result, {
      status: 200,
    });
  } catch (error: unknown) {
    console.error("Seed error:", error);

    return NextResponse.json(
      {
        success: false,

        error:
          "Failed to seed application data",

        details:
          error instanceof Error
            ? error.message
            : "Unknown error",
      },
      {
        status: 500,
      }
    );
  }
}

/*
 * =========================================================
 * POST
 *
 * Also supports POST requests.
 * =========================================================
 */

export async function POST() {
  try {
    const result = await seedApplication();

    return NextResponse.json(result, {
      status: 200,
    });
  } catch (error: unknown) {
    console.error("Seed error:", error);

    return NextResponse.json(
      {
        success: false,

        error:
          "Failed to seed application data",

        details:
          error instanceof Error
            ? error.message
            : "Unknown error",
      },
      {
        status: 500,
      }
    );
  }
}