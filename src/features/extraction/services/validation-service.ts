import type { NormalizedRecord } from "@/features/sources";
import type {
  BiomedicalEntitySet,
  StudyAttributes,
  ValidationIssue,
  ValidationReport,
  WomensHealthConceptSet,
} from "../types";

export interface ValidationInput {
  readonly record: NormalizedRecord;
  readonly entities: BiomedicalEntitySet;
  readonly womensHealth: WomensHealthConceptSet;
  readonly study: StudyAttributes;
}

export const ValidationService = {
  validate(input: ValidationInput): ValidationReport {
    const issues: ValidationIssue[] = [];

    if (!input.record.abstract) {
      issues.push({
        code: "missing.abstract",
        severity: "warn",
        message: "No abstract available — extraction relies on title and metadata only.",
        field: "abstract",
      });
    }

    if (!input.record.doi && input.record.source !== "clinicaltrials") {
      issues.push({
        code: "missing.doi",
        severity: "info",
        message: "No DOI reported — citation resolution may be incomplete.",
        field: "doi",
      });
    }

    if (input.record.authors.length === 0) {
      issues.push({
        code: "missing.authors",
        severity: "warn",
        message: "No authors extracted from provider metadata.",
        field: "authors",
      });
    }

    if (input.entities.items.length === 0) {
      issues.push({
        code: "extraction.no-entities",
        severity: "info",
        message: "No biomedical entities matched — this record may be off-domain.",
        field: "entities",
      });
    }

    if (input.womensHealth.matches.length === 0) {
      issues.push({
        code: "extraction.no-womens-health",
        severity: "info",
        message: "No women's health concepts detected in the source text.",
        field: "womensHealth",
      });
    }

    if (input.study.sampleSize.method === "not-extracted") {
      issues.push({
        code: "study.missing-sample-size",
        severity: "info",
        message: "Sample size not extracted from abstract or metadata.",
        field: "sampleSize",
      });
    }

    if (input.study.population.method === "not-extracted") {
      issues.push({
        code: "study.missing-population",
        severity: "info",
        message: "Population description not extracted.",
        field: "population",
      });
    }

    const errors = issues.filter((i) => i.severity === "error").length;
    const warns = issues.filter((i) => i.severity === "warn").length;
    const infos = issues.filter((i) => i.severity === "info").length;
    const score = Math.max(0, 1 - errors * 0.3 - warns * 0.1 - infos * 0.03);
    const passed = errors === 0;

    return { issues, score, passed };
  },
};

export type IValidationService = typeof ValidationService;
