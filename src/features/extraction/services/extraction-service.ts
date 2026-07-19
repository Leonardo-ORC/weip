/**
 * High-level EvidenceExtractionService.
 *
 * The single entry point external modules should use to run the entire
 * pipeline (deterministic + optional AI + validation + confidence +
 * traceability + EvidenceObject build) against one NormalizedRecord or
 * a batch.
 */

import type { EvidenceObject } from "@/features/evidence-explorer";
import type { NormalizedRecord } from "@/features/sources";
import type { EvidenceExtraction } from "../types";
import { EvidenceObjectBuilder } from "./evidence-object-builder";
import {
  EXTRACTION_ENGINE_VERSION,
  ExtractionOrchestrator,
  type OrchestratorOptions,
} from "./orchestrator";

export interface ExtractionResult {
  readonly record: NormalizedRecord;
  readonly extraction: EvidenceExtraction;
  readonly evidence: EvidenceObject;
}

export const EvidenceExtractionService = {
  version: EXTRACTION_ENGINE_VERSION,
  async extractOne(
    record: NormalizedRecord,
    options?: OrchestratorOptions,
  ): Promise<ExtractionResult> {
    const extraction = await ExtractionOrchestrator.extract(record, options);
    const evidence = EvidenceObjectBuilder.build(record, extraction);
    return { record, extraction, evidence };
  },
  async extractMany(
    records: readonly NormalizedRecord[],
    options?: OrchestratorOptions,
  ): Promise<readonly ExtractionResult[]> {
    const results: ExtractionResult[] = [];
    for (const record of records) {
      results.push(await this.extractOne(record, options));
    }
    return results;
  },
};

export type IEvidenceExtractionService = typeof EvidenceExtractionService;
