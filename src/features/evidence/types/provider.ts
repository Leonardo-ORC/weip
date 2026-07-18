/**
 * Evidence Source contracts.
 *
 * Every scientific provider integrated into WEIP MUST expose a
 * `ProviderDefinition` conforming to these interfaces. The platform
 * consumes providers exclusively through this contract — never through
 * provider-specific implementations.
 */

export type ProviderStatus =
  | "available"
  | "planned"
  | "experimental"
  | "deprecated"
  | "future";

export type ProviderCategory =
  | "scientific-literature"
  | "clinical-trials"
  | "drug-safety"
  | "drug-labels"
  | "bibliographic-knowledge"
  | "future-sources";

export type ProviderAvailability = "public" | "authenticated" | "restricted" | "unknown";

export type SupportedContentType =
  | "abstracts"
  | "full-text"
  | "clinical-trials"
  | "adverse-events"
  | "drug-labels"
  | "citations"
  | "metadata"
  | "structured-outcomes"
  | "regulatory-documents";

export type RefreshStrategy = "realtime" | "daily" | "weekly" | "monthly" | "on-demand" | "static";

export interface ProviderCoverage {
  readonly documents?: string;
  readonly startYear?: number;
  readonly geography?: string;
  readonly languages?: readonly string[];
}

export interface ProviderDocumentation {
  readonly homepage?: string;
  readonly apiReference?: string;
  readonly termsOfUse?: string;
}

export interface ProviderFutureCapability {
  readonly title: string;
  readonly description: string;
}

export interface ProviderDefinition {
  readonly id: string;
  readonly name: string;
  readonly shortName?: string;
  readonly description: string;
  readonly category: ProviderCategory;
  readonly status: ProviderStatus;
  readonly availability: ProviderAvailability;
  readonly documentation: ProviderDocumentation;
  readonly supportedContent: readonly SupportedContentType[];
  readonly refreshStrategy: RefreshStrategy;
  readonly coverage?: ProviderCoverage;
  readonly futureCapabilities?: readonly ProviderFutureCapability[];
  readonly tags?: readonly string[];
}
