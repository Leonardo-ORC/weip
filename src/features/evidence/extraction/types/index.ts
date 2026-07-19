/**
 * Evidence Extraction Engine — public type surface.
 *
 * Contracts only. No extraction executes in this sprint. Future sprints
 * plug concrete model providers, prompts, validators and parsers into
 * these shapes without touching the engine.
 */

// ─────────────────────────────────────────────────────────────────────────────
// Providers & lifecycle
// ─────────────────────────────────────────────────────────────────────────────

export type ExtractionProviderId =
  | "openai"
  | "anthropic"
  | "google-gemini"
  | "azure-openai"
  | "open-source";

export type ExtractionModelStatus =
  | "available"
  | "planned"
  | "experimental"
  | "deprecated"
  | "future";

export type ExtractionCapability =
  | "structured-output"
  | "long-context"
  | "function-calling"
  | "json-schema"
  | "citation-grounding"
  | "multilingual"
  | "reasoning"
  | "vision"
  | "self-hosted";

export type ExtractionInputFormat =
  | "text.plain"
  | "text.markdown"
  | "text.xml"
  | "text.html"
  | "chunks.deterministic"
  | "document.enriched";

export type ExtractionOutputFormat =
  | "json.structured"
  | "json.schema"
  | "markdown.evidence"
  | "xml.evidence";

// ─────────────────────────────────────────────────────────────────────────────
// Flow states
// ─────────────────────────────────────────────────────────────────────────────

export type ExtractionFlowState =
  | "locked"
  | "active"
  | "current"
  | "coming-soon";

export type ExtractionJobStatus =
  | "pending"
  | "running"
  | "completed"
  | "failed"
  | "skipped"
  | "cancelled";

// ─────────────────────────────────────────────────────────────────────────────
// Prompt domains
// ─────────────────────────────────────────────────────────────────────────────

export type PromptDomainId =
  | "women"
  | "hormones"
  | "pregnancy"
  | "clinical-trials"
  | "drug-safety"
  | "population"
  | "biomarkers"
  | "outcomes"
  | "evidence-quality";

export type PromptStatus = "draft" | "planned" | "future";

// ─────────────────────────────────────────────────────────────────────────────
// Validation
// ─────────────────────────────────────────────────────────────────────────────

export type ValidationKind =
  | "schema"
  | "required-fields"
  | "completeness"
  | "confidence"
  | "consistency";

export type ValidationSeverity = "info" | "warning" | "error";

// ─────────────────────────────────────────────────────────────────────────────
// Observability contracts (no implementation)
// ─────────────────────────────────────────────────────────────────────────────

export interface ExtractionMetrics {
  readonly startedAt?: string;
  readonly finishedAt?: string;
  readonly durationMs?: number;
  readonly promptTokens?: number;
  readonly completionTokens?: number;
  readonly retryCount?: number;
  readonly extractionConfidence?: number;
  readonly validationErrors?: number;
  readonly modelVersion?: string;
}

export interface ExtractionError {
  readonly kind:
    | "provider"
    | "prompt"
    | "parsing"
    | "validation"
    | "timeout"
    | "unknown";
  readonly code: string;
  readonly message: string;
  readonly modelId?: string;
  readonly cause?: unknown;
  readonly recoverable?: boolean;
}
