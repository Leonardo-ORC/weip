// PubMed backend module. UI has been consolidated into the unified
// Scientific Sources Workspace at /app/sources. Only provider, pipeline,
// mappers, cache, services, and types are exported.
export * from "./types";
export * from "./services";
export {
  runIngestionPipeline,
  PIPELINE_STAGES,
  createInitialRun,
} from "./pipeline";
export type { PipelineExecutionResult } from "./pipeline";
