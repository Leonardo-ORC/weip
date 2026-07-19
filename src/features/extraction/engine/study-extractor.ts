import type { NormalizedRecord } from "@/features/sources";
import type {
  ExtractedField,
  ExtractionMethod,
  ExtractionSource,
  FieldProvenance,
  StudyAttributes,
} from "../types";
import { extractFirstNumber, findFirstMatch, includesAny } from "./text-utils";

function empty<T>(value: T): ExtractedField<T> {
  return {
    value,
    method: "not-extracted",
    confidence: 0,
    provenance: [],
  };
}

function field<T>(
  value: T,
  source: ExtractionSource,
  snippet: string | undefined,
  method: ExtractionMethod = "deterministic",
  confidence = 0.7,
): ExtractedField<T> {
  const provenance: FieldProvenance[] = [{ source, snippet }];
  return { value, method, confidence, provenance };
}

function readMeta(record: NormalizedRecord, key: string): string | null {
  const raw = record.providerMetadata[key];
  if (typeof raw === "string" && raw.trim()) return raw;
  return null;
}

function readMetaArray(record: NormalizedRecord, key: string): readonly string[] {
  const raw = record.providerMetadata[key];
  if (Array.isArray(raw)) {
    return raw.filter((v): v is string => typeof v === "string" && v.length > 0);
  }
  return [];
}

const SAMPLE_SIZE_PATTERNS: readonly RegExp[] = [
  /\bn\s*=\s*(\d{2,7})\b/i,
  /\b(\d{2,7})\s+(?:women|patients|participants|subjects|individuals)\b/i,
  /enrolled\s+(\d{2,7})\b/i,
];

const FOLLOW_UP_PATTERNS: readonly RegExp[] = [
  /follow[- ]?up\s+of\s+([^.,;]{3,80})/i,
  /followed\s+for\s+([^.,;]{3,80})/i,
];

const PHASE_PATTERNS: readonly RegExp[] = [/\bphase\s+(i{1,3}|iv|1|2|3|4)\b/i];

