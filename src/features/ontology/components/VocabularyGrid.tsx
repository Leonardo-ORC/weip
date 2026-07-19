import type { Vocabulary } from "../types";
import { OntologyStatusBadge } from "./OntologyHeader";
import { cn } from "@/lib/utils";

export function VocabularyCard({
  vocabulary,
  active,
  onSelect,
}: {
  vocabulary: Vocabulary;
  active?: boolean;
  onSelect?: (id: string) => void;
}) {
  const Icon = vocabulary.icon;
  return (
    <button
      type="button"
      onClick={() => onSelect?.(vocabulary.id)}
      className={cn(
        "group flex h-full flex-col rounded-2xl border border-hairline bg-background/60 p-5 text-left transition hover:-translate-y-0.5 hover:border-border hover:shadow-soft",
        active && "border-teal/60 bg-teal/5",
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="grid h-9 w-9 place-items-center rounded-lg bg-secondary text-foreground/80">
          <Icon className="h-4 w-4" />
        </div>
        <OntologyStatusBadge status={vocabulary.status} />
      </div>
      <h3 className="font-display mt-4 text-lg tracking-tight text-foreground">{vocabulary.name}</h3>
      <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{vocabulary.description}</p>
      <div className="mt-4 flex items-center justify-between border-t border-hairline pt-3">
        <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
          {vocabulary.category}
        </span>
        <span className="font-display text-sm text-foreground">{vocabulary.conceptCount}</span>
      </div>
    </button>
  );
}

export function VocabularyGrid({
  vocabularies,
  activeId,
  onSelect,
}: {
  vocabularies: Vocabulary[];
  activeId: string | null;
  onSelect: (id: string | null) => void;
}) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      <button
        type="button"
        onClick={() => onSelect(null)}
        className={cn(
          "flex h-full flex-col rounded-2xl border border-dashed border-hairline bg-background/40 p-5 text-left transition hover:border-border",
          activeId === null && "border-teal/60 bg-teal/5",
        )}
      >
        <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
          All vocabularies
        </span>
        <span className="font-display mt-4 text-lg tracking-tight">All concepts</span>
        <span className="mt-1 text-xs text-muted-foreground">
          Browse the entire ontology surface.
        </span>
      </button>
      {vocabularies.map((v) => (
        <VocabularyCard
          key={v.id}
          vocabulary={v}
          active={activeId === v.id}
          onSelect={(id) => onSelect(id === activeId ? null : id)}
        />
      ))}
    </div>
  );
}
