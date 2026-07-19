import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback, useMemo, useState } from "react";
import { PubMedSearchService } from "../services";
import type { PubMedSearchQuery, PubMedSortOrder } from "../types";

export interface PubMedSearchInputs {
  term: string;
  author: string;
  journal: string;
  yearFrom: string;
  yearTo: string;
  sort: PubMedSortOrder;
  pageSize: number;
}

const DEFAULT_INPUTS: PubMedSearchInputs = {
  term: "",
  author: "",
  journal: "",
  yearFrom: "",
  yearTo: "",
  sort: "relevance",
  pageSize: 20,
};

function toQuery(inputs: PubMedSearchInputs, page: number): PubMedSearchQuery {
  const yearFrom = Number(inputs.yearFrom);
  const yearTo = Number(inputs.yearTo);
  return {
    term: inputs.term.trim(),
    author: inputs.author.trim() || undefined,
    journal: inputs.journal.trim() || undefined,
    yearFrom: Number.isFinite(yearFrom) && yearFrom > 0 ? yearFrom : undefined,
    yearTo: Number.isFinite(yearTo) && yearTo > 0 ? yearTo : undefined,
    page,
    pageSize: inputs.pageSize,
    sort: inputs.sort,
  };
}

export function usePubMedSearch() {
  const client = useQueryClient();
  const [inputs, setInputs] = useState<PubMedSearchInputs>(DEFAULT_INPUTS);
  const [activeInputs, setActiveInputs] = useState<PubMedSearchInputs | null>(null);
  const [page, setPage] = useState(1);

  const query = useMemo(
    () => (activeInputs ? toQuery(activeInputs, page) : null),
    [activeInputs, page],
  );

  const searchQuery = useQuery({
    queryKey: ["pubmed", "search", query],
    enabled: Boolean(query && query.term),
    queryFn: () => PubMedSearchService.search(query!),
    staleTime: 2 * 60_000,
    retry: 1,
  });

  const submit = useCallback(() => {
    if (!inputs.term.trim()) return;
    setActiveInputs(inputs);
    setPage(1);
  }, [inputs]);

  const reset = useCallback(() => {
    setInputs(DEFAULT_INPUTS);
    setActiveInputs(null);
    setPage(1);
  }, []);

  const refetchMutation = useMutation({
    mutationFn: async () => {
      await client.invalidateQueries({ queryKey: ["pubmed", "search"] });
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
    refresh: refetchMutation.mutate,
    isLoading: searchQuery.isFetching,
    isError: searchQuery.isError,
    error: searchQuery.error,
    data: searchQuery.data,
  };
}

export type UsePubMedSearchReturn = ReturnType<typeof usePubMedSearch>;
