/**
 * Source Registry.
 *
 * Central catalog of every scientific provider known to WEIP. Adding a
 * new provider is a two-step operation:
 *
 *   1. Create `providers/<id>/index.ts` exporting a `ProviderDefinition`.
 *   2. Append the definition to `PROVIDERS` below.
 *
 * The rest of the platform reads exclusively from this registry via the
 * exported selectors — never from provider modules directly.
 */

import type {
  ProviderCategory,
  ProviderDefinition,
  ProviderStatus,
} from "../types/provider";

import { pubmedProvider } from "../providers/pubmed";
import { pubmedCentralProvider } from "../providers/pubmed-central";
import { clinicalTrialsProvider } from "../providers/clinicaltrials";
import { openFdaProvider } from "../providers/openfda";
import { dailyMedProvider } from "../providers/dailymed";
import { openAlexProvider } from "../providers/openalex";
import { crossrefProvider } from "../providers/crossref";
import { europePmcProvider } from "../providers/europepmc";

export const PROVIDERS: readonly ProviderDefinition[] = Object.freeze([
  pubmedProvider,
  pubmedCentralProvider,
  europePmcProvider,
  clinicalTrialsProvider,
  openFdaProvider,
  dailyMedProvider,
  openAlexProvider,
  crossrefProvider,
]);

export function getAllProviders(): readonly ProviderDefinition[] {
  return PROVIDERS;
}

export function getProviderById(id: string): ProviderDefinition | undefined {
  return PROVIDERS.find((p) => p.id === id);
}

export function getProvidersByCategory(category: ProviderCategory): readonly ProviderDefinition[] {
  return PROVIDERS.filter((p) => p.category === category);
}

export function getProvidersByStatus(status: ProviderStatus): readonly ProviderDefinition[] {
  return PROVIDERS.filter((p) => p.status === status);
}
