import { Link } from "@tanstack/react-router";
import { ArrowRight, Network } from "lucide-react";
import { DashboardWidget } from "@/features/dashboard";
import { ConceptService, OntologyService, VocabularyService } from "../services";
import { OntologyStatusBadge } from "./OntologyHeader";

export function OntologyReadyWidget() {
  const overview = OntologyService.overview();
  const vocabularies = VocabularyService.list().slice(0, 4);
  const recent = ConceptService.recent(5);

  return (
    <DashboardWidget
      eyebrow="Ontology"
      title="Ontology Ready"
      subtitle="Vocabularies, concepts and relationships are live."
      action={
        <Link
          to="/app/ontology"
          className="inline-flex items-center gap-1 rounded-full border border-hairline px-3 py-1 text-xs text-foreground transition hover:bg-secondary"
        >
          Open workspace <ArrowRight className="h-3 w-3" />
        </Link>
      }
    >
      <div className="grid gap-5 lg:grid-cols-3">
        <div className="grid grid-cols-3 gap-3 lg:col-span-3">
          <Stat label="Vocabulary groups" value={overview.vocabularies} />
          <Stat label="Concept registry" value={overview.concepts} />
          <Stat label="Relationship types" value={overview.relationshipTypes} />
        </div>

        <div className="lg:col-span-2">
          <div className="mb-2 font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
            Vocabulary groups
          </div>
          <ul className="grid gap-2 sm:grid-cols-2">
            {vocabularies.map((v) => {
              const Icon = v.icon;
              return (
                <li
                  key={v.id}
                  className="flex items-center gap-2 rounded-lg border border-hairline bg-background/40 p-2.5"
                >
                  <div className="grid h-7 w-7 place-items-center rounded-md bg-secondary text-foreground/80">
                    <Icon className="h-3.5 w-3.5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-xs font-medium text-foreground">{v.name}</div>
                    <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                      {v.conceptCount} concepts
                    </div>
                  </div>
                  <OntologyStatusBadge status={v.status} />
                </li>
              );
            })}
          </ul>
        </div>

        <div>
          <div className="mb-2 font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
            Recent concepts
          </div>
          <ul className="grid gap-1.5">
            {recent.map((c) => (
              <li key={c.id}>
                <Link
                  to="/app/ontology"
                  className="flex items-center gap-2 rounded-md px-2 py-1.5 text-xs text-foreground hover:bg-secondary/60"
                >
                  <Network className="h-3 w-3 text-muted-foreground" />
                  <span className="truncate">{c.preferredLabel}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </DashboardWidget>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl border border-hairline bg-background/40 p-3">
      <div className="font-display text-2xl tracking-tight">{value}</div>
      <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
        {label}
      </div>
    </div>
  );
}
