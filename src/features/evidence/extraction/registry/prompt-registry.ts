/**
 * Prompt Registry.
 *
 * Resolves prompts from the domain-scoped library. Prompts are opaque
 * definitions; templates land in future sprints.
 */

import type {
  PromptDefinition,
  PromptDomainDefinition,
} from "../contracts/prompt";
import type { PromptDomainId } from "../types";
import { PROMPT_DOMAINS } from "../prompts";

export const PROMPT_DOMAIN_REGISTRY: readonly PromptDomainDefinition[] =
  PROMPT_DOMAINS;

export function getAllPromptDomains(): readonly PromptDomainDefinition[] {
  return PROMPT_DOMAIN_REGISTRY;
}

export function getPromptDomainById(
  id: PromptDomainId,
): PromptDomainDefinition | undefined {
  return PROMPT_DOMAIN_REGISTRY.find((d) => d.id === id);
}

export function getAllPrompts(): readonly PromptDefinition[] {
  return PROMPT_DOMAIN_REGISTRY.flatMap((d) => d.prompts);
}

export function getPromptById(id: string): PromptDefinition | undefined {
  return getAllPrompts().find((p) => p.id === id);
}
