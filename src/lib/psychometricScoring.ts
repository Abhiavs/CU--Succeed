import {
  PSYCHOMETRIC_SECTIONS,
  getSectionIdFromParameter,
  type PsychometricSectionId,
} from "@/lib/assessmentData";

export interface PsychometricOption {
  id: string;
  text: string;
}

/**
 * Score one answer on a 4-point scale.
 *
 * Each question has a `correctAnswer` — the id of the highest-scoring
 * option. The chosen option is scored by its distance from that.
 *
 * Options are ordered most-confidence → least-confidence, so with
 * 4 options:
 *   correct (distance 0)  -> 4
 *   1 step away           -> 3
 *   2 steps away          -> 2
 *   opposite (distance 3) -> 1
 */
export function scorePsychometricAnswer(
  options: PsychometricOption[],
  chosenOptionId: string | null | undefined,
  correctAnswer: string | null
): number {
  if (!chosenOptionId) return 0;

  const chosenIndex = options.findIndex(
    (option) => option.id === chosenOptionId
  );

  const correctIndex = options.findIndex(
    (option) => option.id === correctAnswer
  );

  /*
   * Invalid / missing answer scores the midpoint (2) rather than 0,
   * keeping the result interpretable on the 1–4 scale.
   */
  if (chosenIndex === -1) return 2;
  if (correctIndex === -1) return 2;

  const distance = Math.abs(chosenIndex - correctIndex);
  return Math.max(1, 4 - distance);
}

export interface PsychometricSectionScore {
  sectionId: PsychometricSectionId;
  name: string;
  questionRange: string;
  maxScore: number;
  rawScore: number;
  maxPossible: number;
  answeredCount: number;
}

export interface PsychometricScoringResult {
  totalRawScore: number;
  maxPossible: number;
  answeredCount: number;
  scorePercentage: number;
  sections: PsychometricSectionScore[];
}

/**
 * Score a full psychometric attempt.
 *
 * Questions are grouped into the 3 sections by their `parameter`
 * field. Each section is designed for 10 × 4 = /40; the returned
 * `maxPossible` reflects how many questions were actually assigned,
 * so a partially built bank stays honest.
 *
 * Questions without a recognised parameter are bucketed by *their own
 * order* among the unmatched questions (first 10 → section 1, next 10 →
 * section 2, the rest → section 3), so the per-section layout still
 * holds when parameters are missing from the database.
 *
 * @param questions [{ id, parameter, options, correctAnswer }]
 * @param answers   record of questionId -> selected option id
 */
export function scorePsychometric(
  questions: {
    id: string;
    parameter: string | null;
    options: PsychometricOption[];
    correctAnswer: string | null;
  }[],
  answers: Record<string, string>
): PsychometricScoringResult {
  let totalRawScore = 0;
  let maxPossible = 0;
  let answeredCount = 0;

  const sections: PsychometricSectionScore[] = PSYCHOMETRIC_SECTIONS.map(
    (section) => ({
      sectionId: section.id as PsychometricSectionId,
      name: section.name,
      questionRange: section.questionRange,
      maxScore: section.maxScore,
      rawScore: 0,
      maxPossible: 0,
      answeredCount: 0,
    })
  );

  let fallbackCount = 0;

  questions.forEach((question) => {
    const mappedId = getSectionIdFromParameter(question.parameter);

    let finalSectionId: PsychometricSectionId;
    if (mappedId) {
      finalSectionId = mappedId;
    } else {
      /*
       * Unmatched questions: bucket by position among the unmatched,
       * 10 per section.
       */
      finalSectionId =
        fallbackCount < 10
          ? "self-belief"
          : fallbackCount < 20
          ? "communication"
          : "action-resilience";
      fallbackCount++;
    }

    const section = sections.find(
      (s) => s.sectionId === finalSectionId
    );
    if (!section) return;

    const marks = scorePsychometricAnswer(
      question.options,
      answers[question.id],
      question.correctAnswer
    );

    totalRawScore += marks;
    maxPossible += 4;
    if (answers[question.id]) answeredCount++;

    section.rawScore += marks;
    section.maxPossible += 4;
    if (answers[question.id]) section.answeredCount++;
  });

  return {
    totalRawScore,
    maxPossible,
    answeredCount,
    scorePercentage:
      maxPossible > 0
        ? Math.round((totalRawScore / maxPossible) * 100)
        : 0,
    sections,
  };
}
