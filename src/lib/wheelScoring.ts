/*
 * ============================================================
 * WHEEL SCORING (shared)
 *
 * Exact formula: Sum of ratings in each dimension / Total number of dimensions (5).
 * Capped strictly between 1.0 and 10.0.
 * ============================================================
 */

export const DEFAULT_WHEEL_DIMENSIONS = 5;
export const MIN_WHEEL_DIMENSIONS = 1;
export const MAX_WHEEL_DIMENSIONS = 10;

export function wheelDimensionDivisor(activeDimensionCount: unknown): number {
  const count = Math.floor(Number(activeDimensionCount));

  if (!Number.isFinite(count) || count < MIN_WHEEL_DIMENSIONS) {
    return DEFAULT_WHEEL_DIMENSIONS;
  }

  return Math.min(count, MAX_WHEEL_DIMENSIONS);
}

export function averageWheelScore(
  totalScore: number,
  activeDimensionCount: unknown
): number {
  const safeTotal = Number.isFinite(Number(totalScore)) ? Number(totalScore) : 0;
  const divisor = wheelDimensionDivisor(activeDimensionCount);

  // Strict formula: Sum of total scores divided by total number of dimensions
  const average = safeTotal / divisor;

  // Clamp strictly between 1.0 and 10.0
  const clamped = Math.max(1.0, Math.min(average, 10.0));

  return Math.round(clamped * 10) / 10;
}

export function countWheelDimensions(dimensions: unknown): number {
  if (!dimensions || typeof dimensions !== "object" || Array.isArray(dimensions)) {
    return DEFAULT_WHEEL_DIMENSIONS;
  }

  const keys = Object.keys(dimensions as Record<string, unknown>);
  return keys.length > 0 ? keys.length : DEFAULT_WHEEL_DIMENSIONS;
}
