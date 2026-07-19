/**
 * Scientific Source Provider — generic contracts.
 *
 * Every scientific integration (PubMed, ClinicalTrials.gov, OpenAlex, …)
 * implements the same interface and returns the same normalized shape.
 * UI, pipeline and services never depend on a specific provider.
 */

export type SourceId = "pubmed" | "clinicaltrials" | "openalex";

export type JsonValue =
  | string
  | number
  | boolean
  | null
  | readonly JsonValue[]
  | { readonly [key: string]: JsonValue };

export type SourceStudyType =
  | "article"
  | "clinical-trial"
  | "systematic-review"
  | "meta-analysis"
  | "guideline"
  | "preprint"
  | "case-report"
  | "unknown";

export interface UnifiedSearchQuery {
  readonly term: string;
  readonly author?: string;
  readonly journal?: string;
  readonly condition?: string;
  readonly drug?: string;
  readonly disease?: string;
  readonly yearFrom?: number;
  readonly yearTo?: number;
  readonly sources?: readonly SourceId[];
  readonly page: number;
  readonly pageSize: number;
  readonly sort: "relevance" | "date" | "citations";
}

export interface NormalizedRecord {
  readonly source: SourceId;
  readonly externalId: string;
  readonly title: string;
  readonly abstract: string | null;
  readonly authors: readonly string[];
  readonly journal: string | null;
  readonly publication: string | null;
  readonly publicationDate: string | null;
  readonly publicationYear: number | null;
  readonly studyType: SourceStudyType;
  readonly keywords: readonly string[];
  readonly language: string | null;
  readonly url: string | null;
  readonly doi: string | null;
  readonly status: string | null;
  readonly citationCount: number | null;
  readonly providerMetadata: { readonly [key: string]: JsonValue };
}

export interface SourceSearchPage {
  readonly source: SourceId;
  readonly total: number;
  readonly page: number;
  readonly pageSize: number;
  readonly records: readonly NormalizedRecord[];
  readonly fetchedAt: string;
  readonly error?: SourceProviderError;
}

export interface UnifiedSearchResult {
  readonly query: UnifiedSearchQuery;
  readonly pages: readonly SourceSearchPage[];
  readonly records: readonly NormalizedRecord[];
  readonly total: number;
  readonly fetchedAt: string;
}

export type SourceProviderErrorKind =
  | "network"
  | "timeout"
  | "rate-limit"
  | "not-found"
  | "invalid-response"
  | "unauthorized"
  | "unknown";

export interface SourceProviderError {
  readonly source: SourceId;
  readonly kind: SourceProviderErrorKind;
  readonly message: string;
  readonly retryable: boolean;
}

export interface SourceHealthReport {
  readonly source: SourceId;
  readonly status: "connected" | "degraded" | "disconnected" | "unknown";
  readonly responseTimeMs: number | null;
  readonly checkedAt: string;
  readonly message?: string;
}

export interface ProviderMetadata {
  readonly id: SourceId;
  readonly name: string;
  readonly shortName: string;
  readonly description: string;
  readonly homepage: string;
  readonly apiReference: string;
  readonly badgeAccent: "indigo" | "teal" | "amber";
  readonly capabilities: readonly string[];
}

export interface SourceRecordRef {
  readonly source: SourceId;
  readonly externalId: string;
}

/**
 * The core provider contract. Every provider MUST implement it exactly.
 */
export interface ScientificSourceProvider {
  readonly metadata: ProviderMetadata;
  search(query: UnifiedSearchQuery): Promise<SourceSearchPage>;
  fetchById(externalId: string): Promise<NormalizedRecord | null>;
  /**
   * Providers are already normalized at ingestion; the hook is kept so
   * downstream stages can enrich or coerce shape without asking the
   * provider to re-hit the network.
   */
  normalize(record: NormalizedRecord): NormalizedRecord;
  healthCheck(): Promise<SourceHealthReport>;
  providerMetadata(): ProviderMetadata;
}

// ─── Pipeline ────────────────────────────────────────────────────────────────

export type PipelineStageId =
  | "search"
  | "validate"
  | "normalize"
  | "transform"
  | "store"
  | "expose";

export type PipelineStageStatus =
  | "idle"
  | "running"
  | "completed"
  | "failed"
  | "skipped";

export interface PipelineStageState {
  readonly id: PipelineStageId;
  readonly label: string;
  readonly description: string;
  readonly status: PipelineStageStatus;
  readonly startedAt?: string;
  readonly finishedAt?: string;
  readonly durationMs?: number;
  readonly count?: number;
  readonly message?: string;
}

export interface PipelineRunState {
  readonly runId: string;
  readonly status: PipelineStageStatus;
  readonly stages: readonly PipelineStageState[];
  readonly errors: readonly {
    readonly stage: PipelineStageId;
    readonly source?: SourceId;
    readonly message: string;
  }[];
  readonly startedAt: string;
  readonly finishedAt?: string;
  readonly perSource: Readonly<Record<SourceId, number>>;
}

export interface ImportRecord {
  readonly id: string;
  readonly source: SourceId;
  readonly record: NormalizedRecord;
  readonly importedAt: string;
}
