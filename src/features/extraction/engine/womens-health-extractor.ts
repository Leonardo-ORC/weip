import type { NormalizedRecord } from "@/features/sources";
import type {
  ExtractionSource,
  FieldProvenance,
  WomensHealthConcept,
  WomensHealthConceptSet,
  WomensHealthMatch,
} from "../types";
import { WOMENS_HEALTH_LEXICON } from "./lexicons";
import { findFirstMatch } from "./text-utils";

interface Search {
  readonly text: string;
  readonly source: ExtractionSource;
}

function corpus(record: NormalizedRecord): readonly Search[] {
  const out: Search[] = [];
  if (record.title) out.push({ text: record.title, source: "title" });
  if (record.abstract) out.push({ text: record.abstract, source: "abstract" });
  if (record.keywords.length) {
    out.push({ text: record.keywords.join(" · "), source: "keywords" });
  }
  return out;
}

const PRIORITY: readonly WomensHealthConcept[] = [
  "pregnancy",
  "menopause",
  "perimenopause",
  "postpartum",
  "pcos",
  "endometriosis",
  "ivf",
  "fertility",
  "contraception",
  "hormonal-therapy",
  "breastfeeding",
  "menstrual-cycle",
  "trimester",
  "premenopause",
  "gynecologic",
  "reproductive-health",
];

export const WomensHealthExtractor = {
  extract(record: NormalizedRecord): WomensHealthConceptSet {
    const searches = corpus(record);
    const matches: WomensHealthMatch[] = [];

    for (const entry of WOMENS_HEALTH_LEXICON) {
      const provenance: FieldProvenance[] = [];
      let confidence = 0;
      for (const alias of entry.aliases) {
        for (const s of searches) {
          const hit = findFirstMatch(s.text, alias);
          if (!hit) continue;
          const c = s.source === "title" ? 0.95 : s.source === "abstract" ? 0.85 : 0.7;
          confidence = Math.max(confidence, c);
          provenance.push({ source: s.source, locator: `char ${hit.index}`, snippet: hit.snippet });
        }
      }
      if (provenance.length === 0) continue;
      matches.push({
        concept: entry.kind,
        confidence,
        provenance: provenance.slice(0, 3),
      });
    }

    const primary =
      PRIORITY.find((c) => matches.some((m) => m.concept === c)) ?? null;

    return { matches, primary };
  },
};

export type IWomensHealthExtractor = typeof WomensHealthExtractor;
