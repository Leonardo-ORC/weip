/**
 * Server-only OpenAI call for Research Intelligence enrichment.
 * Consumes ONLY structured information (insight titles, descriptions,
 * evidence titles) — never raw provider records. Returns short natural
 * language summaries and never scientific claims.
 */

const TIMEOUT_MS = 15_000;

export const OPENAI_INTELLIGENCE_SYSTEM_PROMPT = `You are a Research Intelligence assistant for the Women's Evidence Intelligence Platform (WEIP).

You will receive a list of already-detected insights derived deterministically from a scientific knowledge graph. Your job is to enrich each insight with:
- a concise natural-language summary (max 220 characters)
- an optional short recommended next action (max 140 characters)

Absolute rules:
- Never invent scientific claims, effect sizes, mechanisms or clinical recommendations.
- Never contradict the deterministic insight.
- Only reason about what is explicitly present in the input.
- Output MUST be a JSON object of shape: { "items": [{ "id": string, "summary": string, "action": string|null, "confidence": number }] }
- No markdown, no prose outside JSON.`;

export interface AiEnrichedInsight {
  id: string;
  summary: string;
  action: string | null;
  confidence: number;
}

export interface OpenAiIntelligenceResponse {
  ok: boolean;
  model: string | null;
  generatedAt: string;
  items: AiEnrichedInsight[];
  error?: string;
}

export interface OpenAiIntelligenceInput {
  items: readonly {
    id: string;
    kind: string;
    title: string;
    description: string;
    tags: readonly string[];
  }[];
}

export async function callOpenAiIntelligence(
  input: OpenAiIntelligenceInput,
): Promise<OpenAiIntelligenceResponse> {
  const apiKey = process.env.OPENAI_API_KEY;
  const model = process.env.OPENAI_MODEL || "gpt-4o-mini";
  const baseUrl = (process.env.OPENAI_BASE_URL || "https://api.openai.com/v1").replace(/\/$/, "");
  const generatedAt = new Date().toISOString();

  if (!apiKey) {
    return { ok: false, model, generatedAt, items: [], error: "OPENAI_API_KEY missing" };
  }
  if (input.items.length === 0) {
    return { ok: true, model, generatedAt, items: [] };
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const res = await fetch(`${baseUrl}/chat/completions`, {
      method: "POST",
      signal: controller.signal,
      headers: {
        "content-type": "application/json",
        authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        temperature: 0,
        response_format: { type: "json_object" },
        messages: [
          { role: "system", content: OPENAI_INTELLIGENCE_SYSTEM_PROMPT },
          { role: "user", content: JSON.stringify({ items: input.items.slice(0, 20) }) },
        ],
      }),
    });

    if (!res.ok) {
      const text = await res.text().catch(() => "");
      return {
        ok: false,
        model,
        generatedAt,
        items: [],
        error: `OpenAI ${res.status}: ${text.slice(0, 200)}`,
      };
    }

    const json = (await res.json()) as { choices?: { message?: { content?: string } }[] };
    const content = json.choices?.[0]?.message?.content ?? "";
    let parsed: { items?: unknown };
    try {
      parsed = JSON.parse(content);
    } catch {
      return { ok: false, model, generatedAt, items: [], error: "Invalid JSON from OpenAI" };
    }
    const items = Array.isArray(parsed.items)
      ? (parsed.items as unknown[])
          .map((raw) => {
            const r = raw as Partial<AiEnrichedInsight>;
            if (typeof r?.id !== "string") return null;
            return {
              id: r.id,
              summary: typeof r.summary === "string" ? r.summary.slice(0, 260) : "",
              action: typeof r.action === "string" && r.action.trim() ? r.action.slice(0, 180) : null,
              confidence: Math.max(0, Math.min(1, Number(r.confidence ?? 0.6))),
            } satisfies AiEnrichedInsight;
          })
          .filter((x): x is AiEnrichedInsight => x !== null)
      : [];

    return { ok: true, model, generatedAt, items };
  } catch (err) {
    const msg = err instanceof Error ? err.message : "OpenAI intelligence request failed";
    return { ok: false, model, generatedAt, items: [], error: msg };
  } finally {
    clearTimeout(timer);
  }
}
