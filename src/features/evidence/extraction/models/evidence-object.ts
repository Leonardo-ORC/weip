/**
 * Evidence Object — the central entity of the entire WEIP platform.
 *
 * This model is intentionally read-only and populated by future extraction
 * sprints. Every downstream layer (intelligence, gaps, applications)
 * consumes evidence exclusively through this shape.
 */

// ─────────────────────────────────────────────────────────────────────────────
// Vocabulary
// ─────────────────────────────────────────────────────────────────────────────

export type EvidenceConfidenceLevel =
  | "very-low"
  | "low"
  | "moderate"
  | "high"
  | "very-high";

export type StudyDesign =
  | "randomized-controlled-trial"
  | "cohort"
  | "case-control"
  | "cross-sectional"
  | "case-series"
  | "case-report"
  | "systematic-review"
  | "meta-analysis"
  | "guideline"
  | "in-vitro"
  | "in-vivo"
  | "other";

export type HormonalStatus =
  | "premenopausal"
  | "perimenopausal"
  | "postmenopausal"
  | "pregnant"
  | "lactating"
  | "hormonal-contraception"
  | "hormone-replacement-therapy"
  | "unknown"
  | "not-applicable";

export type PregnancyStatus =
  | "not-pregnant"
  | "pregnant"
  | "postpartum"
  | "unknown"
  | "not-applicable";

export type MenopauseStatus =
  | "pre"
  | "peri"
  | "post"
  | "surgical"
  | "unknown"
  | "not-applicable";

// ─────────────────────────────────────────────────────────────────────────────
// Substructures
// ─────────────────────────────────────────────────────────────────────────────

export interface EvidenceSource {
  readonly providerId: string;
  readonly providerName: string;
  readonly externalId: string;
  readonly url?: string;
  readonly license?: string;
  readonly retrievedAt?: string;
}

export interface EvidenceCitation {
  readonly text: string;
  readonly doi?: string;
  readonly pmid?: string;
  readonly nctId?: string;
  readonly url?: string;
}

export interface EvidencePublication {
  readonly title: string;
  readonly abstract?: string;
  readonly journal?: string;
  readonly year?: number;
  readonly authors?: readonly string[];
  readonly language?: string;
}

export interface EvidenceStudy {
  readonly design?: StudyDesign;
  readonly registryId?: string;
  readonly phase?: string;
  readonly durationDays?: number;
  readonly blinding?: string;
  readonly followUpDays?: number;
}

export interface AgeRange {
  readonly min?: number;
  readonly max?: number;
  readonly meanYears?: number;
  readonly unit?: "years" | "months" | "weeks";
}

export interface EvidencePopulation {
  readonly description?: string;
  readonly sex?: "female" | "male" | "mixed" | "unspecified";
  readonly ageRange?: AgeRange;
  readonly ethnicity?: readonly string[];
  readonly inclusionCriteria?: readonly string[];
  readonly exclusionCriteria?: readonly string[];
}

export interface EvidenceCondition {
  readonly name: string;
  readonly mesh?: string;
  readonly snomed?: string;
  readonly icd10?: string;
}

export interface EvidenceIntervention {
  readonly name: string;
  readonly type?: "drug" | "device" | "behavioral" | "procedure" | "other";
  readonly dosage?: string;
  readonly route?: string;
  readonly frequency?: string;
  readonly rxnorm?: string;
  readonly atc?: string;
}

export interface EvidenceComparison {
  readonly name?: string;
  readonly type?: "placebo" | "active-comparator" | "standard-of-care" | "none" | "other";
  readonly description?: string;
}

export interface EvidenceEffectSize {
  readonly measure?:
    | "risk-ratio"
    | "odds-ratio"
    | "hazard-ratio"
    | "mean-difference"
    | "standardized-mean-difference"
    | "absolute-risk-difference"
    | "other";
  readonly value?: number;
  readonly ciLower?: number;
  readonly ciUpper?: number;
  readonly ciLevel?: number;
  readonly pValue?: number;
}

export interface EvidenceOutcome {
  readonly name: string;
  readonly type?: "primary" | "secondary" | "safety" | "exploratory";
  readonly timepoint?: string;
  readonly effect?: EvidenceEffectSize;
  readonly direction?: "beneficial" | "harmful" | "no-effect" | "inconclusive";
}

export interface AdverseEvent {
  readonly term: string;
  readonly grade?: string;
  readonly frequency?: number;
  readonly seriousness?: "serious" | "non-serious" | "unknown";
  readonly meddra?: string;
}

export interface QualityIndicator {
  readonly framework: "grade" | "risk-of-bias-2" | "newcastle-ottawa" | "cochrane" | "other";
  readonly domain?: string;
  readonly rating?: "low" | "moderate" | "high" | "unclear" | "critical";
  readonly notes?: string;
}

export interface EvidenceMetadata {
  readonly extractionModelId?: string;
  readonly extractionModelVersion?: string;
  readonly promptId?: string;
  readonly promptVersion?: string;
  readonly extractedAt?: string;
  readonly reviewedAt?: string;
  readonly reviewer?: string;
  readonly schemaVersion: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// Root entity
// ─────────────────────────────────────────────────────────────────────────────

export interface EvidenceObject {
  readonly identifier: string;
  readonly source: EvidenceSource;
  readonly citation: EvidenceCitation;
  readonly publication: EvidencePublication;
  readonly study: EvidenceStudy;
  readonly population: EvidencePopulation;
  readonly condition?: EvidenceCondition;
  readonly intervention?: EvidenceIntervention;
  readonly comparison?: EvidenceComparison;
  readonly outcomes: readonly EvidenceOutcome[];
  readonly adverseEvents?: readonly AdverseEvent[];
  readonly hormonalStatus?: HormonalStatus;
  readonly pregnancyStatus?: PregnancyStatus;
  readonly menopauseStatus?: MenopauseStatus;
  readonly ageRange?: AgeRange;
  readonly sampleSize?: number;
  readonly country?: readonly string[];
  readonly studyDesign?: StudyDesign;
  readonly effectSize?: EvidenceEffectSize;
  readonly confidence?: EvidenceConfidenceLevel;
  readonly limitations?: readonly string[];
  readonly qualityIndicators?: readonly QualityIndicator[];
  readonly metadata: EvidenceMetadata;
}

export const EVIDENCE_OBJECT_SCHEMA_VERSION = "0.1.0" as const;
