import { Search, X } from "lucide-react";
import type { FormEvent } from "react";
import { cn } from "@/lib/utils";

interface Props {
  query: string;
  onQueryChange: (q: string) => void;
  onSubmit: (q: string) => void;
  recent: string[];
  resultsCount: number;
}

function highlight(text: string, term: string) {
  if (!term.trim()) return text;
  const idx = text.toLowerCase().indexOf(term.toLowerCase());
  if (idx < 0) return text;
  return (
    <>
      {text.slice(0, idx)}
      <mark className="rounded bg-accent/25 px-0.5 text-foreground">
        {text.slice(idx, idx + term.length)}
      </mark>
      {text.slice(idx + term.length)}
    </>
  );
}

export function OntologySearch({ query, onQueryChange, onSubmit, recent, resultsCount }: Props) {
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSubmit(query);
  };

  return (
    <div className="rounded-2xl border border-hairline bg-background/60 p-5">
      <form onSubmit={handleSubmit} className="flex items-center gap-3">
        <Search className="h-4 w-4 text-muted-foreground" />
        <input
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          placeholder="Search concepts, aliases, synonyms…"
          className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
          aria-label="Search ontology"
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
      {recent.length > 0 ? (
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
            Recent
          </span>
          {recent.map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => {
                onQueryChange(r);
                onSubmit(r);
              }}
              className={cn(
                "rounded-full border border-hairline px-2.5 py-0.5 text-xs text-muted-foreground transition hover:border-border hover:text-foreground",
              )}
            >
              {r}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}

export { highlight };
