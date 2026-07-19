/**
 * Server-only OpenAI extraction call.
 * Reads OPENAI_API_KEY / OPENAI_MODEL / OPENAI_BASE_URL from env inside the handler.
 * Never imported by client code.
 */

export const OPENAI_SYSTEM_PROMPT = `You are a biomedical evidence extraction assistant for the Women's Evidence Intelligence Platform (WEIP).

Extract structured clinical information from the scientific record provided by the user.

Absolute rules:
- Extract ONLY information explicitly stated in the title, abstract or keywords.
- NEVER hallucinate. NEVER infer facts that are not directly supported by the text.
- Missing or unclear information MUST be null (or [] for arrays).
- Preserve scientific accuracy. Do not paraphrase clinical claims.
- Return ONLY a valid JSON object matching the schema below. No markdown, no prose, no code fences.

Schema (all fields required, use null / [] when unknown):
{
  "population": string | null,
  "sampleSize": number | null,
  "intervention": string | null,
  "comparator": string | null,
  "primaryOutcome": string | null,
  "secondaryOutcomes": string[],
  "adverseEvents": string[],
  "eligibility": string | null,
  "studyPhase": string | null,
  "studyDesign": string | null,
  "followUp": string | null,
  "evidenceLevel": string | null,
  "countries": string[],
  "institution": string | null,
  "funding": string | null,
  "studyLimitations": string[],
  "clinicalContext": string | null,
  "womensHealthContext": string | null,
  "entities": [{ "label": string, "kind": "disease"|"condition"|"hormone"|"drug"|"biomarker"|"gene"|"protein"|"lab-test"|"symptom"|"procedure"|"clinical-outcome"|"device" }],
  "womensHealthConcepts": [{ "concept": "pregnancy"|"trimester"|"breastfeeding"|"postpartum"|"menopause"|"perimenopause"|"premenopause"|"pcos"|"endometriosis"|"fertility"|"ivf"|"contraception"|"hormonal-therapy"|"menstrual-cycle"|"gynecologic"|"reproductive-health" }],
  "confidence": number
}`;

export interface OpenAiRawExtraction {
  population: string | null;
  sampleSize: number | null;
  intervention: string | null;
  comparator: string | null;
  primaryOutcome: string | null;
  secondaryOutcomes: string[];
  adverseEvents: string[];
  eligibility: string | null;
  studyPhase: string | null;
  studyDesign: string | null;
  followUp: string | null;
  evidenceLevel: string | null;
  countries: string[];
  institution: string | null;
  funding: string | null;
  studyLimitations: string[];
  clinicalContext: string | null;
  womensHealthContext: string | null;
  entities: { label: string; kind: string }[];
  womensHealthConcepts: { concept: string }[];
  confidence: number;
}

export interface OpenAiExtractionResponse {
  ok: boolean;
  model: string | null;
  extractedAt: string;
  data: OpenAiRawExtraction | null;
  error?: string;
}

const TIMEOUT_MS = 20_000;

export async function callOpenAiExtraction(input: {
  title: string;
  abstract: string | null;
  keywords: readonly string[];
}): Promise<OpenAiExtractionResponse> {
  const apiKey = process.env.OPENAI_API_KEY;
  const model = process.env.OPENAI_MODEL || "gpt-4o-mini";
  const baseUrl = (process.env.OPENAI_BASE_URL || "https://api.openai.com/v1").replace(/\/$/, "");
  const extractedAt = new Date().toISOString();

  if (!apiKey) {
    return { ok: false, model, extractedAt, data: null, error: "OPENAI_API_KEY missing" };
  }

  const userPayload = {
    title: input.title,
    abstract: input.abstract ?? "",
    keywords: input.keywords ?? [],
  };

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
          { role: "system", content: OPENAI_SYSTEM_PROMPT },
          { role: "user", content: JSON.stringify(userPayload) },
        ],
      }),
    });

    if (!res.ok) {
      const text = await res.text().catch(() => "");
      return { ok: false, model, extractedAt, data: null, error: `OpenAI ${res.status}: ${text.slice(0, 200)}` };
    }

    const json = (await res.json()) as { choices?: { message?: { content?: string } }[] };
    const content = json.choices?.[0]?.message?.content ?? "";
    let parsed: OpenAiRawExtraction;
    try {
      parsed = JSON.parse(content) as OpenAiRawExtraction;
    } catch {
      return { ok: false, model, extractedAt, data: null, error: "Invalid JSON from OpenAI" };
    }

    return { ok: true, model, extractedAt, data: parsed };
  } catch (err) {
    const msg = err instanceof Error ? err.message : "OpenAI request failed";
    return { ok: false, model, extractedAt, data: null, error: msg };
  } finally {
    clearTimeout(timer);
  }
}
