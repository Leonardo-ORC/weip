import { ArrowRight } from "lucide-react";
import type { Relationship, RelationshipType } from "../types";
import { cn } from "@/lib/utils";

const REL_LABEL: Record<RelationshipType, string> = {
  IS_A: "Is a",
  PART_OF: "Part of",
  TREATS: "Treats",
  CAUSES: "Causes",
  ASSOCIATED_WITH: "Associated with",
  MEASURES: "Measures",
  PRODUCED_BY: "Produced by",
  DIAGNOSED_BY: "Diagnosed by",
  CONTRAINDICATED_WITH: "Contraindicated with",
  REGULATES: "Regulates",
};

const REL_TONE: Record<RelationshipType, string> = {
  IS_A: "bg-primary/10 text-primary",
  PART_OF: "bg-primary/10 text-primary",
  TREATS: "bg-teal/15 text-teal",
  CAUSES: "bg-destructive/10 text-destructive",
  ASSOCIATED_WITH: "bg-accent/15 text-accent",
  MEASURES: "bg-accent/15 text-accent",
  PRODUCED_BY: "bg-muted text-muted-foreground",
  DIAGNOSED_BY: "bg-muted text-muted-foreground",
  CONTRAINDICATED_WITH: "bg-destructive/10 text-destructive",
  REGULATES: "bg-primary/10 text-primary",
};

const ALL_TYPES: RelationshipType[] = [
  "IS_A",
  "TREATS",
  "CAUSES",
  "ASSOCIATED_WITH",
  "MEASURES",
  "REGULATES",
  "CONTRAINDICATED_WITH",
];

export function RelationshipFilterBar({
  active,
  onChange,
}: {
  active: RelationshipType | null;
  onChange: (t: RelationshipType | null) => void;
}) {
  return (
    <div className="flex flex-wrap items-center gap-1.5">
      <button
        type="button"
        onClick={() => onChange(null)}
        className={cn(
          "rounded-full border border-hairline px-2.5 py-0.5 text-xs text-muted-foreground transition hover:border-border hover:text-foreground",
          active === null && "border-teal/60 bg-teal/10 text-teal",
        )}
      >
        All
      </button>
      {ALL_TYPES.map((t) => (
        <button
          key={t}
          type="button"
          onClick={() => onChange(t === active ? null : t)}
          className={cn(
            "rounded-full border border-hairline px-2.5 py-0.5 text-xs text-muted-foreground transition hover:border-border hover:text-foreground",
            active === t && "border-teal/60 bg-teal/10 text-teal",
          )}
        >
          {REL_LABEL[t]}
        </button>
      ))}
    </div>
  );
}

export function RelationshipGraph({
  relationships,
  onSelectConcept,
}: {
  relationships: Relationship[];
  onSelectConcept?: (id: string) => void;
}) {
  if (relationships.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-hairline p-8 text-center text-sm text-muted-foreground">
        No relationships of this type.
      </div>
    );
  }
  return (
    <ul className="grid gap-2">
      {relationships.map((r) => (
        <li
          key={r.id}
          className="grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-3 rounded-xl border border-hairline bg-background/60 p-4"
        >
          <button
            type="button"
            onClick={() => onSelectConcept?.(r.sourceId)}
            className="truncate text-right text-sm font-medium text-foreground hover:text-teal"
          >
            {r.sourceLabel}
          </button>
          <div className="flex items-center gap-2">
            <span
              className={cn(
                "rounded-full px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.18em]",
                REL_TONE[r.type],
              )}
            >
              {REL_LABEL[r.type]}
            </span>
            <ArrowRight className="h-3 w-3 text-muted-foreground" />
          </div>
          <button
            type="button"
            onClick={() => onSelectConcept?.(r.targetId)}
            className="truncate text-left text-sm font-medium text-foreground hover:text-teal"
          >
            {r.targetLabel}
          </button>
        </li>
      ))}
    </ul>
  );
}
