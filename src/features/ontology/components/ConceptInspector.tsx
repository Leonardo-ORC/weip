import { useMemo } from "react";
import type { Concept, ConceptRelationship } from "../types";
import { CONCEPTS } from "../mock";
import { OntologyStatusBadge } from "./OntologyHeader";
import { ArrowRight } from "lucide-react";

const REL_LABEL: Record<string, string> = {
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

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
        {title}
      </div>
      <div className="mt-2 text-sm text-foreground">{children}</div>
    </div>
  );
}

function Chips({ items }: { items: string[] }) {
  if (items.length === 0) return <span className="text-xs text-muted-foreground">None</span>;
  return (
    <div className="flex flex-wrap gap-1.5">
      {items.map((i) => (
        <span
          key={i}
          className="rounded-full border border-hairline px-2 py-0.5 text-[11px] text-muted-foreground"
        >
          {i}
        </span>
      ))}
    </div>
  );
}

export function ConceptInspector({
  concept,
  onSelectConcept,
}: {
  concept?: Concept;
  onSelectConcept?: (id: string) => void;
}) {
  const children = useMemo(
    () => (concept ? CONCEPTS.filter((c) => concept.childrenIds.includes(c.id)) : []),
    [concept],
  );
  const parent = useMemo(
    () => (concept?.parentId ? CONCEPTS.find((c) => c.id === concept.parentId) : undefined),
    [concept],
  );

  if (!concept) {
    return (
      <div className="rounded-2xl border border-dashed border-hairline p-8 text-center text-sm text-muted-foreground">
        Select a concept to inspect its semantic details.
      </div>
    );
  }

  return (
    <aside
      aria-label="Concept inspector"
      className="sticky top-6 flex flex-col gap-6 rounded-2xl border border-hairline bg-background/70 p-6"
    >
      <div>
        <div className="flex items-start justify-between gap-3">
          <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
            {concept.category}
          </span>
          <OntologyStatusBadge status={concept.status} />
        </div>
        <h3 className="font-display mt-2 text-2xl tracking-tight text-foreground">
          {concept.preferredLabel}
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{concept.description}</p>
      </div>

      <div className="grid gap-5">
        <Section title="Aliases"><Chips items={concept.aliases} /></Section>
        <Section title="Synonyms"><Chips items={concept.synonyms} /></Section>

        <Section title="Parent">
          {parent ? (
            <button
              type="button"
              onClick={() => onSelectConcept?.(parent.id)}
              className="inline-flex items-center gap-1 text-foreground hover:text-teal"
            >
              {parent.preferredLabel} <ArrowRight className="h-3 w-3" />
            </button>
          ) : (
            <span className="text-xs text-muted-foreground">Root concept</span>
          )}
        </Section>

        <Section title="Children">
          {children.length === 0 ? (
            <span className="text-xs text-muted-foreground">Leaf concept</span>
          ) : (
            <ul className="grid gap-1.5">
              {children.map((c) => (
                <li key={c.id}>
                  <button
                    type="button"
                    onClick={() => onSelectConcept?.(c.id)}
                    className="inline-flex items-center gap-1 text-sm text-foreground hover:text-teal"
                  >
                    <ArrowRight className="h-3 w-3" /> {c.preferredLabel}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </Section>

        <Section title="Relationships">
          {concept.relationships.length === 0 ? (
            <span className="text-xs text-muted-foreground">None</span>
          ) : (
            <ul className="grid gap-2">
              {concept.relationships.map((r: ConceptRelationship) => (
                <li key={`${r.type}-${r.targetId}`} className="flex items-center gap-2 text-xs">
                  <span className="rounded-full bg-secondary px-2 py-0.5 font-mono uppercase tracking-[0.18em] text-foreground/80">
                    {REL_LABEL[r.type] ?? r.type}
                  </span>
                  <button
                    type="button"
                    onClick={() => onSelectConcept?.(r.targetId)}
                    className="text-foreground hover:text-teal"
                  >
                    {r.targetLabel}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </Section>

        <Section title="Future external mappings">
          {concept.mappings.length === 0 ? (
            <span className="text-xs text-muted-foreground">No mappings drafted.</span>
          ) : (
            <ul className="grid gap-1.5">
              {concept.mappings.map((m) => (
                <li key={`${m.standard}-${m.code}`} className="flex items-center justify-between text-xs">
                  <span className="font-mono uppercase tracking-[0.18em] text-muted-foreground">
                    {m.standard.replace("_", " ")}
                  </span>
                  <span className="font-mono text-foreground">{m.code}</span>
                </li>
              ))}
            </ul>
          )}
        </Section>
      </div>
    </aside>
  );
}
