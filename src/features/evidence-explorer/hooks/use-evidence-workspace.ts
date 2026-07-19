import { useCallback, useMemo, useState } from "react";
import {
  EMPTY_FILTERS,
  EvidenceCollectionService,
  EvidenceFilterService,
  EvidenceSearchService,
  EvidenceService,
} from "../services";
import type {
  ConfidenceLevel,
  EvidenceFilters,
  EvidenceQuality,
  EvidenceType,
  HormonalContext,
  StudyDesign,
} from "../types";

function toggle<T>(list: T[], value: T): T[] {
  return list.includes(value) ? list.filter((v) => v !== value) : [...list, value];
}

export function useEvidenceWorkspace() {
  const all = useMemo(() => EvidenceService.list(), []);
  const overview = useMemo(() => EvidenceService.overview(), []);
  const facets = useMemo(() => EvidenceFilterService.facets(all), [all]);
  const collections = useMemo(() => EvidenceCollectionService.list(), []);

  const [filters, setFilters] = useState<EvidenceFilters>(EMPTY_FILTERS);
  const [selectedId, setSelectedId] = useState<string>(all[0]?.id ?? "");
  const [compareIds, setCompareIds] = useState<string[]>([]);
  const [bookmarks, setBookmarks] = useState<string[]>([]);
  const [compareOpen, setCompareOpen] = useState(false);

  const searched = useMemo(
    () => EvidenceSearchService.search(filters.query, all),
    [filters.query, all],
  );
  const filtered = useMemo(
    () => EvidenceFilterService.apply(searched, filters),
    [searched, filters],
  );

  const selected = useMemo(
    () => all.find((e) => e.id === selectedId) ?? filtered[0] ?? all[0],
    [all, selectedId, filtered],
  );

  const setQuery = useCallback((query: string) => setFilters((f) => ({ ...f, query })), []);
  const toggleType = useCallback(
    (t: EvidenceType) => setFilters((f) => ({ ...f, types: toggle(f.types, t) })),
    [],
  );
  const toggleDesign = useCallback(
    (d: StudyDesign) => setFilters((f) => ({ ...f, designs: toggle(f.designs, d) })),
    [],
  );
  const toggleContext = useCallback(
    (c: HormonalContext) =>
      setFilters((f) => ({ ...f, hormonalContexts: toggle(f.hormonalContexts, c) })),
    [],
  );
  const toggleCountry = useCallback(
    (c: string) => setFilters((f) => ({ ...f, countries: toggle(f.countries, c) })),
    [],
  );
  const toggleJournal = useCallback(
    (j: string) => setFilters((f) => ({ ...f, journals: toggle(f.journals, j) })),
    [],
  );
  const toggleDrug = useCallback(
    (d: string) => setFilters((f) => ({ ...f, drugs: toggle(f.drugs, d) })),
    [],
  );
  const toggleCondition = useCallback(
    (c: string) => setFilters((f) => ({ ...f, conditions: toggle(f.conditions, c) })),
    [],
  );
  const toggleConfidence = useCallback(
    (c: ConfidenceLevel) => setFilters((f) => ({ ...f, confidences: toggle(f.confidences, c) })),
    [],
  );
  const toggleQuality = useCallback(
    (q: EvidenceQuality) => setFilters((f) => ({ ...f, qualities: toggle(f.qualities, q) })),
    [],
  );
  const setYearRange = useCallback(
    (range: [number, number] | null) => setFilters((f) => ({ ...f, years: range })),
    [],
  );
  const setAdverseEvents = useCallback(
    (v: boolean | null) => setFilters((f) => ({ ...f, hasAdverseEvents: v })),
    [],
  );
  const resetFilters = useCallback(() => setFilters(EMPTY_FILTERS), []);

  const selectEvidence = useCallback((id: string) => setSelectedId(id), []);

  const toggleCompare = useCallback((id: string) => {
    setCompareIds((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : prev.length >= 3 ? prev : [...prev, id],
    );
  }, []);
  const clearCompare = useCallback(() => setCompareIds([]), []);

  const toggleBookmark = useCallback((id: string) => {
    setBookmarks((prev) => (prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]));
  }, []);

  const activeFilterCount =
    filters.types.length +
    filters.designs.length +
    filters.hormonalContexts.length +
    filters.countries.length +
    filters.journals.length +
    filters.drugs.length +
    filters.conditions.length +
    filters.confidences.length +
    filters.qualities.length +
    (filters.years ? 1 : 0) +
    (filters.hasAdverseEvents !== null ? 1 : 0);

  const compareItems = useMemo(
    () => compareIds.map((id) => all.find((e) => e.id === id)).filter(Boolean) as typeof all,
    [compareIds, all],
  );

  return {
    all,
    filtered,
    overview,
    facets,
    filters,
    setQuery,
    toggleType,
    toggleDesign,
    toggleContext,
    toggleCountry,
    toggleJournal,
    toggleDrug,
    toggleCondition,
    toggleConfidence,
    toggleQuality,
    setYearRange,
    setAdverseEvents,
    resetFilters,
    activeFilterCount,
    selected,
    selectEvidence,
    compareIds,
    compareItems,
    toggleCompare,
    clearCompare,
    compareOpen,
    setCompareOpen,
    bookmarks,
    toggleBookmark,
    collections,
  };
}

export type EvidenceWorkspaceState = ReturnType<typeof useEvidenceWorkspace>;
