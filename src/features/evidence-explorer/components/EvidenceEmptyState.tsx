import { FileSearch, Inbox, Loader2 } from "lucide-react";

export function EvidenceEmptyState({ onReset }: { onReset: () => void }) {
  return (
    <div className="rounded-2xl border border-dashed border-hairline bg-background/40 p-12 text-center">
      <div className="mx-auto grid h-10 w-10 place-items-center rounded-full bg-secondary text-muted-foreground">
        <FileSearch className="h-5 w-5" />
      </div>
      <h3 className="font-display mt-4 text-lg tracking-tight">No evidence matches your query</h3>
      <p className="mt-1 text-sm text-muted-foreground">
        Try loosening the filters or clearing the search.
      </p>
      <button
        type="button"
        onClick={onReset}
        className="mt-4 rounded-full border border-hairline px-3 py-1 text-xs text-foreground hover:bg-secondary"
      >
        Reset filters
      </button>
    </div>
  );
}

export function EvidenceLoadingState() {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="rounded-2xl border border-hairline bg-background/60 p-5">
          <div className="flex items-center gap-2">
            <div className="h-4 w-24 animate-pulse rounded-full bg-muted" />
            <div className="h-4 w-16 animate-pulse rounded-full bg-muted" />
          </div>
          <div className="mt-3 h-5 w-3/4 animate-pulse rounded bg-muted" />
          <div className="mt-2 h-4 w-full animate-pulse rounded bg-muted/70" />
          <div className="mt-1 h-4 w-2/3 animate-pulse rounded bg-muted/70" />
          <div className="mt-6 flex items-center gap-2 text-muted-foreground">
            <Loader2 className="h-3 w-3 animate-spin" />
            <span className="font-mono text-[10px] uppercase tracking-[0.22em]">loading</span>
          </div>
        </div>
      ))}
    </div>
  );
}

export function EvidenceNoSaved() {
  return (
    <div className="rounded-xl border border-dashed border-hairline bg-background/40 p-6 text-center text-sm text-muted-foreground">
      <Inbox className="mx-auto mb-2 h-4 w-4" />
      No saved evidence yet
    </div>
  );
}
