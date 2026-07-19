/**
 * Extraction models — labels, presentation metadata, macro-layers.
 * Pure data. No behaviour.
 */

import type {
  ExtractionCapability,
  ExtractionFlowState,
  ExtractionInputFormat,
  ExtractionJobStatus,
  ExtractionModelStatus,
  ExtractionOutputFormat,
  ExtractionProviderId,
  PromptDomainId,
  PromptStatus,
  ValidationKind,
  ValidationSeverity,
} from "../types";

export * from "./evidence-object";

export const EXTRACTION_PROVIDER_LABELS: Record<ExtractionProviderId, string> = {
  openai: "OpenAI",
  anthropic: "Anthropic",
  "google-gemini": "Google Gemini",
  "azure-openai": "Azure OpenAI",
  "open-source": "Open Source",
};

export const EXTRACTION_MODEL_STATUS_LABELS: Record<ExtractionModelStatus, string> = {
  available: "Available",
  planned: "Planned",
  experimental: "Experimental",
  deprecated: "Deprecated",
  future: "Future",
};

export const EXTRACTION_CAPABILITY_LABELS: Record<ExtractionCapability, string> = {
  "structured-output": "Structured output",
  "long-context": "Long context",
  "function-calling": "Function calling",
  "json-schema": "JSON schema",
  "citation-grounding": "Citation grounding",
  multilingual: "Multilingual",
  reasoning: "Reasoning",
  vision: "Vision",
  "self-hosted": "Self-hosted",
};

export const EXTRACTION_INPUT_LABELS: Record<ExtractionInputFormat, string> = {
  "text.plain": "Plain text",
  "text.markdown": "Markdown",
  "text.xml": "XML",
  "text.html": "HTML",
  "chunks.deterministic": "Deterministic chunks",
  "document.enriched": "Enriched document",
};

export const EXTRACTION_OUTPUT_LABELS: Record<ExtractionOutputFormat, string> = {
  "json.structured": "Structured JSON",
  "json.schema": "JSON Schema",
  "markdown.evidence": "Markdown evidence",
  "xml.evidence": "XML evidence",
};

export const EXTRACTION_JOB_STATUS_LABELS: Record<ExtractionJobStatus, string> = {
  pending: "Pending",
  running: "Running",
  completed: "Completed",
  failed: "Failed",
  skipped: "Skipped",
  cancelled: "Cancelled",
};

export const EXTRACTION_FLOW_STATE_LABELS: Record<ExtractionFlowState, string> = {
  locked: "Locked",
  active: "Active",
  current: "Current sprint",
  "coming-soon": "Coming soon",
};

export const PROMPT_DOMAIN_LABELS: Record<PromptDomainId, string> = {
  women: "Women",
  hormones: "Hormones",
  pregnancy: "Pregnancy",
  "clinical-trials": "Clinical Trials",
  "drug-safety": "Drug Safety",
  population: "Population",
  biomarkers: "Biomarkers",
  outcomes: "Outcomes",
  "evidence-quality": "Evidence Quality",
};

export const PROMPT_STATUS_LABELS: Record<PromptStatus, string> = {
  draft: "Draft",
  planned: "Planned",
  future: "Future",
};

export const VALIDATION_KIND_LABELS: Record<ValidationKind, string> = {
  schema: "Schema validation",
  "required-fields": "Required fields",
  completeness: "Evidence completeness",
  confidence: "Confidence validation",
  consistency: "Consistency validation",
};

export const VALIDATION_SEVERITY_LABELS: Record<ValidationSeverity, string> = {
  info: "Info",
  warning: "Warning",
  error: "Error",
};

// ─────────────────────────────────────────────────────────────────────────────
// Extraction macro-flow (page visualization)
// ─────────────────────────────────────────────────────────────────────────────

export type ExtractionFlowLayerId =
  | "content"
  | "extraction"
  | "evidence"
  | "intelligence";

export interface ExtractionFlowLayer {
  readonly id: ExtractionFlowLayerId;
  readonly name: string;
  readonly description: string;
  readonly state: ExtractionFlowState;
}

export const EXTRACTION_FLOW_LAYERS: readonly ExtractionFlowLayer[] = [
  {
    id: "content",
    name: "Scientific Content",
    description:
      "Deterministic chunks emitted by the Processing Pipeline — text, structure and provenance.",
    state: "active",
  },
  {
    id: "extraction",
    name: "Extraction Models",
    description:
      "Pluggable extraction providers project scientific content onto Evidence Objects.",
    state: "current",
  },
  {
    id: "evidence",
    name: "Evidence Objects",
    description:
      "Structured, citable evidence with population, intervention, outcomes and quality indicators.",
    state: "coming-soon",
  },
  {
    id: "intelligence",
    name: "Future Intelligence",
    description:
      "Reasoning, synthesis and gap discovery over the evidence graph — later sprints.",
    state: "locked",
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// Extraction pipeline stages (inside the extraction layer itself)
// ─────────────────────────────────────────────────────────────────────────────

export type ExtractionStageId =
  | "prepare"
  | "prompt"
  | "invoke"
  | "parse"
  | "validate"
  | "emit";

export interface ExtractionStageDefinition {
  readonly id: ExtractionStageId;
  readonly name: string;
  readonly description: string;
  readonly inputType: string;
  readonly outputType: string;
  readonly state: ExtractionFlowState;
  readonly order: number;
}

export const EXTRACTION_STAGES: readonly ExtractionStageDefinition[] = [
  {
    id: "prepare",
    name: "Prepare",
    description:
      "Select deterministic chunks and enrich the extraction request with provider provenance.",
    inputType: "chunks.deterministic",
    outputType: "extraction.request",
    state: "current",
    order: 1,
  },
  {
    id: "prompt",
    name: "Prompt",
    description:
      "Resolve the domain-specific prompt from the library and bind it to the request.",
    inputType: "extraction.request",
    outputType: "prompt.bound",
    state: "current",
    order: 2,
  },
  {
    id: "invoke",
    name: "Invoke",
    description:
      "Delegate to a registered extraction model behind a provider-independent contract.",
    inputType: "prompt.bound",
    outputType: "model.response",
    state: "coming-soon",
    order: 3,
  },
  {
    id: "parse",
    name: "Parse",
    description:
      "Project the raw model response onto the Evidence Object schema through a format parser.",
    inputType: "model.response",
    outputType: "evidence.candidate",
    state: "coming-soon",
    order: 4,
  },
  {
    id: "validate",
    name: "Validate",
    description:
      "Run schema, required-field, completeness, confidence and consistency validators.",
    inputType: "evidence.candidate",
    outputType: "evidence.validated",
    state: "coming-soon",
    order: 5,
  },
  {
    id: "emit",
    name: "Emit",
    description:
      "Publish the validated Evidence Object with full lineage for downstream intelligence layers.",
    inputType: "evidence.validated",
    outputType: "evidence.object",
    state: "locked",
    order: 6,
  },
];
