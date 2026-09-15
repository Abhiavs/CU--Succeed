import type {
  WheelDimension,
  WheelScore,
} from "@prisma/client";

/*
 * ============================================================
 * WHEEL COMPARISON PAIRING (shared)
 *
 * Pairs a student's PRE and POST wheel scores per dimension,
 * ready to plot as a grouped bar chart.
 *
 * PRE and POST are stored as separate WheelScore rows whose
 * `dimensions` JSON is keyed by WheelDimension id. PRE and POST
 * dimension ids differ (POST has its own rows), so the two sets
 * are paired by NORMALISED NAME rather than by id.
 *
 * Used by /api/student/wheel-comparison and the per-student
 * admin graph page — keep this the single source of the pairing
 * logic.
 * ============================================================
 */

/*
 * Normalised name matching, so near-duplicates pair up:
 *   "Communication Skills" (PRE)  ->  communicationskill
 *   "communication skill"  (POST) ->  communicationskill
 *
 * Must stay identical to scripts/mirrorPostWheelDimensions.mjs.
 */
export function normaliseWheelName(name: unknown) {
  return String(name ?? "")
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "")
    .replace(/s$/, "");
}

export function asRecord(value: unknown): Record<string, unknown> {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return {};
  }
  return value as Record<string, unknown>;
}

export function toScore(value: unknown): number | null {
  if (value === null || value === undefined) return null;
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
}

export type WheelComparisonRow = {
  name: string;
  pre: number | null;
  post: number | null;
};

export function buildWheelComparisonRows(
  preScore: WheelScore | null,
  postScore: WheelScore | null,
  preDims: WheelDimension[],
  postDims: WheelDimension[]
): WheelComparisonRow[] {
  const postByNorm = new Map(
    postDims.map((d) => [normaliseWheelName(d.name), d])
  );

  const preValues = asRecord(preScore?.dimensions);
  const postValues = asRecord(postScore?.dimensions);

  /*
   * Dimension definitions. PRE drives the x-axis order; the
   * matching POST row supplies the POST-side key.
   */
  return preDims.map((preDim) => {
    const postDim = postByNorm.get(
      normaliseWheelName(preDim.name)
    );

    return {
      name: preDim.name,
      pre: toScore(preValues[preDim.id]),
      post: postDim ? toScore(postValues[postDim.id]) : null,
    };
  });
}
