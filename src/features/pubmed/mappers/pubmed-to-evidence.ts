/**
 * EvidenceMapper — normalize a PubMedArticle into an EvidenceObject
 * compatible with the Evidence Workspace. No AI extraction: population,
 * intervention and outcomes are left as neutral placeholders derived
 * from PubMed metadata only.
 */

import type { EvidenceObject, EvidenceType, StudyDesign } from "@/features/evidence-explorer";
import type { PubMedArticle } from "../types";

function inferType(article: PubMedArticle): EvidenceType {
  const types = article.publicationTypes.map((t) => t.toLowerCase());
  if (types.some((t) => t.includes("meta-analysis"))) return "meta-analysis";
  if (types.some((t) => t.includes("systematic review"))) return "systematic-review";
  if (types.some((t) => t.includes("guideline"))) return "guideline";
  if (types.some((t) => t.includes("case reports"))) return "case-report";
  if (types.some((t) => t.includes("clinical trial") || t.includes("randomized"))) {
    return "clinical-trial";
  }
  return "systematic-review";
}

function inferDesign(article: PubMedArticle): StudyDesign {
  const types = article.publicationTypes.map((t) => t.toLowerCase());
  if (types.some((t) => t.includes("randomized"))) return "RCT";
  if (types.some((t) => t.includes("meta-analysis"))) return "Meta-analysis";
  if (types.some((t) => t.includes("systematic review"))) return "Systematic review";
  if (types.some((t) => t.includes("guideline"))) return "Guideline";
  if (types.some((t) => t.includes("case reports"))) return "Case report";
  if (types.some((t) => t.includes("cohort"))) return "Cohort";
  if (types.some((t) => t.includes("case-control"))) return "Case-control";
  if (types.some((t) => t.includes("cross-sectional"))) return "Cross-sectional";
  return "Cohort";
}

export const EvidenceMapper = {
  fromPubMed(article: PubMedArticle): EvidenceObject {
    const type = inferType(article);
    const design = inferDesign(article);
    const abstract = article.abstract ?? "Abstract not available from PubMed.";
    const summary = abstract.length > 320 ? `${abstract.slice(0, 317)}…` : abstract;

    return {
      id: article.id,
      title: article.title,
      summary,
      type,
      studyDesign: design,
      status: "structured",
      confidence: "moderate",
      quality: "B",
      publication: {
        journal: article.journal.title,
        year: article.publicationYear || new Date().getFullYear(),
        authors: article.authors.map((a) => a.name),
        doi: article.doi,
      },
      population: {
        description: "Population details pending AI extraction.",
        sampleSize: 0,
        countries: [],
        hormonalStatus: "not-applicable",
      },
      intervention: {
        description: "Intervention details pending AI extraction.",
      },
      outcomes: [],
      adverseEvents: [],
      condition: article.meshTerms[0] ?? "Uncategorised",
      hormonalContext: "not-applicable",
      tags: [...article.meshTerms.slice(0, 6), ...article.keywords.slice(0, 4)],
      limitations: [],
      ontologyLinks: [],
    };
  },
};

export type IEvidenceMapper = typeof EvidenceMapper;
