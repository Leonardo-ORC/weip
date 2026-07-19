import type { ExtractionModelDefinition } from "../contracts/extraction-model";

export const ANTHROPIC_MODEL: ExtractionModelDefinition = {
  id: "anthropic.claude",
  name: "Anthropic Claude",
  provider: "anthropic",
  version: "n/a",
  description:
    "Long-context, citation-friendly extraction through the Anthropic Messages API. Adapter loaded by the model registry.",
  status: "planned",
  supportedCapabilities: [
    "structured-output",
    "long-context",
    "citation-grounding",
    "reasoning",
    "multilingual",
  ],
  supportedInput: ["text.plain", "text.markdown", "chunks.deterministic", "document.enriched"],
  supportedOutput: ["json.structured"],
  documentationUrl: "https://docs.anthropic.com",
  configuration: [
    { key: "model", label: "Model", description: "Claude model identifier.", required: true },
    { key: "apiKey", label: "API key", description: "Managed via platform secrets.", required: true },
  ],
  tags: ["frontier", "closed-source"],
};
