/**
 * Conceptual stage definitions.
 *
 * These describe the shape and order of the processing pipeline without
 * implementing any execution logic. Future sprints will attach concrete
 * `PipelineStage` implementations bound to these definitions.
 */

import type { PipelineStageDefinition } from "../types";

export const RECEIVE_STAGE: PipelineStageDefinition = {
  id: "receive",
  name: "Receive",
  description:
    "Accept raw payloads emitted by scientific source providers. Establishes a stable envelope around every incoming document.",
  category: "ingestion",
  inputType: "provider.payload.raw",
  outputType: "envelope.raw",
  status: "pending",
  order: 1,
  tags: ["ingestion", "envelope"],
};

export const VALIDATE_STAGE: PipelineStageDefinition = {
  id: "validate",
  name: "Validate",
  description:
    "Verify the envelope conforms to the provider contract — required fields, identifiers, checksum, license.",
  category: "quality",
  inputType: "envelope.raw",
  outputType: "envelope.validated",
  status: "pending",
  order: 2,
  dependsOn: ["receive"],
  tags: ["contract", "integrity"],
};

export const NORMALIZE_STAGE: PipelineStageDefinition = {
  id: "normalize",
  name: "Normalize",
  description:
    "Project provider-specific fields onto a common document schema — canonical identifiers, dates, authorship, source URIs.",
  category: "normalization",
  inputType: "envelope.validated",
  outputType: "document.normalized",
  status: "pending",
  order: 3,
  dependsOn: ["validate"],
  tags: ["schema", "canonicalization"],
};

export const CLEAN_STAGE: PipelineStageDefinition = {
  id: "clean",
  name: "Clean",
  description:
    "Strip boilerplate, decode encoding artefacts, unify whitespace, drop duplicated content and normalize typography.",
  category: "quality",
  inputType: "document.normalized",
  outputType: "document.clean",
  status: "pending",
  order: 4,
  dependsOn: ["normalize"],
  tags: ["hygiene"],
};

export const ENRICH_STAGE: PipelineStageDefinition = {
  id: "enrich",
  name: "Enrich",
  description:
    "Attach lightweight metadata — language, section detection, structural hints, provenance graph — without invoking AI.",
  category: "enrichment",
  inputType: "document.clean",
  outputType: "document.enriched",
  status: "pending",
  order: 5,
  dependsOn: ["clean"],
  optional: true,
  tags: ["metadata", "structure"],
};

export const CHUNK_STAGE: PipelineStageDefinition = {
  id: "chunk",
  name: "Chunk",
  description:
    "Segment enriched documents into deterministic units of evidence, preserving section, paragraph and citation boundaries.",
  category: "segmentation",
  inputType: "document.enriched",
  outputType: "chunks.deterministic",
  status: "pending",
  order: 6,
  dependsOn: ["enrich"],
  tags: ["segmentation", "boundaries"],
};

export const EXTRACT_STAGE: PipelineStageDefinition = {
  id: "extract",
  name: "Extract",
  description:
    "Handoff seam where downstream AI extraction consumes deterministic chunks. This stage produces the extraction request contract only.",
  category: "extraction",
  inputType: "chunks.deterministic",
  outputType: "extraction.request",
  status: "pending",
  order: 7,
  dependsOn: ["chunk"],
  tags: ["handoff", "ai-boundary"],
  futureConfiguration: [
    {
      key: "extractor",
      label: "Extractor",
      description: "Named extractor implementation attached to this stage.",
    },
  ],
};

export const STORE_STAGE: PipelineStageDefinition = {
  id: "store",
  name: "Store",
  description:
    "Persist deterministic processing artefacts with full lineage. Downstream systems query only from this stage's outputs.",
  category: "persistence",
  inputType: "extraction.request",
  outputType: "artefact.persisted",
  status: "pending",
  order: 8,
  dependsOn: ["extract"],
  tags: ["lineage", "persistence"],
};

export const STAGE_DEFINITIONS: readonly PipelineStageDefinition[] = Object.freeze([
  RECEIVE_STAGE,
  VALIDATE_STAGE,
  NORMALIZE_STAGE,
  CLEAN_STAGE,
  ENRICH_STAGE,
  CHUNK_STAGE,
  EXTRACT_STAGE,
  STORE_STAGE,
]);
