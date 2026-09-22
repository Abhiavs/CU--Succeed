/*
 * ============================================================
 * WHEEL SCORING (shared)
 *
 * A competency wheel is scored across its ACTIVE dimensions —
 * 5 for PRE and 5 for POST — so the average is the sum of the
 * self-ratings divided by the NUMBER OF DIMENSIONS ON THE WHEEL,
 * not by a fixed 10.
 *
 * The divisor is resolved from the database rather than hardcoded,
 * because an admin can add or deactivate dimensions. It is clamped
 * to [1, 10] rather than trusted blindly: a wheel with no active
 * dimensions would otherwise divide by zero, and a runaway divisor
 * would silently crush every average toward 0.
 *
 * Single source of truth — used by POST /api/wheel and both wheel
 * pages. Keep the rounding here in step with the display sites.
 * ============================================================
 */

/*
 * Fallback divisor. PRE and POST both ship with 5 dimensions, so
 * a wheel whose dimension count cannot be resolved still scores
 * the way the current cohort expects.
 */
export const DEFAULT_WHEEL_DIMENSIONS = 5;

export const MIN_WHEEL_DIMENSIONS = 1;
export const MAX_WHEEL_DIMENSIONS = 10;

/*
 * Number of dimensions the average should divide by.
 */
export function wheelDimensionDivisor(activeDimensionCount: unknown): number {
  const count = Math.floor(Number(activeDimensionCount));

  if (!Number.isFinite(count) || count < MIN_WHEEL_DIMENSIONS) {
    return DEFAULT_WHEEL_DIMENSIONS;
  }

  return Math.min(count, MAX_WHEEL_DIMENSIONS);
}

/*
 * Average self-rating, rounded to 1 decimal place. The rating scale
 * itself stays 1–10 per dimension, so the average is also 0–10.
 */
export function averageWheelScore(
  totalScore: number,
  activeDimensionCount: unknown
): number {
  const safeTotal = Number.isFinite(Number(totalScore)) ? Number(totalScore) : 0;

  const average = safeTotal / wheelDimensionDivisor(activeDimensionCount);

  return Math.round(average * 10) / 10;
}

/*
 * Count the scored dimensions in a stored/submitted dimensions map.
 * Used when the DB count is unavailable.
 */
export function countWheelDimensions(dimensions: unknown): number {
  if (!dimensions || typeof dimensions !== "object" || Array.isArray(dimensions)) {
    return 0;
  }

  return Object.keys(dimensions as Record<string, unknown>).length;
}