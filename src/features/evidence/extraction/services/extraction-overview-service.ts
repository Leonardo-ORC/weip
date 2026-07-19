/**
 * Read-only selectors used by the extraction visualization surface. Pure
 * functions over the registries — no state, no side effects.
 */

import {
  EXTRACTION_FLOW_LAYERS,
  EXTRACTION_STAGES,
  type ExtractionFlowLayer,
  type ExtractionStageDefinition,
} from "../models";
import {
  getAllExtractionModels,
  getAllPromptDomains,
  getAllParsers,
  getAllValidators,
} from "../registry";
import type { ExtractionModelDefinition } from "../contracts/extraction-model";
import type { PromptDomainDefinition } from "../contracts/prompt";
import type { ParserDefinition } from "../contracts/parser";
import type { ValidatorDefinition } from "../contracts/validator";

export interface ExtractionStageOverview {
  readonly stage: ExtractionStageDefinition;
  readonly position: number;
  readonly total: number;
}

export function getExtractionFlowLayers(): readonly ExtractionFlowLayer[] {
  return EXTRACTION_FLOW_LAYERS;
}

export function getExtractionStageOverview(): readonly ExtractionStageOverview[] {
  const total = EXTRACTION_STAGES.length;
  return EXTRACTION_STAGES.map((stage, idx) => ({
    stage,
    position: idx + 1,
    total,
  }));
}

export function getExtractionCatalog(): {
  readonly models: readonly ExtractionModelDefinition[];
  readonly domains: readonly PromptDomainDefinition[];
  readonly parsers: readonly ParserDefinition[];
  readonly validators: readonly ValidatorDefinition[];
} {
  return {
    models: getAllExtractionModels(),
    domains: getAllPromptDomains(),
    parsers: getAllParsers(),
    validators: getAllValidators(),
  };
}
