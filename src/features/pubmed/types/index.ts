/**
 * PubMed integration — public type surface.
 * Strongly typed contracts for search, articles, pipeline and imports.
 */

export type PubMedSortOrder = "relevance" | "pub_date";

export interface PubMedSearchQuery {
  readonly term: string;
  readonly author?: string;
  readonly journal?: string;
  readonly yearFrom?: number;
  readonly yearTo?: number;
  readonly page: number;
  readonly pageSize: number;
  readonly sort: PubMedSortOrder;
}

export interface PubMedSearchPage {
  readonly ids: readonly string[];
  readonly total: number;
  readonly page: number;
  readonly pageSize: number;
  readonly sort: PubMedSortOrder;
  readonly query: PubMedSearchQuery;
  readonly translatedTerm?: string;
  readonly fetchedAt: string;
}

export interface PubMedAuthor {
  readonly name: string;
  readonly affiliation?: string;
}

export interface PubMedJournal {
  readonly title: string;
  readonly issn?: string;
  readonly volume?: string;
  readonly issue?: string;
}

export interface PubMedArticle {
  readonly id: string;
  readonly pmid: string;
  readonly doi?: string;
  readonly title: string;
  readonly abstract?: string;
  readonly authors: readonly PubMedAuthor[];
  readonly journal: PubMedJournal;
  readonly publicationDate: string;
  readonly publicationYear: number;
  readonly keywords: readonly string[];
  readonly meshTerms: readonly string[];
  readonly language: string;
  readonly articleType: string;
  readonly publicationTypes: readonly string[];
  readonly url: string;
  readonly source: "pubmed";
  readonly fetchedAt: string;
}

export type PipelineStageId =
  | "fetch"
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
  readonly errors: readonly PipelineError[];
  readonly startedAt: string;
  readonly finishedAt?: string;
}

export type PubMedErrorKind =
  | "network"
  | "timeout"
  | "rate-limit"
  | "not-found"
  | "invalid-response"
  | "unknown";

export interface PubMedError {
  readonly kind: PubMedErrorKind;
  readonly message: string;
  readonly retryable: boolean;
}

export interface PipelineError {
  readonly stage: PipelineStageId;
  readonly kind: PubMedErrorKind;
  readonly message: string;
}

export interface PubMedImportRecord {
  readonly id: string;
  readonly article: PubMedArticle;
  readonly importedAt: string;
}
