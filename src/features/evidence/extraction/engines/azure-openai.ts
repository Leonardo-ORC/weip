import type { ExtractionModelDefinition } from "../contracts/extraction-model";

export const AZURE_OPENAI_MODEL: ExtractionModelDefinition = {
  id: "azure.openai",
  name: "Azure OpenAI",
  provider: "azure-openai",
  version: "n/a",
  description:
    "Enterprise-grade OpenAI models hosted on Azure with regional isolation. Same contract as the OpenAI adapter.",
  status: "planned",
  supportedCapabilities: [
    "structured-output",
    "json-schema",
    "function-calling",
    "long-context",
    "reasoning",
  ],
  supportedInput: ["text.plain", "text.markdown", "chunks.deterministic", "document.enriched"],
  supportedOutput: ["json.structured", "json.schema"],
  documentationUrl: "https://learn.microsoft.com/azure/ai-services/openai",
  configuration: [
    { key: "endpoint", label: "Endpoint", description: "Azure resource endpoint URL.", required: true },
    { key: "deployment", label: "Deployment", description: "Named deployment identifier.", required: true },
    { key: "apiKey", label: "API key", description: "Managed via platform secrets.", required: true },
  ],
  tags: ["enterprise", "closed-source"],
};
