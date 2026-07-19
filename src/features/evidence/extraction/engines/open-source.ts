import type { ExtractionModelDefinition } from "../contracts/extraction-model";

export const OPEN_SOURCE_MODEL: ExtractionModelDefinition = {
  id: "opensource.generic",
  name: "Open Source Models",
  provider: "open-source",
  version: "n/a",
  description:
    "Self-hosted, open-weights extraction models — Llama, Mistral, Qwen, Meditron. Routed through a unified inference contract.",
  status: "future",
  supportedCapabilities: [
    "structured-output",
    "self-hosted",
    "long-context",
    "multilingual",
  ],
  supportedInput: ["text.plain", "text.markdown", "chunks.deterministic"],
  supportedOutput: ["json.structured"],
  configuration: [
    { key: "endpoint", label: "Endpoint", description: "Self-hosted inference endpoint URL.", required: true },
    { key: "model", label: "Model", description: "Weight identifier or path.", required: true },
  ],
  tags: ["open-weights", "self-hosted"],
};
