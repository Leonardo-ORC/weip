/**
 * Prompt Library.
 *
 * Domain-scoped catalog of prompt definitions. Each domain lives in its
 * own module; adding a new domain is a one-file operation.
 *
 * This sprint ships domain metadata only — no prompt templates.
 */

import type { PromptDomainDefinition } from "../contracts/prompt";
import { WOMEN_DOMAIN } from "./domains/women";
import { HORMONES_DOMAIN } from "./domains/hormones";
import { PREGNANCY_DOMAIN } from "./domains/pregnancy";
import { CLINICAL_TRIALS_DOMAIN } from "./domains/clinical-trials";
import { DRUG_SAFETY_DOMAIN } from "./domains/drug-safety";
import { POPULATION_DOMAIN } from "./domains/population";
import { BIOMARKERS_DOMAIN } from "./domains/biomarkers";
import { OUTCOMES_DOMAIN } from "./domains/outcomes";
import { EVIDENCE_QUALITY_DOMAIN } from "./domains/evidence-quality";

export const PROMPT_DOMAINS: readonly PromptDomainDefinition[] = Object.freeze([
  WOMEN_DOMAIN,
  HORMONES_DOMAIN,
  PREGNANCY_DOMAIN,
  CLINICAL_TRIALS_DOMAIN,
  DRUG_SAFETY_DOMAIN,
  POPULATION_DOMAIN,
  BIOMARKERS_DOMAIN,
  OUTCOMES_DOMAIN,
  EVIDENCE_QUALITY_DOMAIN,
]);

export {
  WOMEN_DOMAIN,
  HORMONES_DOMAIN,
  PREGNANCY_DOMAIN,
  CLINICAL_TRIALS_DOMAIN,
  DRUG_SAFETY_DOMAIN,
  POPULATION_DOMAIN,
  BIOMARKERS_DOMAIN,
  OUTCOMES_DOMAIN,
  EVIDENCE_QUALITY_DOMAIN,
};
