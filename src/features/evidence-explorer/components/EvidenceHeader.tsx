import { Database } from "lucide-react";
import type { EvidenceMetric } from "../types";

export function EvidenceHeader({ overview }: { overview: { total: number; clinicalTrials: number } }) {
  return (
    <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
      <span className="inline-flex items-center gap-2 rounded-full border border-hairline bg-background/60 px-3 py-1">
        <Database className="h-3.5 w-3.5 text-teal" />
        <span className="font-mono uppercase tracking-[0.18em]">Evidence · v0.1</span>
      </span>
      <span className="font-mono uppercase tracking-[0.18em]">{overview.total} objects</span>
      <span className="font-mono uppercase tracking-[0.18em]">{overview.clinicalTrials} trials</span>
      <span className="font-mono uppercase tracking-[0.18em]">Mock dataset</span>
    </div>
  );
}

export function EvidenceMetricCard({ metric }: { metric: EvidenceMetric }) {
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
