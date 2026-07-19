import { Search, X } from "lucide-react";

export function WorkspaceSearch({
  query,
  onQueryChange,
  count,
}: {
  query: string;
  onQueryChange: (q: string) => void;
  count: number;
}) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-hairline bg-background/60 px-4 py-3">
      <Search className="h-4 w-4 text-muted-foreground" />
      <input
        value={query}
        onChange={(e) => onQueryChange(e.target.value)}
        placeholder="Search projects, questions, hypotheses, collections, notes…"
        className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
      />
      {query ? (
        <button
          type="button"
          onClick={() => onQueryChange("")}
          className="grid h-6 w-6 place-items-center rounded-full text-muted-foreground hover:bg-secondary"
          aria-label="Clear search"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      ) : null}
      <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
        {count} matched
      </span>
    </div>
  );
}
