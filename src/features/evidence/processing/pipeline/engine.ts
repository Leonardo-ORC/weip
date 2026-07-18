/**
 * Pipeline Engine.
 *
 * Reusable orchestrator for processing stages. The engine is intentionally
 * execution-free in this sprint — it exposes the shape of orchestration
 * (plan, describe, validate) so future stages can plug in without
 * modifying this file.
 *
 * Design invariants:
 *   • The engine knows nothing about specific stages or providers.
 *   • Stages are resolved exclusively through the registry.
 *   • Dependencies are honoured; unmet dependencies produce a plan error.
 */

import type {
  PipelineMetadata,
  PipelineStageDefinition,
  PipelineStageId,
  ProcessingContext,
  ProcessingError,
} from "../types";
import {
  getAllStages,
  getExecutionOrder,
  getStageById,
} from "../registry";

export interface PipelinePlanEntry {
  readonly stage: PipelineStageDefinition;
  readonly position: number;
  readonly blocked: boolean;
  readonly missingDependencies: readonly PipelineStageId[];
}

export interface PipelinePlan {
  readonly metadata: PipelineMetadata;
  readonly entries: readonly PipelinePlanEntry[];
  readonly errors: readonly ProcessingError[];
}

export interface PipelineEngineOptions {
  readonly metadata: PipelineMetadata;
  readonly stages?: readonly PipelineStageId[];
}

export class PipelineEngine {
  private readonly metadata: PipelineMetadata;
  private readonly stageIds: readonly PipelineStageId[];

  constructor(options: PipelineEngineOptions) {
    this.metadata = options.metadata;
    this.stageIds =
      options.stages ?? getExecutionOrder().map((stage) => stage.id);
  }

  /**
   * Resolve the stage list into a fully described plan. Reports missing
   * or unmet dependencies as errors without throwing.
   */
  plan(): PipelinePlan {
    const errors: ProcessingError[] = [];
    const resolved: PipelineStageDefinition[] = [];

    for (const id of this.stageIds) {
      const stage = getStageById(id);
      if (!stage) {
        errors.push({
          kind: "validation",
          code: "STAGE_NOT_FOUND",
          message: `Stage "${id}" is not registered.`,
        });
        continue;
      }
      resolved.push(stage);
    }

    const seen = new Set<PipelineStageId>();
    const entries: PipelinePlanEntry[] = resolved.map((stage, index) => {
      const missing = (stage.dependsOn ?? []).filter((dep) => !seen.has(dep));
      seen.add(stage.id);
      return {
        stage,
        position: index + 1,
        blocked: missing.length > 0,
        missingDependencies: missing,
      };
    });

    for (const entry of entries) {
      if (entry.blocked) {
        errors.push({
          kind: "validation",
          code: "UNMET_DEPENDENCY",
          message: `Stage "${entry.stage.id}" is missing dependencies: ${entry.missingDependencies.join(", ")}.`,
          stageId: entry.stage.id,
        });
      }
    }

    return { metadata: this.metadata, entries, errors };
  }

  describe(): PipelineMetadata {
    return this.metadata;
  }

  /**
   * Reserved for future sprints. Executing a job requires concrete stage
   * implementations bound through `registerStage`. Left unimplemented on
   * purpose — this sprint delivers the architecture, not the runtime.
   */
  async run(_context: ProcessingContext): Promise<never> {
    throw new Error(
      "PipelineEngine.run() is not implemented — this sprint delivers the architecture only.",
    );
  }
}

export function createDefaultEngine(metadata: PipelineMetadata): PipelineEngine {
  return new PipelineEngine({
    metadata,
    stages: getAllStages().map((stage) => stage.id),
  });
}
