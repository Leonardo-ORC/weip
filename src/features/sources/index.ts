export * from "./types";
export { ScientificSourceRegistry } from "./registry";
export { ScientificProviderFactory } from "./factory";
export {
  UnifiedSearchClient,
  UnifiedFetchClient,
  UnifiedHealthClient,
  ProviderManager,
} from "./services";
export { ScientificImportStore } from "./store/import-store";
export { NormalizedEvidenceMapper } from "./mappers/normalized-to-evidence";
export {
  PIPELINE_STAGES,
  createInitialRun,
  runIngestionPipeline,
} from "./pipeline";
export type { PipelineExecutionResult, IngestionHandlers } from "./pipeline";

export { useUnifiedSearch, DEFAULT_UNIFIED_INPUTS } from "./hooks/use-unified-search";
export type {
  UnifiedSearchInputs,
  UseUnifiedSearchReturn,
} from "./hooks/use-unified-search";
export { useUnifiedIngestion } from "./hooks/use-unified-ingestion";
export { useUnifiedImports } from "./hooks/use-unified-imports";
export { useProviderHealth } from "./hooks/use-provider-health";

export { ProviderBadge } from "./components/ProviderBadge";
export { SourceSelector } from "./components/SourceSelector";
export { ScientificSearchBar } from "./components/ScientificSearchBar";
export { UnifiedSearchResults } from "./components/UnifiedSearchResults";
export { UnifiedPipelineStatus } from "./components/UnifiedPipelineStatus";
export {
  ProviderHealthIndicator,
  ProviderStatusPanel,
} from "./components/ProviderStatusPanel";
export { SourceStatistics } from "./components/SourceStatistics";
export { ScientificSourcesWorkspace } from "./components/ScientificSourcesWorkspace";
export { ScientificSourcesWidget } from "./components/ScientificSourcesWidget";
