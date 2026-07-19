import { createServerFn } from "@tanstack/react-start";
import type {
  OpenAiIntelligenceInput,
  OpenAiIntelligenceResponse,
} from "../providers/openai-intelligence.server";

interface Input {
  items?: unknown;
}

export const enrichIntelligenceServerFn = createServerFn({ method: "POST" })
  .inputValidator((input: Input): OpenAiIntelligenceInput => {
    const items = Array.isArray(input.items)
      ? (input.items as unknown[])
          .map((raw) => {
            const r = raw as Record<string, unknown>;
            if (typeof r?.id !== "string") return null;
            return {
              id: r.id,
              kind: typeof r.kind === "string" ? r.kind : "insight",
              title: typeof r.title === "string" ? r.title.slice(0, 200) : "",
              description: typeof r.description === "string" ? r.description.slice(0, 600) : "",
              tags: Array.isArray(r.tags)
                ? (r.tags as unknown[]).filter((t): t is string => typeof t === "string").slice(0, 8)
                : [],
            };
          })
          .filter((x): x is NonNullable<typeof x> => x !== null)
          .slice(0, 20)
      : [];
    return { items };
  })
  .handler(async ({ data }): Promise<OpenAiIntelligenceResponse> => {
    const { callOpenAiIntelligence } = await import(
      "../providers/openai-intelligence.server"
    );
    return callOpenAiIntelligence(data);
  });
