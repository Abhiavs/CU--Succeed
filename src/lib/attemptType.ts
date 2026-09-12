/*
 * ============================================================
 * ATTEMPT TYPE HELPERS
 *
 * Shared between the admin Results page (/admin/results) and
 * the Excel export route (/api/admin/results/export) so the
 * two views always classify attempts the same way.
 * ============================================================
 */

export type ResultTabType =
  | "PSYCHOMETRIC"
  | "WHEEL"
  | "POST";

/*
 * Tab string used in the URL (?tab=...) -> ResultTabType.
 */

export type ResultTabParam =
  | "psychometric"
  | "wheel"
  | "post";

export function getAttemptType(
  attempt: any
): ResultTabType | "OTHER" {
  if (!attempt) {
    return "OTHER";
  }

  /*
   * Category is used first because some assessment
   * types may be stored separately from the Assessment model.
   */

  const category = String(
    attempt.category || ""
  ).toUpperCase();

  const assessmentType = String(
    attempt.assessment?.type || ""
  ).toUpperCase();

  const type = category || assessmentType;

  if (type === "PSYCHOMETRIC") {
    return "PSYCHOMETRIC";
  }

  if (type === "WHEEL") {
    return "WHEEL";
  }

  /*
   * APTITUDE is treated as POST because the application
   * uses aptitude for the post assessment.
   */

  if (
    type === "POST" ||
    type === "POST_ASSESSMENT" ||
    type === "APTITUDE"
  ) {
    return "POST";
  }

  return "OTHER";
}

export function getResultTabTitle(
  tab: ResultTabType
): string {
  switch (tab) {
    case "PSYCHOMETRIC":
      return "Psychometric Assessment";
    case "WHEEL":
      return "Wheel of Competencies";
    case "POST":
      return "Post Assessment";
    default:
      return "Assessment";
  }
}

export function parseResultTab(
  param: string | undefined
): ResultTabType {
  return param === "wheel"
    ? "WHEEL"
    : param === "post"
    ? "POST"
    : "PSYCHOMETRIC";
}
