import {
  DEFAULT_WHEEL_DIMENSIONS,
  MIN_WHEEL_DIMENSIONS,
  MAX_WHEEL_DIMENSIONS,
} from "./wheelScoring";

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

  // Calculate raw average and cap at 10.0 max since each dimension is rated 1-10
  const average = Math.min(safeTotal / divisor, 10.0);

  return Math.round(average * 10) / 10;
}

export function countWheelDimensions(dimensions: unknown): number {
  if (!dimensions || typeof dimensions !== "object" || Array.isArray(dimensions)) {
    return 0;
  }

  return Object.keys(dimensions as Record<string, unknown>).length;
}
