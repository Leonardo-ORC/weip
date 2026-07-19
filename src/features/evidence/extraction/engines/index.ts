import type { ExtractionModelDefinition } from "../contracts/extraction-model";
import { OPENAI_MODEL } from "./openai";
import { ANTHROPIC_MODEL } from "./anthropic";
import { GOOGLE_GEMINI_MODEL } from "./google-gemini";
import { AZURE_OPENAI_MODEL } from "./azure-openai";
import { OPEN_SOURCE_MODEL } from "./open-source";

export {
  OPENAI_MODEL,
  ANTHROPIC_MODEL,
  GOOGLE_GEMINI_MODEL,
  AZURE_OPENAI_MODEL,
  OPEN_SOURCE_MODEL,
};

export const EXTRACTION_MODEL_DEFINITIONS: readonly ExtractionModelDefinition[] =
  Object.freeze([
    OPENAI_MODEL,
    ANTHROPIC_MODEL,
    GOOGLE_GEMINI_MODEL,
    AZURE_OPENAI_MODEL,
    OPEN_SOURCE_MODEL,
  ]);
