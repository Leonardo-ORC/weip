/**
 * Stage contract — the common interface every processing stage must
 * implement to be registered with the Pipeline Engine.
 *
 * NOTE: `execute` is intentionally typed but NOT implemented anywhere in
 * this sprint. Concrete stages will be authored in future sprints.
 */

import type {
  PipelineStageDefinition,
  ProcessingContext,
  StageExecution,
} from "../types";

export interface StageInput<Payload = unknown> {
  readonly context: ProcessingContext;
  readonly payload: Payload;
}

export interface StageOutput<Payload = unknown> {
  readonly execution: StageExecution;
  readonly payload: Payload;
}

/**
 * Concrete stage implementations conform to this interface. The engine
 * consumes stages exclusively through this contract.
 */
export interface PipelineStage<Input = unknown, Output = unknown> {
  readonly definition: PipelineStageDefinition;
  execute(input: StageInput<Input>): Promise<StageOutput<Output>>;
}

/**
 * Factory shape used by the registry to lazily construct stages without
 * coupling the engine to any specific implementation.
 */
export type StageFactory = () => PipelineStage;
