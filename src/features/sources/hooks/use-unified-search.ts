import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { DEMO_PRESET, journeyStore } from "@/features/journey";
import { UnifiedSearchClient } from "../services";
import type { SourceId, UnifiedSearchQuery } from "../types";

export interface UnifiedSearchInputs {
  term: string;
  author: string;
  journal: string;
  condition: string;
  drug: string;
  disease: string;
  yearFrom: string;
  yearTo: string;
  sources: SourceId[];
  sort: UnifiedSearchQuery["sort"];
  pageSize: number;
}

const ALL_SOURCES: SourceId[] = ["pubmed", "clinicaltrials", "openalex"];

export const DEFAULT_UNIFIED_INPUTS: UnifiedSearchInputs = {
  term: "",
  author: "",
  journal: "",
  condition: "",
  drug: "",
  disease: "",
  yearFrom: "",
  yearTo: "",
  sources: ALL_SOURCES,
  sort: "relevance",
  pageSize: 15,
};

function toQuery(inputs: UnifiedSearchInputs, page: number): UnifiedSearchQuery {
  const yearFrom = Number(inputs.yearFrom);
  const yearTo = Number(inputs.yearTo);
  return {
    term: inputs.term.trim(),
    author: inputs.author.trim() || undefined,
    journal: inputs.journal.trim() || undefined,
    condition: inputs.condition.trim() || undefined,
    drug: inputs.drug.trim() || undefined,
    disease: inputs.disease.trim() || undefined,
    yearFrom: Number.isFinite(yearFrom) && yearFrom > 0 ? yearFrom : undefined,
    yearTo: Number.isFinite(yearTo) && yearTo > 0 ? yearTo : undefined,
    sources: inputs.sources.length ? inputs.sources : ALL_SOURCES,
    page,
    pageSize: inputs.pageSize,
    sort: inputs.sort,
  };
}

function presetInputs(): UnifiedSearchInputs {
  const p = DEMO_PRESET.sources;
  return {
    ...DEFAULT_UNIFIED_INPUTS,
    term: p.term,
    condition: p.condition,
    drug: p.drug,
    disease: p.disease,
    author: p.author,
    journal: p.journal,
    yearFrom: p.yearFrom,
    yearTo: p.yearTo,
    sources: [...p.sources] as SourceId[],
    sort: p.sort,
    pageSize: p.pageSize,
  };
}

export function useUnifiedSearch() {
  const client = useQueryClient();
  const journeyActive =
    typeof window !== "undefined" && journeyStore.get().active;
  const initial = journeyActive ? presetInputs() : DEFAULT_UNIFIED_INPUTS;
  const [inputs, setInputs] = useState<UnifiedSearchInputs>(initial);
  const [activeInputs, setActiveInputs] = useState<UnifiedSearchInputs | null>(
    journeyActive ? initial : null,
  );
  const [page, setPage] = useState(1);
  const seededRef = useRef(journeyActive);

  // If the journey activates after mount, seed once.
  useEffect(() => {
    const unsub = journeyStore.subscribe(() => {
      const active = journeyStore.get().active;
      if (active && !seededRef.current) {
        seededRef.current = true;
        const preset = presetInputs();
        setInputs(preset);
        setActiveInputs(preset);
        setPage(1);
      }
    });
    return () => {
      unsub();
    };
  }, []);


  const query = useMemo(
    () => (activeInputs ? toQuery(activeInputs, page) : null),
    [activeInputs, page],
  );

  const search = useQuery({
    queryKey: ["sources", "unified-search", query],
    enabled: Boolean(query && query.term),
    queryFn: () => UnifiedSearchClient.search(query!),
    staleTime: 2 * 60_000,
    retry: 1,
  });

  const submit = useCallback(() => {
    if (!inputs.term.trim()) return;
    setActiveInputs(inputs);
    setPage(1);
  }, [inputs]);

  const reset = useCallback(() => {
    setInputs(DEFAULT_UNIFIED_INPUTS);
    setActiveInputs(null);
    setPage(1);
  }, []);

  const refresh = useMutation({
    mutationFn: async () => {
      await client.invalidateQueries({ queryKey: ["sources", "unified-search"] });
    },
  });

  return {
    inputs,
    setInputs,
    activeInputs,
    query,
    page,
    setPage,
    submit,
    reset,
    refresh: () => refresh.mutate(),
    isLoading: search.isFetching,
    isError: search.isError,
    error: search.error,
    data: search.data,
  };
}

export type UseUnifiedSearchReturn = ReturnType<typeof useUnifiedSearch>;
