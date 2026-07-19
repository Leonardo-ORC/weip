import { useCallback, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { ScientificSearchBar } from "./ScientificSearchBar";
import { UnifiedSearchResults } from "./UnifiedSearchResults";
import { UnifiedPipelineStatus } from "./UnifiedPipelineStatus";
import { ProviderStatusPanel } from "./ProviderStatusPanel";
import { SourceStatistics } from "./SourceStatistics";
import { useUnifiedSearch } from "../hooks/use-unified-search";
import { useUnifiedIngestion } from "../hooks/use-unified-ingestion";
import { useUnifiedImports } from "../hooks/use-unified-imports";
import { useProviderHealth } from "../hooks/use-provider-health";
import type { NormalizedRecord, UnifiedSearchQuery } from "../types";

function keyOf(r: { source: string; externalId: string }): string {
  return `${r.source}:${r.externalId}`;
}

export function ScientificSourcesWorkspace() {
  const search = useUnifiedSearch();
  const ingestion = useUnifiedIngestion();
  const imports = useUnifiedImports();
  const health = useProviderHealth();
  const [selected, setSelected] = useState<NormalizedRecord[]>([]);

  const importedIds = useMemo(() => imports.records.map((r) => r.id), [imports.records]);
  const selectedIds = useMemo(() => selected.map(keyOf), [selected]);

  const toggle = useCallback((record: NormalizedRecord) => {
    setSelected((prev) => {
      const id = keyOf(record);
      return prev.some((r) => keyOf(r) === id)
        ? prev.filter((r) => keyOf(r) !== id)
        : [...prev, record];
    });
  }, []);

  const runImport = useCallback(async () => {
    if (!search.query || !selected.length) return;
    const selectedSources = Array.from(new Set(selected.map((r) => r.source)));
    const query: UnifiedSearchQuery = {
      ...search.query,
      sources: selectedSources,
      pageSize: Math.min(50, Math.max(selected.length, search.query.pageSize)),
    };
    // Filter store contents to the selected records after ingest.
    await ingestion.ingest(query);
    setSelected([]);
  }, [ingestion, search.query, selected]);

  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
      <div className="flex flex-col gap-6">
        <ScientificSearchBar
          inputs={search.inputs}
          onChange={search.setInputs}
          onSubmit={search.submit}
          onReset={() => {
            search.reset();
            setSelected([]);
            ingestion.reset();
          }}
          loading={search.isLoading}
        />

        <UnifiedSearchResults
          data={search.data}
          loading={search.isLoading}
          selectedIds={selectedIds}
          importedIds={importedIds}
          onToggleSelect={toggle}
          onRetry={() => search.refresh()}
        />
      </div>

      <aside className="flex flex-col gap-6 xl:sticky xl:top-24 xl:self-start">
        <section className="rounded-2xl border border-hairline bg-background/60 p-5">
          <header className="mb-4">
            <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
              Import queue
            </div>
            <h3 className="font-display mt-1 text-base tracking-tight">
              {selected.length} record{selected.length === 1 ? "" : "s"} selected
            </h3>
          </header>
          <Button
            type="button"
            className="w-full rounded-full"
            disabled={selected.length === 0}
            loading={ingestion.pending}
            loadingText="Ingesting evidence…"
            onClick={runImport}
          >
            Ingest into Evidence
          </Button>
          <div className="mt-4">
            <SourceStatistics counts={imports.totals.perSource} />
          </div>
        </section>

        <UnifiedPipelineStatus run={ingestion.state} />
        <ProviderStatusPanel reports={health.data} loading={health.isLoading} />
      </aside>
    </div>
  );
}
