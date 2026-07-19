/**
 * Extraction Model Registry.
 *
 * Single source of truth for extraction models. The engine resolves
 * models exclusively through this registry — provider modules are never
 * imported directly by consumers.
 *
 * Adding a new model requires only:
 *   1. Author a `ExtractionModelDefinition` under `../engines/<id>.ts`.
 *   2. Append it to `EXTRACTION_MODEL_DEFINITIONS`.
 */

import type {
  ExtractionModelDefinition,
  ExtractionModelFactory,
} from "../contracts/extraction-model";
import type { ExtractionModelStatus, ExtractionProviderId } from "../types";
import { EXTRACTION_MODEL_DEFINITIONS } from "../engines";

export const EXTRACTION_MODELS: readonly ExtractionModelDefinition[] =
  EXTRACTION_MODEL_DEFINITIONS;

const factories = new Map<string, ExtractionModelFactory>();

export function registerExtractionModel(
  id: string,
  factory: ExtractionModelFactory,
): void {
  factories.set(id, factory);
}

export function getExtractionModelFactory(
  id: string,
): ExtractionModelFactory | undefined {
  return factories.get(id);
}

export function getAllExtractionModels(): readonly ExtractionModelDefinition[] {
  return EXTRACTION_MODELS;
}

export function getExtractionModelById(
  id: string,
): ExtractionModelDefinition | undefined {
  return EXTRACTION_MODELS.find((m) => m.id === id);
}

export function getExtractionModelsByProvider(
  provider: ExtractionProviderId,
): readonly ExtractionModelDefinition[] {
  return EXTRACTION_MODELS.filter((m) => m.provider === provider);
}

export function getExtractionModelsByStatus(
  status: ExtractionModelStatus,
): readonly ExtractionModelDefinition[] {
  return EXTRACTION_MODELS.filter((m) => m.status === status);
}
