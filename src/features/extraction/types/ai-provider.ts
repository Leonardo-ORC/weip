/**
 * Pluggable AI Extraction Provider contract.
 *
 * The engine ships without any bound provider. Implementations are
 * registered through the AiExtractionProviderRegistry. Deterministic
 * extraction always runs; AI extraction is opt-in and augments the
 * result of the deterministic pass.
 */

import type {
  BiomedicalEntitySet,
  StudyAttributes,
  WomensHealthConceptSet,
} from "./extraction";

export type AiProviderId =
  | "openai"
  | "azure-openai"
  | "anthropic"
  | "google-gemini"
  | "local";

export interface AiProviderMetadata {
  readonly id: AiProviderId;
  readonly name: string;
  readonly description: string;
  readonly status: "planned" | "beta" | "available";
  readonly capabilities: readonly (
    | "biomedical-entities"
    | "womens-health"
    | "study-attributes"
    | "outcomes"
    | "adverse-events"
  )[];
}

export interface AiExtractionInput {
  readonly title: string;
  readonly abstract: string | null;
  readonly keywords: readonly string[];
}

export interface AiExtractionOutput {
  readonly entities?: BiomedicalEntitySet;
  readonly womensHealth?: WomensHealthConceptSet;
  readonly study?: Partial<StudyAttributes>;
}

export interface AiExtractionProvider {
  readonly metadata: AiProviderMetadata;
  extract(input: AiExtractionInput): Promise<AiExtractionOutput>;
}
