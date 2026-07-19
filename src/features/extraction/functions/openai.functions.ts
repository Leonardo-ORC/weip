/**
 * Server function bridge to the OpenAI extraction call.
 * The client-side OpenAIExtractionProvider invokes this. All secrets
 * stay in the server bundle.
 */

import { createServerFn } from "@tanstack/react-start";
import type { OpenAiExtractionResponse } from "../providers/openai.server";

interface Input {
  title?: unknown;
  abstract?: unknown;
  keywords?: unknown;
}

export const openaiExtractServerFn = createServerFn({ method: "POST" })
  .inputValidator((input: Input) => ({
    title: typeof input.title === "string" ? input.title.slice(0, 4000) : "",
    abstract:
      typeof input.abstract === "string"
        ? input.abstract.slice(0, 12000)
        : null,
    keywords: Array.isArray(input.keywords)
      ? (input.keywords as unknown[])
          .filter((k): k is string => typeof k === "string")
          .slice(0, 40)
      : [],
  }))
  .handler(async ({ data }): Promise<OpenAiExtractionResponse> => {
    const { callOpenAiExtraction } = await import("../providers/openai.server");
    return callOpenAiExtraction(data);
  });
