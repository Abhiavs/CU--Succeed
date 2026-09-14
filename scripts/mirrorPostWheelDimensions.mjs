/*
 * ============================================================
 * MIRROR POST WHEEL DIMENSIONS
 *
 * The PRE assessment has five dimensions but POST had only one
 * ("communication skill" / sortOrder 1), so a Pre-vs-Post
 * comparison chart had nothing to pair the other four PRE bars
 * with.
 *
 * This script creates the MISSING POST dimensions so each PRE
 * dimension has a POST counterpart to compare against.
 *
 * Properties:
 *   - Idempotent: safe to run repeatedly.
 *   - Non-destructive: never updates or deletes existing rows,
 *     so the pre-existing "communication skill" row is left
 *     exactly as it is. It is matched by a normalised name
 *     instead (see normalise()).
 *
 * Usage:  node scripts/mirrorPostWheelDimensions.mjs
 * ============================================================
 */

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/*
 * Normalised comparison so that near-duplicate names pair up:
 *   "Communication Skills" (PRE)  ->  communicationskill
 *   "communication skill"  (POST) ->  communicationskill
 *
 * Lower-cases, drops anything that is not a letter/digit, then
 * trims a trailing "s". Applied to BOTH sides, so it stays
 * consistent even when the result is not a real word.
 */
function normalise(name) {
  return String(name || "")
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "")
    .replace(/s$/, "");
}

async function main() {
  const pre = await prisma.wheelDimension.findMany({
    where: { assessmentType: "PRE", isActive: true },
    orderBy: { sortOrder: "asc" },
  });

  const post = await prisma.wheelDimension.findMany({
    where: { assessmentType: "POST" },
  });

  if (pre.length === 0) {
    console.log("No active PRE dimensions found — nothing to mirror.");
    return;
  }

  const postByNorm = new Map(
    post.map((d) => [normalise(d.name), d])
  );

  console.log(`PRE dimensions: ${pre.length}`);
  console.log(`POST dimensions (before): ${post.length}\n`);

  let created = 0;

  for (const dim of pre) {
    const key = normalise(dim.name);

    if (postByNorm.has(key)) {
      const existing = postByNorm.get(key);
      console.log(
        `  =  ${dim.name.padEnd(26)} already has POST "${existing.name}"`
      );
      continue;
    }

    const made = await prisma.wheelDimension.create({
      data: {
        name: dim.name,
        assessmentType: "POST",
        sortOrder: dim.sortOrder,
        isActive: true,
      },
    });

    postByNorm.set(key, made);
    created++;
    console.log(
      `  +  ${dim.name.padEnd(26)} created POST  (sortOrder ${dim.sortOrder})`
    );
  }

  const after = await prisma.wheelDimension.findMany({
    where: { assessmentType: "POST" },
    orderBy: { sortOrder: "asc" },
  });

  console.log(`\nCreated ${created} POST dimension(s).`);
  console.log(`POST dimensions (after): ${after.length}`);
  after.forEach((d) =>
    console.log(`  ${String(d.sortOrder).padStart(2)}. ${d.name}`)
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
