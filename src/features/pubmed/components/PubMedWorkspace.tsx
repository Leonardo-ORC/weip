import { useCallback, useEffect, useMemo, useState } from "react";
import { PubMedSearchBar } from "./PubMedSearchBar";
import { SearchResults } from "./SearchResults";
import { PipelineStatus } from "./PipelineStatus";
import { EvidenceImporter } from "./EvidenceImporter";
import { persistRecentSearch } from "./PubMedLiveWidget";
import { useQuery } from "@tanstack/react-query";
import { usePubMedSearch } from "../hooks/use-pubmed-search";
import { usePubMedImports } from "../hooks/use-pubmed-imports";
import { usePubMedIngestion } from "../hooks/use-pubmed-ingestion";
import { PubMedFetchService } from "../services";
import type { PubMedArticle } from "../types";

export function PubMedWorkspace() {
  const search = usePubMedSearch();
  const ingestion = usePubMedIngestion();
  const imports = usePubMedImports();
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const ids = useMemo(() => search.data?.ids ?? [], [search.data]);

  const articlesQuery = useQuery({
    queryKey: ["pubmed", "articles", ids],
    enabled: ids.length > 0,
    queryFn: () => PubMedFetchService.fetchArticles(ids),
    staleTime: 5 * 60_000,
  });

  const articles = useMemo<PubMedArticle[]>(
    () => articlesQuery.data ?? [],
    [articlesQuery.data],
  );

  // Persist search term for the dashboard widget
  useEffect(() => {
    if (search.activeInputs?.term) persistRecentSearch(search.activeInputs.term);
  }, [search.activeInputs]);

  const toggleSelect = useCallback(
    (pmid: string) =>
      setSelectedIds((prev) =>
        prev.includes(pmid) ? prev.filter((p) => p !== pmid) : [...prev, pmid],
      ),
    [],
  );

  const openArticle = useCallback((pmid: string) => {
    window.open(`https://pubmed.ncbi.nlm.nih.gov/${pmid}/`, "_blank", "noopener,noreferrer");
  }, []);

  const handleImport = useCallback(async () => {
    if (!selectedIds.length) return;
    await ingestion.ingest(selectedIds);
    setSelectedIds([]);
  }, [ingestion, selectedIds]);

  const loading = search.isLoading || articlesQuery.isFetching;

  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
      <div className="flex flex-col gap-6">
        <PubMedSearchBar
          inputs={search.inputs}
          onChange={search.setInputs}
          onSubmit={search.submit}
          onReset={() => {
            search.reset();
            setSelectedIds([]);
            ingestion.reset();
          }}
          loading={loading}
        />

        <SearchResults
          page={search.data}
          articles={articles}
          loading={loading}
          error={search.error ?? articlesQuery.error}
          selectedIds={selectedIds}
          importedIds={imports.records.map((r) => r.id)}
          onToggleSelect={toggleSelect}
          onOpen={openArticle}
          onPageChange={search.setPage}
          onRetry={() => search.refresh()}
        />
      </div>

      <aside className="flex flex-col gap-6 xl:sticky xl:top-24 xl:self-start">
        <EvidenceImporter
          selectedCount={selectedIds.length}
          onImport={handleImport}
          pending={ingestion.pending}
          lastImported={ingestion.lastImported}
        />
        <PipelineStatus run={ingestion.state} />
      </aside>
    </div>
  );
}
