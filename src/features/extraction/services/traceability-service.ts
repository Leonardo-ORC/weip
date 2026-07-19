import type {
  ExtractedField,
  StudyAttributes,
  TraceabilityEntry,
  TraceabilityMap,
} from "../types";

function entryOf(
  field: string,
  extracted: ExtractedField<unknown>,
): TraceabilityEntry | null {
  const p = extracted.provenance[0];
  if (!p) return null;
  return {
    field,
    source: p.source,
    locator: p.locator,
    snippet: p.snippet,
    method: extracted.method,
  };
}

export const TraceabilityService = {
  fromStudy(study: StudyAttributes): TraceabilityMap {
    const entries: TraceabilityEntry[] = [];
    const push = (label: string, f: ExtractedField<unknown>) => {
      const e = entryOf(label, f);
      if (e) entries.push(e);
    };
    push("population", study.population);
    push("sampleSize", study.sampleSize);
    push("intervention", study.intervention);
    push("comparator", study.comparator);
    push("primaryOutcome", study.primaryOutcome);
    push("secondaryOutcomes", study.secondaryOutcomes);
    push("adverseEvents", study.adverseEvents);
    push("eligibility", study.eligibility);
    push("studyPhase", study.studyPhase);
    push("studyDesign", study.studyDesign);
    push("followUp", study.followUp);
    push("evidenceLevel", study.evidenceLevel);
    push("countries", study.countries);
    push("institution", study.institution);
    push("funding", study.funding);
    return { entries };
  },
};

export type ITraceabilityService = typeof TraceabilityService;
