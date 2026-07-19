/**
 * Contracts for the Evidence Extraction Engine.
 *
 * These types are provider-agnostic and describe the shape of every
 * structured attribute the engine can extract from a NormalizedRecord.
 */

export type ExtractionMethod =
  | "deterministic"
  | "ai-assisted"
  | "hybrid"
  | "not-extracted";

export type ExtractionSource =
  | "title"
  | "abstract"
  | "keywords"
  | "mesh"
  | "metadata"
  | "authors"
  | "journal"
  | "clinical-trial"
  | "openalex"
  | "unknown";

export interface FieldProvenance {
  readonly source: ExtractionSource;
  readonly locator?: string;
  readonly snippet?: string;
}

export interface ExtractedField<T> {
  readonly value: T;
  readonly method: ExtractionMethod;
  readonly confidence: number; // 0..1
  readonly provenance: readonly FieldProvenance[];
}

// ─── Biomedical entities ────────────────────────────────────────────────

export type BiomedicalEntityKind =
  | "disease"
  | "condition"
  | "hormone"
  | "drug"
  | "biomarker"
  | "gene"
  | "protein"
  | "lab-test"
  | "symptom"
  | "procedure"
  | "clinical-outcome"
  | "device";

export interface BiomedicalEntity {
  readonly label: string;
  readonly kind: BiomedicalEntityKind;
  readonly confidence: number;
  readonly provenance: readonly FieldProvenance[];
}

export interface BiomedicalEntitySet {
  readonly items: readonly BiomedicalEntity[];
  readonly countsByKind: Readonly<Record<BiomedicalEntityKind, number>>;
}

// ─── Women's Health concepts ────────────────────────────────────────────

export type WomensHealthConcept =
  | "pregnancy"
  | "trimester"
  | "breastfeeding"
  | "postpartum"
  | "menopause"
  | "perimenopause"
  | "premenopause"
  | "pcos"
  | "endometriosis"
  | "fertility"
  | "ivf"
  | "contraception"
  | "hormonal-therapy"
  | "menstrual-cycle"
  | "gynecologic"
  | "reproductive-health";

export interface WomensHealthMatch {
  readonly concept: WomensHealthConcept;
  readonly confidence: number;
  readonly provenance: readonly FieldProvenance[];
}

export interface WomensHealthConceptSet {
  readonly matches: readonly WomensHealthMatch[];
  readonly primary: WomensHealthConcept | null;
}

// ─── Study attributes ───────────────────────────────────────────────────

export interface StudyAttributes {
  readonly population: ExtractedField<string | null>;
  readonly sampleSize: ExtractedField<number | null>;
  readonly intervention: ExtractedField<string | null>;
  readonly comparator: ExtractedField<string | null>;
  readonly primaryOutcome: ExtractedField<string | null>;
  readonly secondaryOutcomes: ExtractedField<readonly string[]>;
  readonly adverseEvents: ExtractedField<readonly string[]>;
  readonly eligibility: ExtractedField<string | null>;
  readonly studyPhase: ExtractedField<string | null>;
  readonly studyDesign: ExtractedField<string | null>;
  readonly followUp: ExtractedField<string | null>;
  readonly evidenceLevel: ExtractedField<string | null>;
  readonly countries: ExtractedField<readonly string[]>;
  readonly institution: ExtractedField<string | null>;
  readonly funding: ExtractedField<string | null>;
}

// ─── Confidence, traceability, validation ───────────────────────────────

export interface ConfidenceReport {
  readonly overall: number; // 0..1
  readonly byGroup: Readonly<Record<ConfidenceGroup, number>>;
  readonly grade: "very-low" | "low" | "moderate" | "high" | "very-high";
}

export type ConfidenceGroup =
  | "bibliography"
  | "biomedical"
  | "womens-health"
  | "study"
  | "outcomes";

export interface TraceabilityEntry {
  readonly field: string;
  readonly source: ExtractionSource;
  readonly locator?: string;
  readonly snippet?: string;
  readonly method: ExtractionMethod;
}

export interface TraceabilityMap {
  readonly entries: readonly TraceabilityEntry[];
}

export type ValidationSeverity = "info" | "warn" | "error";

export interface ValidationIssue {
  readonly code: string;
  readonly severity: ValidationSeverity;
  readonly message: string;
  readonly field?: string;
}

export interface ValidationReport {
  readonly issues: readonly ValidationIssue[];
  readonly score: number; // 0..1
  readonly passed: boolean;
}

export interface EvidenceExtractionMetadata {
  readonly extractedAt: string;
  readonly engineVersion: string;
  readonly strategies: readonly ExtractionMethod[];
  readonly aiProviderId: string | null;
  readonly durationMs: number;
}
