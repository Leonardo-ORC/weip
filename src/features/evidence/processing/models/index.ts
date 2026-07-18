/**
 * Processing models — labels, presentation metadata, visual state maps.
 * Pure data. No behaviour.
 */

import type {
  PipelineStageCategory,
  PipelineStageId,
  PipelineStatus,
  ProcessingErrorKind,
  StageVisualState,
} from "../types";

export const PIPELINE_STAGE_ORDER: readonly PipelineStageId[] = [
  "receive",
  "validate",
  "normalize",
  "clean",
  "enrich",
  "chunk",
  "extract",
  "store",
];

export const PIPELINE_STAGE_CATEGORY_LABELS: Record<PipelineStageCategory, string> = {
  ingestion: "Ingestion",
  quality: "Quality",
  normalization: "Normalization",
  enrichment: "Enrichment",
  segmentation: "Segmentation",
  extraction: "Extraction",
  persistence: "Persistence",
};

export const PIPELINE_STATUS_LABELS: Record<PipelineStatus, string> = {
  pending: "Pending",
  running: "Running",
  completed: "Completed",
  failed: "Failed",
  skipped: "Skipped",
  cancelled: "Cancelled",
};

export const STAGE_VISUAL_STATE_LABELS: Record<StageVisualState, string> = {
  locked: "Locked",
  active: "Active",
  current: "Current sprint",
  "coming-soon": "Coming soon",
};

export const PROCESSING_ERROR_KIND_LABELS: Record<ProcessingErrorKind, string> = {
  validation: "Validation error",
  processing: "Processing error",
  provider: "Provider error",
  parsing: "Parsing error",
  unknown: "Unknown error",
};

/**
 * The macro-architecture surrounding this sprint. Only the processing
 * layer is "current" — surrounding layers appear as future work.
 */
export type PlatformLayerId =
  | "sources"
  | "processing"
  | "extraction"
  | "evidence"
  | "intelligence";

export interface PlatformLayer {
  readonly id: PlatformLayerId;
  readonly name: string;
  readonly description: string;
  readonly state: StageVisualState;
}

export const PLATFORM_LAYERS: readonly PlatformLayer[] = [
  {
    id: "sources",
    name: "Scientific Sources",
    description:
      "Provider catalog — PubMed, ClinicalTrials.gov, openFDA and beyond.",
    state: "active",
  },
  {
    id: "processing",
    name: "Processing Pipeline",
    description:
      "Deterministic framework that receives, validates, normalizes and segments raw evidence.",
    state: "current",
  },
  {
    id: "extraction",
    name: "AI Extraction",
    description:
      "Future layer where language models turn deterministic chunks into structured claims.",
    state: "coming-soon",
  },
  {
    id: "evidence",
    name: "Evidence Objects",
    description:
      "Canonical, citable evidence records with full provenance and lineage.",
    state: "locked",
  },
  {
    id: "intelligence",
    name: "Clinical Intelligence",
    description:
      "Reasoning, ranking and gap discovery layered on the evidence graph.",
    state: "locked",
  },
];
