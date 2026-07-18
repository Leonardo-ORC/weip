/**
 * processing — public module surface.
 *
 * The Evidence Processing Framework. Ships contracts, registry, engine
 * skeleton and visualization primitives only. No stage executes work in
 * this sprint.
 */

export * from "./types";
export * from "./contracts/stage";
export * from "./models";
export * from "./stages/definitions";
export * from "./registry";
export * from "./pipeline/engine";
export * from "./queue";
export * from "./services/pipeline-overview-service";
export * from "./hooks/use-pipeline-overview";
export * from "./utils/format";

export { PipelineCanvas } from "./components/PipelineCanvas";
export { PipelineStageCard } from "./components/PipelineStageCard";
export { PipelineConnector } from "./components/PipelineConnector";
export { PipelineLegend } from "./components/PipelineLegend";
export { PipelineStatusBadge } from "./components/PipelineStatusBadge";
export { PipelineOverview } from "./components/PipelineOverview";
