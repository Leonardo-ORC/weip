/**
 * Prompt contract.
 *
 * Prompts are first-class, versioned resources organized by domain. The
 * prompt library owns the metadata; concrete templates land in future
 * sprints.
 */

import type {
  ExtractionCapability,
  ExtractionOutputFormat,
  PromptDomainId,
  PromptStatus,
} from "../types";

export interface PromptVariableHint {
  readonly key: string;
  readonly label: string;
  readonly description: string;
  readonly required?: boolean;
}

export interface PromptDefinition {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly domain: PromptDomainId;
  readonly version: string;
  readonly status: PromptStatus;
  readonly targetOutput: ExtractionOutputFormat;
  readonly requiredCapabilities?: readonly ExtractionCapability[];
  readonly variables?: readonly PromptVariableHint[];
  readonly tags?: readonly string[];
}

export interface PromptDomainDefinition {
  readonly id: PromptDomainId;
  readonly name: string;
  readonly description: string;
  readonly prompts: readonly PromptDefinition[];
}
