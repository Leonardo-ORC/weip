import type { NormalizedRecord } from "@/features/sources";
import type {
  BiomedicalEntity,
  BiomedicalEntityKind,
  BiomedicalEntitySet,
  ExtractionSource,
  FieldProvenance,
} from "../types";
import { BIOMEDICAL_LEXICON } from "./lexicons";
import { findFirstMatch } from "./text-utils";

const ZERO_COUNTS: Record<BiomedicalEntityKind, number> = {
  disease: 0,
  condition: 0,
  hormone: 0,
  drug: 0,
  biomarker: 0,
  gene: 0,
  protein: 0,
  "lab-test": 0,
  symptom: 0,
  procedure: 0,
  "clinical-outcome": 0,
  device: 0,
};

interface Search {
  readonly text: string;
  readonly source: ExtractionSource;
}

function buildSearchCorpus(record: NormalizedRecord): readonly Search[] {
  const searches: Search[] = [];
  if (record.title) searches.push({ text: record.title, source: "title" });
  if (record.abstract) searches.push({ text: record.abstract, source: "abstract" });
  if (record.keywords.length) {
    searches.push({ text: record.keywords.join(" · "), source: "keywords" });
  }
  return searches;
}

export const BiomedicalExtractor = {
  extract(record: NormalizedRecord): BiomedicalEntitySet {
    const corpus = buildSearchCorpus(record);
    const items: BiomedicalEntity[] = [];
    const seen = new Set<string>();
    const counts: Record<BiomedicalEntityKind, number> = { ...ZERO_COUNTS };

    for (const entry of BIOMEDICAL_LEXICON) {
      const provenance: FieldProvenance[] = [];
      let bestConfidence = 0;

      for (const alias of entry.aliases) {
        for (const search of corpus) {
          const hit = findFirstMatch(search.text, alias);
          if (!hit) continue;
          const confidence =
            search.source === "title" ? 0.95 : search.source === "abstract" ? 0.85 : 0.7;
          bestConfidence = Math.max(bestConfidence, confidence);
          provenance.push({
            source: search.source,
            locator: `char ${hit.index}`,
            snippet: hit.snippet,
          });
        }
      }

      if (provenance.length === 0) continue;
      const key = `${entry.kind}::${entry.label}`;
      if (seen.has(key)) continue;
      seen.add(key);

      items.push({
        label: entry.label,
        kind: entry.kind,
        confidence: bestConfidence,
        provenance: provenance.slice(0, 3),
      });
      counts[entry.kind] += 1;
    }

    return { items, countsByKind: counts };
  },
};

export type IBiomedicalExtractor = typeof BiomedicalExtractor;
