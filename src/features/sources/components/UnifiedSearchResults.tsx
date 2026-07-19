import { ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";
import { ProviderBadge } from "./ProviderBadge";
import { ScientificSourceRegistry } from "../registry";
import type { NormalizedRecord, UnifiedSearchResult } from "../types";

interface UnifiedSearchResultsProps {
  data: UnifiedSearchResult | undefined;
  loading: boolean;
  selectedIds: readonly string[];
  importedIds: readonly string[];
  onToggleSelect: (record: NormalizedRecord) => void;
  onRetry: () => void;
}

function recordKey(r: NormalizedRecord): string {
  return `${r.source}:${r.externalId}`;
}

export function UnifiedSearchResults({
  data,
  loading,
  selectedIds,
  importedIds,
  onToggleSelect,
  onRetry,
}: UnifiedSearchResultsProps) {
  if (loading && !data) {
    return (
      <div className="grid gap-2">
        {[0, 1, 2, 3, 4].map((i) => (
          <div key={i} className="h-24 animate-pulse rounded-2xl border border-hairline bg-background/40" />
        ))}
      </div>
    );
  }

  if (!data) {
    return (
      <div className="rounded-2xl border border-dashed border-hairline bg-background/40 p-8 text-center text-sm text-muted-foreground">
        Enter a term to search PubMed, ClinicalTrials.gov and OpenAlex in parallel.
      </div>
    );
  }

  const providerErrors = data.pages.filter((p) => p.error);

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
        <SourceStat label="Unified" value={data.total} />
        {data.pages.map((p) => (
          <SourceStat
            key={p.source}
            label={ScientificSourceRegistry.metadataFor(p.source)?.shortName ?? p.source}
            value={p.total}
            error={p.error?.message}
          />
        ))}
      </div>

      {providerErrors.length ? (
        <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-xs text-destructive">
          <div className="font-mono uppercase tracking-[0.2em]">Partial results</div>
          <ul className="mt-1 grid gap-1">
            {providerErrors.map((p) => (
              <li key={p.source}>
                <ProviderBadge source={p.source} showDot={false} /> {p.error?.message}
              </li>
            ))}
          </ul>
          <button
            type="button"
            onClick={onRetry}
            className="mt-2 rounded-full border border-destructive/40 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.2em]"
          >
            Retry
          </button>
        </div>
      ) : null}

      {data.records.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-hairline bg-background/40 p-8 text-center text-sm text-muted-foreground">
          No records matched this query across the selected sources.
        </div>
      ) : (
        <ul className="grid gap-2">
          {data.records.map((r) => {
            const id = recordKey(r);
            const selected = selectedIds.includes(id);
            const imported = importedIds.includes(id);
            return (
              <li key={id}>
                <button
                  type="button"
                  onClick={() => onToggleSelect(r)}
                  disabled={imported}
                  className={cn(
                    "group flex w-full flex-col gap-2 rounded-2xl border p-4 text-left transition",
                    selected
                      ? "border-foreground/60 bg-foreground/[0.03]"
                      : "border-hairline bg-background/60 hover:border-foreground/40",
                    imported && "opacity-70",
                  )}
                >
                  <div className="flex flex-wrap items-center gap-2">
                    <ProviderBadge source={r.source} />
                    {r.publicationYear ? (
                      <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                        {r.publicationYear}
                      </span>
                    ) : null}
                    {r.status ? (
                      <span className="rounded-full border border-hairline px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                        {r.status}
                      </span>
                    ) : null}
                    {typeof r.citationCount === "number" ? (
                      <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                        {r.citationCount} cites
                      </span>
                    ) : null}
                    {imported ? (
                      <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-emerald-600 dark:text-emerald-400">
                        Imported
                      </span>
                    ) : selected ? (
                      <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-foreground">
                        Selected
                      </span>
                    ) : null}
                  </div>
                  <div className="font-display text-base tracking-tight text-foreground">
                    {r.title}
                  </div>
                  {r.abstract ? (
                    <p className="line-clamp-2 text-xs text-muted-foreground">{r.abstract}</p>
                  ) : null}
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-muted-foreground">
                    {r.authors.length ? (
                      <span>{r.authors.slice(0, 3).join(", ")}{r.authors.length > 3 ? " …" : ""}</span>
                    ) : null}
                    {r.journal ? <span>· {r.journal}</span> : null}
                    {r.url ? (
                      <a
                        href={r.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="ml-auto inline-flex items-center gap-1 hover:text-foreground"
                      >
                        Open <ExternalLink className="h-3 w-3" />
                      </a>
                    ) : null}
                  </div>
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

function SourceStat({
  label,
  value,
  error,
}: {
  label: string;
  value: number;
  error?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-xl border p-3",
        error
          ? "border-destructive/30 bg-destructive/5"
          : "border-hairline bg-background/40",
      )}
      title={error}
    >
      <div className="font-display text-xl tracking-tight">
        {new Intl.NumberFormat().format(value)}
      </div>
      <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
        {label}
      </div>
    </div>
  );
}
