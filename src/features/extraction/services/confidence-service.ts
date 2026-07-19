import type {
  BiomedicalEntitySet,
  ConfidenceGroup,
  ConfidenceReport,
  StudyAttributes,
  WomensHealthConceptSet,
} from "../types";

export interface ConfidenceInput {
  readonly hasBibliography: boolean;
  readonly entities: BiomedicalEntitySet;
  readonly womensHealth: WomensHealthConceptSet;
  readonly study: StudyAttributes;
}

function average(nums: readonly number[]): number {
  if (nums.length === 0) return 0;
  const total = nums.reduce((acc, n) => acc + n, 0);
  return total / nums.length;
}

function grade(overall: number): ConfidenceReport["grade"] {
  if (overall >= 0.85) return "very-high";
  if (overall >= 0.7) return "high";
  if (overall >= 0.5) return "moderate";
  if (overall >= 0.3) return "low";
  return "very-low";
}

export const ConfidenceService = {
  score(input: ConfidenceInput): ConfidenceReport {
    const bibliography = input.hasBibliography ? 0.95 : 0.4;

    const biomedical =
      input.entities.items.length === 0
        ? 0
        : Math.min(
            1,
            average(input.entities.items.map((i) => i.confidence)) *
              Math.min(1, 0.4 + input.entities.items.length / 12),
          );

    const womens =
      input.womensHealth.matches.length === 0
        ? 0
        : average(input.womensHealth.matches.map((m) => m.confidence));

    const studyFields = [
      input.study.population,
      input.study.sampleSize,
      input.study.intervention,
      input.study.comparator,
      input.study.primaryOutcome,
      input.study.studyPhase,
      input.study.studyDesign,
      input.study.eligibility,
      input.study.followUp,
      input.study.evidenceLevel,
      input.study.institution,
    ];
    const studyExtracted = studyFields.filter((f) => f.method !== "not-extracted");
    const study =
      studyExtracted.length === 0
        ? 0
        : (studyExtracted.length / studyFields.length) *
          average(studyExtracted.map((f) => f.confidence));

    const outcomeFields = [
      input.study.primaryOutcome,
      input.study.secondaryOutcomes,
      input.study.adverseEvents,
    ];
    const outcomeExtracted = outcomeFields.filter((f) => f.method !== "not-extracted");
    const outcomes =
      outcomeExtracted.length === 0
        ? 0
        : (outcomeExtracted.length / outcomeFields.length) *
          average(outcomeExtracted.map((f) => f.confidence));

    const byGroup: Record<ConfidenceGroup, number> = {
      bibliography,
      biomedical,
      "womens-health": womens,
      study,
      outcomes,
    };

    const overall =
      bibliography * 0.15 +
      biomedical * 0.25 +
      womens * 0.15 +
      study * 0.3 +
      outcomes * 0.15;

    return { overall, byGroup, grade: grade(overall) };
  },
};

export type IConfidenceService = typeof ConfidenceService;
