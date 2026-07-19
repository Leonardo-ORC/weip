import { Link } from "@tanstack/react-router";
import { ArrowRight, DownloadCloud, Loader2, Trash2 } from "lucide-react";
import { usePubMedImports } from "../hooks/use-pubmed-imports";

interface Props {
  selectedCount: number;
  onImport: () => void;
  pending: boolean;
  lastImported: number;
}

export function EvidenceImporter({ selectedCount, onImport, pending, lastImported }: Props) {
  const { totals, clear } = usePubMedImports();

  return (
    <section className="rounded-2xl border border-hairline bg-background/60 p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
            Evidence importer
          </div>
          <h3 className="font-display mt-1 text-base tracking-tight">
            Import selected articles
          </h3>
          <p className="mt-1 text-xs text-muted-foreground">
            Selected articles pass through the pipeline and become Evidence Objects.
          </p>
        </div>
        <div className="text-right">
          <div className="font-display text-2xl leading-none tracking-tight">
            {selectedCount}
          </div>
          <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
            Selected
          </div>
        </div>
      </div>

      <div className="mt-4 grid gap-2 sm:grid-cols-3">
        <Stat label="In workspace" value={totals.total} />
        <Stat label="Last run" value={lastImported} />
        <Stat label="Pipeline" value={pending ? "Running" : "Ready"} />
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <button
          type="button"
          disabled={pending || selectedCount === 0}
          onClick={onImport}
          className="inline-flex h-9 items-center gap-1.5 rounded-md bg-ink px-4 text-xs font-medium text-background shadow-soft transition hover:opacity-90 disabled:opacity-50"
        >
          {pending ? (
            <>
              <Loader2 className="h-3.5 w-3.5 animate-spin" /> Processing
            </>
          ) : (
            <>
              <DownloadCloud className="h-3.5 w-3.5" /> Import to Evidence
            </>
          )}
        </button>
        <Link
          to="/app/evidence"
          className="inline-flex h-9 items-center gap-1.5 rounded-md border border-hairline px-3 text-xs text-foreground transition hover:bg-secondary"
        >
          Open Evidence Workspace <ArrowRight className="h-3.5 w-3.5" />
        </Link>
        {totals.total > 0 ? (
          <button
            type="button"
            onClick={clear}
            className="inline-flex h-9 items-center gap-1.5 rounded-md border border-hairline px-3 text-xs text-muted-foreground transition hover:bg-secondary hover:text-foreground"
          >
            <Trash2 className="h-3.5 w-3.5" /> Clear imports
          </button>
        ) : null}
      </div>
    </section>
  );
}

function Stat({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="rounded-xl border border-hairline bg-background/40 p-3">
      <div className="font-display text-xl tracking-tight">{value}</div>
      <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
        {label}
      </div>
    </div>
  );
}
