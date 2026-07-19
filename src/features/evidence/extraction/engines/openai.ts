import type { ExtractionModelDefinition } from "../contracts/extraction-model";

export const OPENAI_MODEL: ExtractionModelDefinition = {
  id: "openai.gpt",
  name: "OpenAI GPT",
  provider: "openai",
  version: "n/a",
  description:
    "Frontier reasoning and structured-output extraction via the OpenAI API. Registered as a plug-in behind the extraction contract.",
  status: "planned",
  supportedCapabilities: [
    "structured-output",
    "json-schema",
    "function-calling",
    "long-context",
    "reasoning",
    "multilingual",
  ],
  supportedInput: ["text.plain", "text.markdown", "chunks.deterministic", "document.enriched"],
  supportedOutput: ["json.structured", "json.schema"],
  documentationUrl: "https://platform.openai.com/docs",
  configuration: [
    { key: "model", label: "Model", description: "Model identifier (e.g. gpt-4.1).", required: true },
    { key: "apiKey", label: "API key", description: "Managed via platform secrets.", required: true },
    { key: "temperature", label: "Temperature", description: "Sampling temperature." },
  ],
  tags: ["frontier", "closed-source"],
};
