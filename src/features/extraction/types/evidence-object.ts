/**
 * EvidenceObject (canonical, extraction-aware).
 *
 * Extends the base EvidenceObject shape consumed by the Evidence Workspace
 * with the structured output of the Evidence Extraction Engine:
 * biomedical entities, women's health concepts, study attributes,
 * confidence, traceability and validation.
 *
 * The base shape remains fully backward-compatible; `extraction` is
 * optional so any code that ignores it continues to work.
 */

import type {
  BiomedicalEntitySet,
  ConfidenceReport,
  EvidenceExtractionMetadata,
  StudyAttributes,
  TraceabilityMap,
  ValidationReport,
  WomensHealthConceptSet,
} from "./extraction";

export interface EvidenceExtraction {
  readonly entities: BiomedicalEntitySet;
  readonly womensHealth: WomensHealthConceptSet;
  readonly study: StudyAttributes;
  readonly confidence: ConfidenceReport;
  readonly traceability: TraceabilityMap;
  readonly validation: ValidationReport;
  readonly metadata: EvidenceExtractionMetadata;
}
