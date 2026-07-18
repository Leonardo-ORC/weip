import { useMemo, useState, useCallback } from "react";
import type {
  ProviderCategory,
  ProviderStatus,
} from "../types/provider";
import { PROVIDER_CATEGORY_ORDER } from "../models/provider";
import {
  EMPTY_FILTERS,
  filterProviders,
  getCatalog,
  groupByCategory,
  type CatalogFilters,
} from "../services/catalog-service";

export function useProviderCatalog(initial: Partial<CatalogFilters> = {}) {
  const [filters, setFilters] = useState<CatalogFilters>({
    ...EMPTY_FILTERS,
    ...initial,
  });

  const all = useMemo(() => getCatalog(), []);
  const filtered = useMemo(() => filterProviders(all, filters), [all, filters]);
  const grouped = useMemo(
    () => groupByCategory(filtered, PROVIDER_CATEGORY_ORDER),
    [filtered],
  );

  const setQuery = useCallback((query: string) => {
    setFilters((prev) => ({ ...prev, query }));
  }, []);

  const toggleCategory = useCallback((category: ProviderCategory) => {
    setFilters((prev) => ({
      ...prev,
      categories: prev.categories.includes(category)
        ? prev.categories.filter((c) => c !== category)
        : [...prev.categories, category],
    }));
  }, []);

  const toggleStatus = useCallback((status: ProviderStatus) => {
    setFilters((prev) => ({
      ...prev,
      statuses: prev.statuses.includes(status)
        ? prev.statuses.filter((s) => s !== status)
        : [...prev.statuses, status],
    }));
  }, []);

  const reset = useCallback(() => setFilters(EMPTY_FILTERS), []);

  return {
    filters,
    setQuery,
    toggleCategory,
    toggleStatus,
    reset,
    all,
    filtered,
    grouped,
    hasActiveFilters:
      filters.query.length > 0 ||
      filters.categories.length > 0 ||
      filters.statuses.length > 0,
  };
}
