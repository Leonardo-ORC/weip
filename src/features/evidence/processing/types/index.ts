/**
 * Evidence Processing Framework — public type surface.
 *
 * Types are contracts only. Nothing here executes work. Future sprints
 * plug ingestion, extraction and storage logic into these shapes without
 * changing the framework.
 */

// ─────────────────────────────────────────────────────────────────────────────
// Stage identity
// ─────────────────────────────────────────────────────────────────────────────

export type PipelineStageId =
  | "receive"
  | "validate"
  | "normalize"
  | "clean"
  | "enrich"
  | "chunk"
  | "extract"
  | "store";

export type PipelineStageCategory =
  | "ingestion"
  | "quality"
  | "normalization"
  | "enrichment"
  | "segmentation"
  | "extraction"
  | "persistence";

// ─────────────────────────────────────────────────────────────────────────────
// Lifecycle
// ─────────────────────────────────────────────────────────────────────────────

export type PipelineStatus =
  | "pending"
  | "running"
  | "completed"
  | "failed"
  | "skipped"
  | "cancelled";

export type StageVisualState = "locked" | "active" | "current" | "coming-soon";

// ─────────────────────────────────────────────────────────────────────────────
// Error model
// ─────────────────────────────────────────────────────────────────────────────

export type ProcessingErrorKind =
  | "validation"
  | "processing"
  | "provider"
  | "parsing"
  | "unknown";

export interface ProcessingError {
  readonly kind: ProcessingErrorKind;
  readonly code: string;
  readonly message: string;
  readonly stageId?: PipelineStageId;
  readonly cause?: unknown;
  readonly recoverable?: boolean;
}

export interface ProcessingWarning {
  readonly code: string;
  readonly message: string;
  readonly stageId?: PipelineStageId;
}

// ─────────────────────────────────────────────────────────────────────────────
// Observability contracts (no implementation)
// ─────────────────────────────────────────────────────────────────────────────

export interface ProcessingMetrics {
  readonly startedAt?: string;
  readonly finishedAt?: string;
  readonly durationMs?: number;
  readonly inputBytes?: number;
  readonly outputBytes?: number;
  readonly recordsIn?: number;
  readonly recordsOut?: number;
  readonly retryCount?: number;
}

export interface ProcessingHistoryEntry {
  readonly at: string;
  readonly stageId: PipelineStageId;
  readonly status: PipelineStatus;
  readonly message?: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// Stage contract
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Every processing stage MUST conform to this shape. `InputType` /
 * `OutputType` are string tags describing the payload contract — actual
 * runtime typing is deferred to future implementations.
 */
export interface PipelineStageDefinition<
  InputType extends string = string,
  OutputType extends string = string,
> {
  readonly id: PipelineStageId;
  readonly name: string;
  readonly description: string;
  readonly category: PipelineStageCategory;
  readonly inputType: InputType;
  readonly outputType: OutputType;
  readonly status: PipelineStatus;
  readonly order: number;
  readonly dependsOn?: readonly PipelineStageId[];
  readonly optional?: boolean;
  readonly futureConfiguration?: readonly StageConfigurationHint[];
  readonly tags?: readonly string[];
}

export interface StageConfigurationHint {
  readonly key: string;
  readonly label: string;
  readonly description: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// Runtime models (contracts only)
// ─────────────────────────────────────────────────────────────────────────────

export interface PipelineMetadata {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly version: string;
  readonly createdAt: string;
}

export interface ProcessingContext {
  readonly jobId: string;
  readonly providerId?: string;
  readonly correlationId?: string;
  readonly locale?: string;
  readonly initiatedBy?: string;
  readonly startedAt: string;
  readonly metadata?: Readonly<Record<string, string>>;
}

export interface ProcessingJob {
  readonly id: string;
  readonly providerId?: string;
  readonly pipelineId: string;
  readonly status: PipelineStatus;
  readonly context: ProcessingContext;
  readonly stages: readonly StageExecution[];
  readonly metrics?: ProcessingMetrics;
  readonly history?: readonly ProcessingHistoryEntry[];
  readonly errors?: readonly ProcessingError[];
  readonly warnings?: readonly ProcessingWarning[];
}

export interface StageExecution {
  readonly stageId: PipelineStageId;
  readonly status: PipelineStatus;
  readonly metrics?: ProcessingMetrics;
  readonly error?: ProcessingError;
}

export interface PipelineResult {
  readonly jobId: string;
  readonly status: PipelineStatus;
  readonly stages: readonly StageExecution[];
  readonly metrics?: ProcessingMetrics;
  readonly errors?: readonly ProcessingError[];
  readonly warnings?: readonly ProcessingWarning[];
}
