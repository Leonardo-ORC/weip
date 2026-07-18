import type {
  ProviderCategory,
  ProviderDefinition,
  ProviderStatus,
} from "../types/provider";
import { getAllProviders } from "../registry";
import { matchesProvider } from "../utils/match";

export interface CatalogFilters {
  query: string;
  categories: readonly ProviderCategory[];
  statuses: readonly ProviderStatus[];
}

export const EMPTY_FILTERS: CatalogFilters = {
  query: "",
  categories: [],
  statuses: [],
};

export function filterProviders(
  providers: readonly ProviderDefinition[],
  filters: CatalogFilters,
): readonly ProviderDefinition[] {
  return providers.filter((provider) => {
    if (filters.categories.length && !filters.categories.includes(provider.category)) return false;
    if (filters.statuses.length && !filters.statuses.includes(provider.status)) return false;
    if (!matchesProvider(provider, filters.query)) return false;
    return true;
  });
}

export interface CatalogGroup {
  category: ProviderCategory;
  providers: readonly ProviderDefinition[];
}

export function groupByCategory(
  providers: readonly ProviderDefinition[],
  order: readonly ProviderCategory[],
): readonly CatalogGroup[] {
  return order
    .map((category) => ({
      category,
      providers: providers.filter((p) => p.category === category),
    }))
    .filter((group) => group.providers.length > 0);
}

export function getCatalog(): readonly ProviderDefinition[] {
  return getAllProviders();
}
