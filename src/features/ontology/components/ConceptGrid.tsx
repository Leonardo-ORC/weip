import type { Concept } from "../types";
import { OntologyStatusBadge } from "./OntologyHeader";
import { highlight } from "./OntologySearch";
import { cn } from "@/lib/utils";

export function ConceptCard({
  concept,
  active,
  query = "",
  onSelect,
}: {
  concept: Concept;
  active?: boolean;
  query?: string;
  onSelect?: (id: string) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onSelect?.(concept.id)}
      className={cn(
        "flex h-full flex-col rounded-2xl border border-hairline bg-background/60 p-5 text-left transition hover:-translate-y-0.5 hover:border-border hover:shadow-soft",
        active && "border-teal/60 bg-teal/5",
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
          {concept.category}
        </span>
        <OntologyStatusBadge status={concept.status} />
      </div>
      <h3 className="font-display mt-3 text-lg tracking-tight text-foreground">
        {highlight(concept.preferredLabel, query)}
      </h3>
      <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{concept.description}</p>
      {concept.aliases.length > 0 ? (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {concept.aliases.slice(0, 3).map((a) => (
            <span
              key={a}
              className="rounded-full border border-hairline px-2 py-0.5 text-[11px] text-muted-foreground"
            >
              {a}
            </span>
          ))}
        </div>
      ) : null}
      <div className="mt-4 flex items-center justify-between border-t border-hairline pt-3 text-[11px] text-muted-foreground">
        <span className="font-mono uppercase tracking-[0.18em]">
          {concept.relationships.length} rel
        </span>
        <span className="font-mono uppercase tracking-[0.18em]">
          {concept.mappings.length} mappings
        </span>
      </div>
    </button>
  );
}

export function ConceptGrid({
  concepts,
  activeId,
  query,
  onSelect,
  emptyLabel = "No concepts match your filters.",
}: {
  concepts: Concept[];
  activeId?: string;
  query?: string;
  onSelect?: (id: string) => void;
  emptyLabel?: string;
}) {
  if (concepts.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-hairline p-10 text-center text-sm text-muted-foreground">
        {emptyLabel}
      </div>
    );
  }
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {concepts.map((c) => (
        <ConceptCard
          key={c.id}
          concept={c}
          active={activeId === c.id}
          query={query}
          onSelect={onSelect}
        />
      ))}
    </div>
  );
}
