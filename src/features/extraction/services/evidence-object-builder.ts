/**
 * EvidenceObjectBuilder.
 *
 * Composes a canonical EvidenceObject (consumed by the Evidence
 * Workspace) from a NormalizedRecord plus a fully populated
 * EvidenceExtraction produced by the ExtractionOrchestrator. Everything
 * downstream — Projects, Collections, Research, Dashboard — reads from
 * the same object shape.
 */

import type {
  ConfidenceLevel,
  EvidenceObject,
  EvidenceQuality,
  EvidenceType,
  HormonalContext,
  Outcome,
  StudyDesign,
} from "@/features/evidence-explorer";
import type { NormalizedRecord, SourceStudyType } from "@/features/sources";
import type {
  ConfidenceReport,
  EvidenceExtraction,
  WomensHealthConcept,
} from "../types";

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

function toConfidenceLevel(report: ConfidenceReport): ConfidenceLevel {
  switch (report.grade) {
    case "very-high":
    case "high":
      return "high";
    case "moderate":
      return "moderate";
    case "low":
      return "low";
    case "very-low":
    default:
      return "very-low";
  }
}

function toQuality(report: ConfidenceReport): EvidenceQuality {
  if (report.overall >= 0.8) return "A";
  if (report.overall >= 0.6) return "B";
  if (report.overall >= 0.4) return "C";
  return "D";
}

const WOMENS_TO_HORMONAL: Partial<Record<WomensHealthConcept, HormonalContext>> = {
  pregnancy: "pregnancy",
  postpartum: "pregnancy",
  breastfeeding: "pregnancy",
  menopause: "menopause",
  perimenopause: "perimenopause",
  premenopause: "reproductive",
  "menstrual-cycle": "reproductive",
  fertility: "reproductive",
  ivf: "reproductive",
  pcos: "reproductive",
  endometriosis: "reproductive",
  contraception: "reproductive",
  "hormonal-therapy": "menopause",
};

function toHormonalContext(extraction: EvidenceExtraction): HormonalContext {
  const primary = extraction.womensHealth.primary;
  if (primary && WOMENS_TO_HORMONAL[primary]) return WOMENS_TO_HORMONAL[primary]!;
  return "not-applicable";
}

export const EvidenceObjectBuilder = {
  build(record: NormalizedRecord, extraction: EvidenceExtraction): EvidenceObject {
    const abstract =
      record.abstract ?? "Abstract not available from the source provider.";
    const summary = abstract.length > 320 ? `${abstract.slice(0, 317)}…` : abstract;
    const year = record.publicationYear ?? new Date().getFullYear();

    const primaryCondition =
      extraction.entities.items.find((i) => i.kind === "condition" || i.kind === "disease")?.label ??
      record.keywords[0] ??
      "Uncategorised";

    const primaryDrug = extraction.entities.items.find((i) => i.kind === "drug")?.label;

    const outcomes: Outcome[] = [];
    if (extraction.study.primaryOutcome.value) {
      outcomes.push({
        name: "Primary outcome",
        measure: "extracted",
        result: extraction.study.primaryOutcome.value,
      });
    }
    for (const secondary of extraction.study.secondaryOutcomes.value) {
      outcomes.push({
        name: "Secondary outcome",
        measure: "extracted",
        result: secondary,
      });
    }

    const hormonalContext = toHormonalContext(extraction);

    return {
      id: `${record.source}:${record.externalId}`,
      title: record.title,
      summary,
      type: toEvidenceType(record.studyType),
      studyDesign: toStudyDesign(record.studyType),
      status: extraction.validation.passed ? "structured" : "processing",
      confidence: toConfidenceLevel(extraction.confidence),
      quality: toQuality(extraction.confidence),
      publication: {
        journal: record.journal ?? record.publication ?? "Unknown source",
        year,
        authors: [...record.authors],
        doi: record.doi ?? undefined,
        citations: record.citationCount ?? undefined,
      },
      population: {
        description:
          extraction.study.population.value ??
          "Population details not extracted.",
        sampleSize: extraction.study.sampleSize.value ?? 0,
        countries: [...extraction.study.countries.value],
        hormonalStatus: hormonalContext,
      },
      intervention: {
        description:
          extraction.study.intervention.value ?? "Intervention details not extracted.",
        drug: primaryDrug,
      },
      comparator: extraction.study.comparator.value
        ? { description: extraction.study.comparator.value }
        : undefined,
      outcomes,
      adverseEvents: [],
      drug: primaryDrug,
      condition: primaryCondition,
      hormonalContext,
      tags: [
        ...record.keywords.slice(0, 6),
        ...extraction.womensHealth.matches.slice(0, 4).map((m) => m.concept),
      ],
      limitations: extraction.validation.issues
        .filter((i) => i.severity !== "info")
        .map((i) => i.message),
      ontologyLinks: extraction.entities.items.slice(0, 10).map((i) => ({
        conceptId: `${i.kind}:${i.label.toLowerCase().replace(/\s+/g, "-")}`,
        label: i.label,
        kind:
          i.kind === "drug"
            ? "drug"
            : i.kind === "hormone"
              ? "hormone"
              : i.kind === "biomarker" || i.kind === "lab-test"
                ? "biomarker"
                : i.kind === "clinical-outcome"
                  ? "outcome"
                  : "condition",
      })),
      extraction,
    };
  },
};

export type IEvidenceObjectBuilder = typeof EvidenceObjectBuilder;
