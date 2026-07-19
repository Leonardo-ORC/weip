import { Network } from "lucide-react";
import { cn } from "@/lib/utils";
import type { OntologyMetric, OntologyStatus } from "../types";

const STATUS_TONE: Record<OntologyStatus, string> = {
  active: "bg-teal/15 text-teal",
  draft: "bg-accent/15 text-accent",
  planned: "bg-muted text-muted-foreground",
  deprecated: "bg-destructive/10 text-destructive",
};

const STATUS_LABEL: Record<OntologyStatus, string> = {
  active: "Active",
  draft: "Draft",
  planned: "Planned",
  deprecated: "Deprecated",
};

export function OntologyStatusBadge({ status, className }: { status: OntologyStatus; className?: string }) {
  return (
    <span
      className={cn(
        "shrink-0 rounded-full px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.18em]",
        STATUS_TONE[status],
        className,
      )}
    >
      {STATUS_LABEL[status]}
    </span>
  );
}

export function OntologyHeader({ overview }: { overview: { concepts: number; vocabularies: number } }) {
  return (
    <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
      <span className="inline-flex items-center gap-2 rounded-full border border-hairline bg-background/60 px-3 py-1">
        <Network className="h-3.5 w-3.5 text-teal" />
        <span className="font-mono uppercase tracking-[0.18em]">Ontology · v0.1</span>
      </span>
      <span className="font-mono uppercase tracking-[0.18em]">{overview.concepts} concepts</span>
      <span className="font-mono uppercase tracking-[0.18em]">{overview.vocabularies} vocabularies</span>
      <span className="font-mono uppercase tracking-[0.18em]">Mock dataset</span>
    </div>
  );
}

export function SemanticMetric({ metric }: { metric: OntologyMetric }) {
  const Icon = metric.icon;
  return (
    <div className="rounded-2xl border border-hairline bg-background/60 p-5">
      <div className="flex items-center justify-between">
        <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
          {metric.label}
        </span>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </div>
      <div className="font-display mt-4 text-3xl tracking-tight">{metric.value}</div>
      {metric.hint ? <p className="mt-1 text-xs text-muted-foreground">{metric.hint}</p> : null}
    </div>
  );
}
