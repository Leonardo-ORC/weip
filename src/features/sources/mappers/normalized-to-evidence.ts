/**
 * Map a NormalizedRecord (from any provider) into an EvidenceObject
 * compatible with the Evidence Workspace. Metadata-only: no AI, no
 * extraction, no hallucination — unknown fields stay neutral.
 */

import type {
  EvidenceObject,
  EvidenceType,
  StudyDesign,
} from "@/features/evidence-explorer";
import type { NormalizedRecord, SourceStudyType } from "../types";

function toEvidenceType(t: SourceStudyType): EvidenceType {
  switch (t) {
    case "clinical-trial":
      return "clinical-trial";
    case "systematic-review":
      return "systematic-review";
    case "meta-analysis":
      return "meta-analysis";
    case "guideline":
      return "guideline";
    case "case-report":
      return "case-report";
    default:
      return "systematic-review";
  }
}

function toStudyDesign(t: SourceStudyType): StudyDesign {
  switch (t) {
    case "clinical-trial":
      return "RCT";
    case "systematic-review":
      return "Systematic review";
    case "meta-analysis":
      return "Meta-analysis";
    case "guideline":
      return "Guideline";
    case "case-report":
      return "Case report";
    default:
      return "Cohort";
  }
}

function firstMetadataString(
  record: NormalizedRecord,
  key: string,
): string | undefined {
  const raw = record.providerMetadata[key];
  if (typeof raw === "string" && raw) return raw;
  if (Array.isArray(raw)) {
    const first = raw.find((v) => typeof v === "string" && v);
    if (typeof first === "string") return first;
  }
  return undefined;
}

export const NormalizedEvidenceMapper = {
  toEvidence(record: NormalizedRecord): EvidenceObject {
    const abstract =
      record.abstract ?? "Abstract not available from the source provider.";
    const summary = abstract.length > 320 ? `${abstract.slice(0, 317)}…` : abstract;
    const year = record.publicationYear ?? new Date().getFullYear();
    const condition =
      firstMetadataString(record, "conditions") ??
      record.keywords[0] ??
      "Uncategorised";

    return {
      id: `${record.source}:${record.externalId}`,
      title: record.title,
      summary,
      type: toEvidenceType(record.studyType),
      studyDesign: toStudyDesign(record.studyType),
      status: "structured",
      confidence: "moderate",
      quality: "B",
      publication: {
        journal: record.journal ?? record.publication ?? "Unknown source",
        year,
        authors: [...record.authors],
        doi: record.doi ?? undefined,
        citations: record.citationCount ?? undefined,
      },
      population: {
        description:
          record.source === "clinicaltrials"
            ? "See eligibility criteria for details."
            : "Population details not extracted.",
        sampleSize: 0,
        countries: Array.isArray(record.providerMetadata.countries)
          ? (record.providerMetadata.countries as readonly string[]).filter(
              (c): c is string => typeof c === "string",
            )
          : [],
        hormonalStatus: "not-applicable",
      },
      intervention: {
        description:
          firstMetadataString(record, "interventionModel") ??
          "Intervention details not extracted.",
      },
      outcomes: [],
      adverseEvents: [],
      condition,
      hormonalContext: "not-applicable",
      tags: record.keywords.slice(0, 10),
      limitations: [],
      ontologyLinks: [],
    };
  },
};

export type INormalizedEvidenceMapper = typeof NormalizedEvidenceMapper;
