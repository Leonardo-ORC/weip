import { Search, X } from "lucide-react";
import { cn } from "@/lib/utils";
import type { PubMedSortOrder } from "../types";
import type { PubMedSearchInputs } from "../hooks/use-pubmed-search";

interface Props {
  inputs: PubMedSearchInputs;
  onChange: (next: PubMedSearchInputs) => void;
  onSubmit: () => void;
  onReset: () => void;
  loading?: boolean;
}

const FIELD =
  "h-10 w-full rounded-md border border-hairline bg-background/60 px-3 text-sm text-foreground outline-none transition placeholder:text-muted-foreground focus:border-ink/60";

export function PubMedSearchBar({ inputs, onChange, onSubmit, onReset, loading }: Props) {
  const patch = (partial: Partial<PubMedSearchInputs>) => onChange({ ...inputs, ...partial });

  return (
    <form
      className="grid gap-3 rounded-2xl border border-hairline bg-background/50 p-4"
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
      }}
    >
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden
          />
          <input
            type="text"
            value={inputs.term}
            onChange={(e) => patch({ term: e.target.value })}
            placeholder="Search PubMed — keywords, condition, drug, free text"
            className={cn(FIELD, "pl-9")}
            aria-label="PubMed search term"
          />
        </div>
        <button
          type="submit"
          disabled={loading || !inputs.term.trim()}
          className="inline-flex h-10 items-center gap-1.5 rounded-md bg-ink px-4 text-sm font-medium text-background shadow-soft transition hover:opacity-90 disabled:opacity-50"
        >
          <Search className="h-4 w-4" /> Search
        </button>
        <button
          type="button"
          onClick={onReset}
          className="inline-flex h-10 items-center gap-1.5 rounded-md border border-hairline px-3 text-sm text-foreground transition hover:bg-secondary"
          aria-label="Reset search"
        >
          <X className="h-4 w-4" /> Reset
        </button>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        <label className="grid gap-1">
          <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
            Author
          </span>
          <input
            type="text"
            value={inputs.author}
            onChange={(e) => patch({ author: e.target.value })}
            placeholder="e.g. Nakamura"
            className={FIELD}
          />
        </label>
        <label className="grid gap-1">
          <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
            Journal
          </span>
          <input
            type="text"
            value={inputs.journal}
            onChange={(e) => patch({ journal: e.target.value })}
            placeholder="e.g. Lancet"
            className={FIELD}
          />
        </label>
        <label className="grid gap-1">
          <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
            Year from
          </span>
          <input
            type="number"
            inputMode="numeric"
            value={inputs.yearFrom}
            onChange={(e) => patch({ yearFrom: e.target.value })}
            placeholder="2015"
            className={FIELD}
            min={1900}
            max={2100}
          />
        </label>
        <label className="grid gap-1">
          <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
            Year to
          </span>
          <input
            type="number"
            inputMode="numeric"
            value={inputs.yearTo}
            onChange={(e) => patch({ yearTo: e.target.value })}
            placeholder={String(new Date().getFullYear())}
            className={FIELD}
            min={1900}
            max={2100}
          />
        </label>
        <label className="grid gap-1">
          <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
            Sort by
          </span>
          <select
            value={inputs.sort}
            onChange={(e) => patch({ sort: e.target.value as PubMedSortOrder })}
            className={FIELD}
          >
            <option value="relevance">Relevance</option>
            <option value="pub_date">Publication date</option>
          </select>
        </label>
      </div>
    </form>
  );
}