export const StudyExtractor = {
  extract(record: NormalizedRecord): StudyAttributes {
    const abstract = record.abstract ?? "";

    // Sample size
    const sample = extractFirstNumber(abstract, SAMPLE_SIZE_PATTERNS);
    const sampleSize = sample
      ? field<number | null>(sample.value, "abstract", sample.snippet, "deterministic", 0.9)
      : empty<number | null>(null);

    // Study phase (clinical trials or abstracts)
    const phaseMeta = readMeta(record, "phase");
    const phaseFromText = PHASE_PATTERNS.map((p) => p.exec(abstract)).find(Boolean);
    const studyPhase = phaseMeta
      ? field<string | null>(phaseMeta, "clinical-trial", undefined, "deterministic", 0.98)
      : phaseFromText
        ? field<string | null>(phaseFromText[0], "abstract", phaseFromText[0], "deterministic", 0.8)
        : empty<string | null>(null);

    // Study design
    const design =
      readMeta(record, "studyType") ??
      readMeta(record, "designAllocation") ??
      (record.studyType !== "unknown" ? record.studyType : null);
    const studyDesign = design
      ? field<string | null>(design, "metadata", undefined, "deterministic", 0.85)
      : empty<string | null>(null);

    // Countries
    const metaCountries = readMetaArray(record, "countries");
    const countries: ExtractedField<readonly string[]> = metaCountries.length
      ? field<readonly string[]>(metaCountries, "metadata", undefined, "deterministic", 0.9)
      : empty<readonly string[]>([]);

    // Intervention & comparator (clinical trials expose these directly)
    const interventionMeta =
      readMeta(record, "interventionModel") ??
      (readMetaArray(record, "interventions").join(" / ") || null);
    const intervention = interventionMeta
      ? field<string | null>(interventionMeta, "clinical-trial", undefined, "deterministic", 0.9)
      : empty<string | null>(null);

    const comparatorMeta = readMeta(record, "comparator");
    const comparator = comparatorMeta
      ? field<string | null>(comparatorMeta, "clinical-trial", undefined, "deterministic", 0.85)
      : empty<string | null>(null);

    // Primary outcome — extract sentence containing "primary outcome"
    const primaryHit = findFirstMatch(abstract, "primary outcome");
    const primaryOutcome = primaryHit
      ? field<string | null>(primaryHit.snippet, "abstract", primaryHit.snippet, "deterministic", 0.75)
      : empty<string | null>(null);

    // Secondary outcomes
    const secondaryHit = findFirstMatch(abstract, "secondary outcome");
    const secondaryOutcomes: ExtractedField<readonly string[]> = secondaryHit
      ? field<readonly string[]>([secondaryHit.snippet], "abstract", secondaryHit.snippet, "deterministic", 0.65)
      : empty<readonly string[]>([]);

    // Adverse events
    const adverseHit = findFirstMatch(abstract, "adverse event");
    const adverseEvents: ExtractedField<readonly string[]> = adverseHit
      ? field<readonly string[]>([adverseHit.snippet], "abstract", adverseHit.snippet, "deterministic", 0.7)
      : empty<readonly string[]>([]);

    // Eligibility (clinical trial expose eligibility criteria)
    const eligibilityMeta = readMeta(record, "eligibilityCriteria");
    const eligibility = eligibilityMeta
      ? field<string | null>(eligibilityMeta, "clinical-trial", undefined, "deterministic", 0.9)
      : empty<string | null>(null);

    // Population — pull from eligibility or "women aged" pattern
    const populationText =
      eligibilityMeta ??
      (findFirstMatch(abstract, "women aged")?.snippet ??
        findFirstMatch(abstract, "postmenopausal women")?.snippet ??
        findFirstMatch(abstract, "pregnant women")?.snippet ??
        null);
    const population = populationText
      ? field<string | null>(populationText, eligibilityMeta ? "clinical-trial" : "abstract", populationText, "deterministic", 0.75)
      : empty<string | null>(null);

    // Follow-up
    const followUpMatch = FOLLOW_UP_PATTERNS.map((p) => p.exec(abstract)).find(Boolean);
    const followUp = followUpMatch
      ? field<string | null>(followUpMatch[1] ?? followUpMatch[0], "abstract", followUpMatch[0], "deterministic", 0.7)
      : empty<string | null>(null);

    // Institution / funding
    const institutionMeta =
      readMeta(record, "sponsor") ??
      readMeta(record, "leadSponsor") ??
      readMeta(record, "affiliation");
    const institution = institutionMeta
      ? field<string | null>(institutionMeta, "clinical-trial", undefined, "deterministic", 0.85)
      : empty<string | null>(null);

    const fundingMeta = readMeta(record, "funding") ?? readMeta(record, "funder");
    const funding = fundingMeta
      ? field<string | null>(fundingMeta, "metadata", undefined, "deterministic", 0.8)
      : empty<string | null>(null);

    // Evidence level (heuristic)
    const evidenceLevel = classifyEvidenceLevel(record);

    return {
      population,
      sampleSize,
      intervention,
      comparator,
      primaryOutcome,
      secondaryOutcomes,
      adverseEvents,
      eligibility,
      studyPhase,
      studyDesign,
      followUp,
      evidenceLevel,
      countries,
      institution,
      funding,
    };
  },
};

function classifyEvidenceLevel(record: NormalizedRecord): ExtractedField<string | null> {
  const t = record.studyType;
  const map: Partial<Record<typeof t, string>> = {
    "meta-analysis": "Level I (meta-analysis)",
    "systematic-review": "Level I (systematic review)",
    "clinical-trial": "Level II (RCT)",
    guideline: "Level I (guideline)",
    "case-report": "Level V (case report)",
    article: "Level III–IV (observational)",
    preprint: "Preprint (unreviewed)",
  };
  const value = map[t] ?? null;
  return value
    ? field<string | null>(value, "metadata", undefined, "deterministic", 0.85)
    : empty<string | null>(null);
}

export type IStudyExtractor = typeof StudyExtractor;
