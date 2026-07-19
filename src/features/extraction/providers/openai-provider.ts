/**
 * OpenAIExtractionProvider.
 *
 * Implements the AiExtractionProvider contract by delegating to the
 * `openaiExtractServerFn` server function. The provider itself is
 * client-safe: it never touches OPENAI_API_KEY, never reads env, and
 * never makes a direct network call to OpenAI. All secrets stay on the
 * server.
 *
 * Registered by default in the AiExtractionProviderRegistry so the
 * extraction pipeline can enable AI enrichment simply by passing
 * `aiProviderId: "openai"`.
 */

import { openaiExtractServerFn } from "../functions/openai.functions";
import type {
  AiExtractionInput,
  AiExtractionOutput,
  AiExtractionProvider,
  AiProviderMetadata,
  BiomedicalEntity,
  BiomedicalEntityKind,
  BiomedicalEntitySet,
  ExtractedField,
  FieldProvenance,
  StudyAttributes,
  WomensHealthConcept,
  WomensHealthConceptSet,
  WomensHealthMatch,
} from "../types";
import type { OpenAiRawExtraction } from "./openai.server";

const ENTITY_KINDS: readonly BiomedicalEntityKind[] = [
  "disease",
  "condition",
  "hormone",
  "drug",
  "biomarker",
  "gene",
  "protein",
  "lab-test",
  "symptom",
  "procedure",
  "clinical-outcome",
  "device",
];

const WOMENS_CONCEPTS: readonly WomensHealthConcept[] = [
  "pregnancy",
  "trimester",
  "breastfeeding",
  "postpartum",
  "menopause",
  "perimenopause",
  "premenopause",
  "pcos",
  "endometriosis",
  "fertility",
  "ivf",
  "contraception",
  "hormonal-therapy",
  "menstrual-cycle",
  "gynecologic",
  "reproductive-health",
];

const AI_PROVENANCE: readonly FieldProvenance[] = [
  { source: "abstract", locator: "openai" },
];

function aiField<T>(value: T, confidence: number): ExtractedField<T> {
  return {
    value,
    method: "ai-assisted",
    confidence: Math.max(0, Math.min(1, confidence)),
    provenance: AI_PROVENANCE,
  };
}

function toEntitySet(raw: OpenAiRawExtraction, confidence: number): BiomedicalEntitySet {
  const items: BiomedicalEntity[] = [];
  const counts: Record<BiomedicalEntityKind, number> = {
    disease: 0, condition: 0, hormone: 0, drug: 0, biomarker: 0, gene: 0,
    protein: 0, "lab-test": 0, symptom: 0, procedure: 0,
    "clinical-outcome": 0, device: 0,
  };
  for (const raw_ of raw.entities ?? []) {
    if (!raw_?.label || typeof raw_.label !== "string") continue;
    const kind = ENTITY_KINDS.includes(raw_.kind as BiomedicalEntityKind)
      ? (raw_.kind as BiomedicalEntityKind)
      : null;
    if (!kind) continue;
    items.push({ label: raw_.label, kind, confidence, provenance: AI_PROVENANCE });
    counts[kind]++;
  }
  return { items, countsByKind: counts };
}

function toWomensSet(raw: OpenAiRawExtraction, confidence: number): WomensHealthConceptSet {
  const matches: WomensHealthMatch[] = [];
  for (const c of raw.womensHealthConcepts ?? []) {
    if (!c?.concept) continue;
    if (!WOMENS_CONCEPTS.includes(c.concept as WomensHealthConcept)) continue;
    matches.push({
      concept: c.concept as WomensHealthConcept,
      confidence,
      provenance: AI_PROVENANCE,
    });
  }
  return { matches, primary: matches[0]?.concept ?? null };
}

function toStudy(raw: OpenAiRawExtraction, confidence: number): Partial<StudyAttributes> {
  const out: Partial<StudyAttributes> = {};
  if (raw.population != null) out.population = aiField(raw.population, confidence);
  if (raw.sampleSize != null && Number.isFinite(raw.sampleSize)) {
    out.sampleSize = aiField(raw.sampleSize, confidence);
  }
  if (raw.intervention != null) out.intervention = aiField(raw.intervention, confidence);
  if (raw.comparator != null) out.comparator = aiField(raw.comparator, confidence);
  if (raw.primaryOutcome != null) out.primaryOutcome = aiField(raw.primaryOutcome, confidence);
  if (Array.isArray(raw.secondaryOutcomes)) {
    out.secondaryOutcomes = aiField(raw.secondaryOutcomes.filter((s) => typeof s === "string"), confidence);
  }
  if (Array.isArray(raw.adverseEvents)) {
    out.adverseEvents = aiField(raw.adverseEvents.filter((s) => typeof s === "string"), confidence);
  }
  if (raw.eligibility != null) out.eligibility = aiField(raw.eligibility, confidence);
  if (raw.studyPhase != null) out.studyPhase = aiField(raw.studyPhase, confidence);
  if (raw.studyDesign != null) out.studyDesign = aiField(raw.studyDesign, confidence);
  if (raw.followUp != null) out.followUp = aiField(raw.followUp, confidence);
  if (raw.evidenceLevel != null) out.evidenceLevel = aiField(raw.evidenceLevel, confidence);
  if (Array.isArray(raw.countries)) {
    out.countries = aiField(raw.countries.filter((s) => typeof s === "string"), confidence);
  }
  if (raw.institution != null) out.institution = aiField(raw.institution, confidence);
  if (raw.funding != null) out.funding = aiField(raw.funding, confidence);
  return out;
}

export const OPENAI_PROVIDER_METADATA: AiProviderMetadata = {
  id: "openai",
  name: "OpenAI",
  description: "OpenAI Chat Completions with strict JSON output. Configured via OPENAI_API_KEY / OPENAI_MODEL / OPENAI_BASE_URL.",
  status: "available",
  capabilities: [
    "biomedical-entities",
    "womens-health",
    "study-attributes",
    "outcomes",
    "adverse-events",
  ],
};

export const OpenAIExtractionProvider: AiExtractionProvider = {
  metadata: OPENAI_PROVIDER_METADATA,
  async extract(input: AiExtractionInput): Promise<AiExtractionOutput> {
    const response = await openaiExtractServerFn({
      data: {
        title: input.title,
        abstract: input.abstract,
        keywords: input.keywords,
      },
    });

    if (!response.ok || !response.data) {
      // Fail hard so the orchestrator's try/catch falls back to deterministic.
      throw new Error(response.error ?? "OpenAI extraction failed");
    }

    const raw = response.data;
    const confidence =
      typeof raw.confidence === "number" && raw.confidence >= 0 && raw.confidence <= 1
        ? raw.confidence
        : 0.7;

    return {
      entities: toEntitySet(raw, confidence),
      womensHealth: toWomensSet(raw, confidence),
      study: toStudy(raw, confidence),
    };
  },
};
