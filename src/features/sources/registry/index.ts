/**
 * ScientificSourceRegistry.
 *
 * Central directory of every ScientificSourceProvider registered in the
 * platform. Adding a new provider is a two-step operation:
 *
 *   1. Implement `ScientificSourceProvider` in `../providers/<id>-source.ts`.
 *   2. Register it here.
 *
 * Every downstream consumer (services, pipeline, UI) reads from the
 * registry — never from the provider modules directly.
 */

import { ClinicalTrialsSource } from "../providers/clinicaltrials-source";
import { OpenAlexSource } from "../providers/openalex-source";
import { PubMedSource } from "../providers/pubmed-source";
import type {
  ProviderMetadata,
  ScientificSourceProvider,
  SourceId,
} from "../types";

const PROVIDERS: readonly ScientificSourceProvider[] = Object.freeze([
  PubMedSource,
  ClinicalTrialsSource,
  OpenAlexSource,
]);

const BY_ID = new Map<SourceId, ScientificSourceProvider>(
  PROVIDERS.map((p) => [p.metadata.id, p]),
);

export const ScientificSourceRegistry = {
  all(): readonly ScientificSourceProvider[] {
    return PROVIDERS;
  },
  ids(): readonly SourceId[] {
    return PROVIDERS.map((p) => p.metadata.id);
  },
  get(id: SourceId): ScientificSourceProvider | undefined {
    return BY_ID.get(id);
  },
  metadata(): readonly ProviderMetadata[] {
    return PROVIDERS.map((p) => p.metadata);
  },
  metadataFor(id: SourceId): ProviderMetadata | undefined {
    return BY_ID.get(id)?.metadata;
  },
} as const;

export type IScientificSourceRegistry = typeof ScientificSourceRegistry;
