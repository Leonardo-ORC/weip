import type { LucideIcon } from "lucide-react";

export type EvidenceType =
  | "clinical-trial"
  | "systematic-review"
  | "meta-analysis"
  | "guideline"
  | "drug-label"
  | "case-report";

export type StudyDesign =
  | "RCT"
  | "Cohort"
  | "Case-control"
  | "Cross-sectional"
  | "Meta-analysis"
  | "Systematic review"
  | "Guideline"
  | "Case report";

export type ConfidenceLevel = "high" | "moderate" | "low" | "very-low";
export type EvidenceQuality = "A" | "B" | "C" | "D";
export type EvidenceStatus = "structured" | "processing" | "draft" | "archived";
export type HormonalContext =
  | "reproductive"
  | "pregnancy"
  | "perimenopause"
  | "menopause"
  | "post-menopause"
  | "not-applicable";

export interface Publication {
  journal: string;
  year: number;
  authors: string[];
  doi?: string;
  citations?: number;
}

export interface Population {
  description: string;
  sampleSize: number;
  ageRange?: string;
  countries: string[];
  hormonalStatus: HormonalContext;
  inclusion?: string[];
  exclusion?: string[];
}

export interface Intervention {
  drug?: string;
  dosage?: string;
  route?: string;
  duration?: string;
  description: string;
}

export interface Comparator {
  description: string;
  drug?: string;
}

export interface Outcome {
  name: string;
  measure: string;
  result: string;
  significance?: string;
}

export interface AdverseEvent {
  name: string;
  frequency: string;
  severity: "mild" | "moderate" | "severe";
}

export interface OntologyLink {
  conceptId: string;
  label: string;
  kind: "hormone" | "drug" | "condition" | "biomarker" | "outcome";
}

export interface EvidenceObject {
  id: string;
  title: string;
  summary: string;
  type: EvidenceType;
  studyDesign: StudyDesign;
  status: EvidenceStatus;
  confidence: ConfidenceLevel;
  quality: EvidenceQuality;
  publication: Publication;
  population: Population;
  intervention: Intervention;
  comparator?: Comparator;
  outcomes: Outcome[];
  adverseEvents: AdverseEvent[];
  drug?: string;
  condition: string;
  hormonalContext: HormonalContext;
  tags: string[];
  limitations: string[];
  ontologyLinks: OntologyLink[];
}

export interface EvidenceMetric {
  id: string;
  label: string;
  value: string;
  hint?: string;
  icon: LucideIcon;
}

export interface EvidenceFilters {
  query: string;
  types: EvidenceType[];
  designs: StudyDesign[];
  years: [number, number] | null;
  hormonalContexts: HormonalContext[];
  countries: string[];
  journals: string[];
  drugs: string[];
  conditions: string[];
  confidences: ConfidenceLevel[];
  qualities: EvidenceQuality[];
  hasAdverseEvents: boolean | null;
}

export interface EvidenceCollection {
  id: string;
  name: string;
  count: number;
  updatedAt: string;
}
