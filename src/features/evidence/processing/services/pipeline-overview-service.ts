/**
 * Read-only selectors used by the visualization surface. Pure functions
 * over the registry — no state, no side effects.
 */

import type {
  PipelineStageDefinition,
  StageVisualState,
} from "../types";
import { getExecutionOrder } from "../registry";
import { PLATFORM_LAYERS, type PlatformLayer } from "../models";

export interface StageOverview {
  readonly stage: PipelineStageDefinition;
  readonly position: number;
  readonly total: number;
  readonly visualState: StageVisualState;
}

export function getPipelineOverview(): readonly StageOverview[] {
  const stages = getExecutionOrder();
  const total = stages.length;
  return stages.map((stage, idx) => ({
    stage,
    position: idx + 1,
    total,
    visualState: resolveVisualState(stage),
  }));
}

export function getPlatformLayers(): readonly PlatformLayer[] {
  return PLATFORM_LAYERS;
}

function resolveVisualState(stage: PipelineStageDefinition): StageVisualState {
  if (stage.status === "completed") return "active";
  if (stage.status === "running") return "current";
  return "coming-soon";
}
