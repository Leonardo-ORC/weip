import { Search, X } from "lucide-react";
import type { FormEvent } from "react";

interface Props {
  query: string;
  onQueryChange: (q: string) => void;
  resultsCount: number;
}

export function EvidenceSearch({ query, onQueryChange, resultsCount }: Props) {
  const handleSubmit = (e: FormEvent) => e.preventDefault();
  return (
    <div className="rounded-2xl border border-hairline bg-background/60 p-5">
      <form onSubmit={handleSubmit} className="flex items-center gap-3">
        <Search className="h-4 w-4 text-muted-foreground" />
        <input
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          placeholder="Search title, drug, condition, hormone, population, author, journal, keyword…"
          className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
          aria-label="Search evidence"
        />
        {query ? (
          <button
            type="button"
            onClick={() => onQueryChange("")}
            className="text-muted-foreground hover:text-foreground"
            aria-label="Clear search"
          >
            <X className="h-4 w-4" />
          </button>
        ) : null}
        <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
          {resultsCount} matches
        </span>
      </form>
    </div>
  );
}
