import { Search, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { SourceSelector } from "./SourceSelector";
import type { UnifiedSearchInputs } from "../hooks/use-unified-search";

interface ScientificSearchBarProps {
  inputs: UnifiedSearchInputs;
  onChange: (next: UnifiedSearchInputs) => void;
  onSubmit: () => void;
  onReset: () => void;
  loading?: boolean;
}

export function ScientificSearchBar({
  inputs,
  onChange,
  onSubmit,
  onReset,
  loading,
}: ScientificSearchBarProps) {
  const update = <K extends keyof UnifiedSearchInputs>(key: K, value: UnifiedSearchInputs[K]) =>
    onChange({ ...inputs, [key]: value });

  return (
    <form
      className="rounded-2xl border border-hairline bg-background/60 p-5"
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
      }}
    >
      <div className="flex flex-col gap-3">
        <div className="grid grid-cols-1 items-center gap-2 md:grid-cols-[minmax(0,1fr)_auto]">
          <div className="flex items-center gap-2 rounded-xl border border-hairline bg-background px-3 py-2">
            <Search className="h-4 w-4 text-muted-foreground" />
            <input
              value={inputs.term}
              onChange={(e) => update("term", e.target.value)}
              placeholder="Search across PubMed, ClinicalTrials.gov, OpenAlex…"
              className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
            />
            {inputs.term ? (
              <button
                type="button"
                onClick={() => update("term", "")}
                className="text-muted-foreground hover:text-foreground"
                aria-label="Clear search"
              >
                <X className="h-4 w-4" />
              </button>
            ) : null}
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onReset}
              className="rounded-full border border-hairline px-4 py-2 text-sm text-muted-foreground transition hover:text-foreground"
            >
              Reset
            </button>
            <button
              type="submit"
              disabled={loading || !inputs.term.trim()}
              className={cn(
                "rounded-full bg-ink px-5 py-2 text-sm font-medium text-background shadow-soft transition",
                (loading || !inputs.term.trim()) && "opacity-50",
              )}
            >
              {loading ? "Searching…" : "Search all sources"}
            </button>
          </div>
        </div>

        <SourceSelector
          selected={inputs.sources}
          onChange={(next) => update("sources", next)}
        />

        <div className="grid grid-cols-2 gap-2 md:grid-cols-6">
          <Field label="Author" value={inputs.author} onChange={(v) => update("author", v)} />
          <Field label="Journal" value={inputs.journal} onChange={(v) => update("journal", v)} />
          <Field label="Condition" value={inputs.condition} onChange={(v) => update("condition", v)} />
          <Field label="Drug" value={inputs.drug} onChange={(v) => update("drug", v)} />
          <Field
            label="Year from"
            value={inputs.yearFrom}
            onChange={(v) => update("yearFrom", v.replace(/\D/g, "").slice(0, 4))}
          />
          <Field
            label="Year to"
            value={inputs.yearTo}
            onChange={(v) => update("yearTo", v.replace(/\D/g, "").slice(0, 4))}
          />
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
              Sort
            </span>
            {(["relevance", "date", "citations"] as const).map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => update("sort", s)}
                className={cn(
                  "rounded-full border px-3 py-1 font-mono text-[10px] uppercase tracking-[0.2em] transition",
                  inputs.sort === s
                    ? "border-foreground/60 bg-foreground/5 text-foreground"
                    : "border-hairline text-muted-foreground hover:text-foreground",
                )}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </div>
    </form>
  );
}

function Field({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <label className="flex flex-col gap-1">
      <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
        {label}
      </span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="rounded-lg border border-hairline bg-background px-3 py-1.5 text-sm outline-none focus:border-foreground/40"
      />
    </label>
  );
}
