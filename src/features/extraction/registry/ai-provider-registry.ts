import type { AiExtractionProvider, AiProviderId, AiProviderMetadata } from "../types";

const providers = new Map<AiProviderId, AiExtractionProvider>();

const CATALOG: readonly AiProviderMetadata[] = [
  {
    id: "openai",
    name: "OpenAI",
    description: "GPT models via the OpenAI API — pluggable, opt-in.",
    status: "planned",
    capabilities: ["biomedical-entities", "womens-health", "study-attributes", "outcomes", "adverse-events"],
  },
  {
    id: "azure-openai",
    name: "Azure OpenAI",
    description: "Enterprise-grade OpenAI on Azure with regional isolation.",
    status: "planned",
    capabilities: ["biomedical-entities", "womens-health", "study-attributes", "outcomes"],
  },
  {
    id: "anthropic",
    name: "Anthropic Claude",
    description: "Long-context extraction via the Anthropic Messages API.",
    status: "planned",
    capabilities: ["biomedical-entities", "womens-health", "study-attributes"],
  },
  {
    id: "google-gemini",
    name: "Google Gemini",
    description: "Multimodal extraction via Google AI / Vertex.",
    status: "planned",
    capabilities: ["biomedical-entities", "study-attributes"],
  },
  {
    id: "local",
    name: "Local Models",
    description: "Self-hosted open-weights models (Llama, Mistral, Meditron).",
    status: "planned",
    capabilities: ["biomedical-entities", "study-attributes"],
  },
];

export const AiExtractionProviderRegistry = {
  register(provider: AiExtractionProvider): void {
    providers.set(provider.metadata.id, provider);
  },
  unregister(id: AiProviderId): void {
    providers.delete(id);
  },
  get(id: AiProviderId): AiExtractionProvider | undefined {
    return providers.get(id);
  },
  list(): readonly AiExtractionProvider[] {
    return Array.from(providers.values());
  },
  catalog(): readonly AiProviderMetadata[] {
    return CATALOG.map((meta) => ({
      ...meta,
      status: providers.has(meta.id) ? "available" : meta.status,
    }));
  },
};

export type IAiExtractionProviderRegistry = typeof AiExtractionProviderRegistry;
