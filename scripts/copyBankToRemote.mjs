/*
 * Copies the question bank and wheel dimensions from the LOCAL database
 * to a REMOTE (hosted) database — the piece /api/seed does not cover.
 *
 * Usage:
 *   node scripts/copyBankToRemote.mjs "postgres://...remote-url..."
 *
 * Idempotent: safe to run more than once; existing rows are skipped.
 */

import { PrismaClient } from "@prisma/client";

const REMOTE_URL = process.argv[2] || process.env.REMOTE_DATABASE_URL;

if (!REMOTE_URL) {
  console.error(
    "Usage: node scripts/copyBankToRemote.mjs <remote-database-url>"
  );
  process.exit(1);
}

const CORE_PROGRAM_ID = "prog_succeed_core";

const local = new PrismaClient(); // reads DATABASE_URL from local .env
const remote = new PrismaClient({
  datasources: { db: { url: REMOTE_URL } },
});

async function main() {
  /*
   * 1. Make sure the core program exists on the remote (seed may not
   *    have run there yet). Safe even if /api/seed runs later — the
   *    seed upserts on the same fixed id.
   */
  await remote.program.upsert({
    where: { id: CORE_PROGRAM_ID },
    update: {},
    create: {
      id: CORE_PROGRAM_ID,
      name: "CU-SUCCEED",
      description: "CU-SUCCEED assessment and student development program.",
      postAssessmentPublished: false,
    },
  });

  /*
   * 2. Local assessments of the core program, with their questions.
   */
  const localAssessments = await local.assessment.findMany({
    where: { programId: CORE_PROGRAM_ID },
    include: {
      questions: {
        include: { question: true },
        orderBy: { questionId: "asc" },
      },
    },
  });

  let questionsCopied = 0;
  let linksCopied = 0;
  let assessmentsCopied = 0;

  for (const la of localAssessments) {
    // Find or create the matching remote assessment by type.
    let ra = await remote.assessment.findFirst({
      where: { type: la.type, programId: CORE_PROGRAM_ID },
    });

    if (!ra) {
      ra = await remote.assessment.create({
        data: {
          title: la.title,
          description: la.description,
          type: la.type,
          isActive: la.isActive,
          programId: CORE_PROGRAM_ID,
        },
      });
      assessmentsCopied++;
    }

    for (const link of la.questions) {
      const q = link.question;
      if (!q) continue;

      // Match remote questions by text + parameter so reruns skip
      // already-copied questions instead of duplicating them.
      let rq = await remote.question.findFirst({
        where: { text: q.text, parameter: q.parameter },
      });

      if (!rq) {
        rq = await remote.question.create({
          data: {
            text: q.text,
            type: q.type,
            parameter: q.parameter,
            correctAnswer: q.correctAnswer,
            options: q.options,
          },
        });
        questionsCopied++;
      }

      const existingLink = await remote.assessmentQuestion.findFirst({
        where: { assessmentId: ra.id, questionId: rq.id },
      });

      if (!existingLink) {
        await remote.assessmentQuestion.create({
          data: { assessmentId: ra.id, questionId: rq.id },
        });
        linksCopied++;
      }
    }
  }

  /*
   * 3. Wheel dimensions — matched by (name, assessmentType).
   */
  const localDims = await local.wheelDimension.findMany({
    orderBy: { sortOrder: "asc" },
  });

  let dimsCopied = 0;

  for (const dim of localDims) {
    const existing = await remote.wheelDimension.findFirst({
      where: { name: dim.name, assessmentType: dim.assessmentType },
    });

    if (!existing) {
      await remote.wheelDimension.create({
        data: {
          name: dim.name,
          assessmentType: dim.assessmentType,
          sortOrder: dim.sortOrder,
          isActive: dim.isActive,
        },
      });
      dimsCopied++;
    }
  }

  console.log("Copy complete:");
  console.log(`  assessments created: ${assessmentsCopied}`);
  console.log(`  questions copied:    ${questionsCopied}`);
  console.log(`  links created:       ${linksCopied}`);
  console.log(`  wheel dimensions:    ${dimsCopied}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await local.$disconnect();
    await remote.$disconnect();
  });
