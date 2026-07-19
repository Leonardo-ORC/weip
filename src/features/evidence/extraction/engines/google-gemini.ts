import type { ExtractionModelDefinition } from "../contracts/extraction-model";

export const GOOGLE_GEMINI_MODEL: ExtractionModelDefinition = {
  id: "google.gemini",
  name: "Google Gemini",
  provider: "google-gemini",
  version: "n/a",
  description:
    "Multimodal extraction with very large context windows via the Google AI / Vertex APIs. Registered as an isolated provider.",
  status: "planned",
  supportedCapabilities: [
    "structured-output",
    "long-context",
    "vision",
    "multilingual",
    "reasoning",
  ],
  supportedInput: ["text.plain", "text.markdown", "chunks.deterministic", "document.enriched"],
  supportedOutput: ["json.structured", "json.schema"],
  documentationUrl: "https://ai.google.dev/docs",
  configuration: [
    { key: "model", label: "Model", description: "Gemini model identifier.", required: true },
    { key: "apiKey", label: "API key", description: "Managed via platform secrets.", required: true },
  ],
  tags: ["frontier", "multimodal"],
};
