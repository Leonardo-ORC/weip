/**
 * Processing Registry.
 *
 * Central catalog of every processing stage known to the platform. The
 * Pipeline Engine reads stages exclusively through this registry — never
 * from stage modules directly.
 *
 * Adding a new stage is a two-step operation:
 *   1. Author a `PipelineStageDefinition` under `../stages/`.
 *   2. Append it to `STAGES` below (and, when execution logic exists in
 *      a future sprint, register a `StageFactory` via `registerStage`).
 */

import type {
  PipelineStageCategory,
  PipelineStageDefinition,
  PipelineStageId,
  PipelineStatus,
} from "../types";
import type { StageFactory } from "../contracts/stage";
import { STAGE_DEFINITIONS } from "../stages/definitions";

export const STAGES: readonly PipelineStageDefinition[] = STAGE_DEFINITIONS;

const factories = new Map<PipelineStageId, StageFactory>();

export function registerStage(id: PipelineStageId, factory: StageFactory): void {
  factories.set(id, factory);
}

export function getStageFactory(id: PipelineStageId): StageFactory | undefined {
  return factories.get(id);
}

export function getAllStages(): readonly PipelineStageDefinition[] {
  return STAGES;
}

export function getStageById(id: PipelineStageId): PipelineStageDefinition | undefined {
  return STAGES.find((s) => s.id === id);
}

export function getStagesByCategory(
  category: PipelineStageCategory,
): readonly PipelineStageDefinition[] {
  return STAGES.filter((s) => s.category === category);
}

export function getStagesByStatus(status: PipelineStatus): readonly PipelineStageDefinition[] {
  return STAGES.filter((s) => s.status === status);
}

/**
 * Execution order derived from `order` + `dependsOn`. The engine consumes
 * this list to schedule stages; no work is performed here.
 */
export function getExecutionOrder(): readonly PipelineStageDefinition[] {
  return [...STAGES].sort((a, b) => a.order - b.order);
}

export function getStageDependencies(
  id: PipelineStageId,
): readonly PipelineStageDefinition[] {
  const stage = getStageById(id);
  if (!stage?.dependsOn) return [];
  return stage.dependsOn
    .map((depId) => getStageById(depId))
    .filter((s): s is PipelineStageDefinition => Boolean(s));
}
