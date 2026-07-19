import { Activity, GitBranch, Network, ShieldCheck, Sparkles, Waves } from "lucide-react";
import type { GraphMetrics } from "../types";

function Metric({ label, value, hint, Icon }: { label: string; value: string; hint?: string; Icon: typeof Activity }) {
  return (
    <div className="rounded-xl border border-hairline bg-background/60 p-4">
      <div className="flex items-center justify-between">
        <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">{label}</div>
        <Icon className="h-3.5 w-3.5 text-muted-foreground" />
      </div>
      <div className="font-display mt-2 text-2xl tracking-tight text-foreground">{value}</div>
      {hint ? <div className="mt-1 text-xs text-muted-foreground">{hint}</div> : null}
    </div>
  );
}

export function KnowledgeMetrics({ metrics }: { metrics: GraphMetrics }) {
  const coveragePct = (metrics.coverage * 100).toFixed(0) + "%";
  const density = (metrics.density * 100).toFixed(2) + "%";
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
      <Metric label="Nodes" value={String(metrics.nodeCount)} hint="Semantic entities" Icon={Network} />
      <Metric label="Relationships" value={String(metrics.edgeCount)} hint="Typed edges" Icon={GitBranch} />
      <Metric label="Evidence" value={String(metrics.evidenceCount)} hint="Connected objects" Icon={Sparkles} />
      <Metric label="Women's health" value={String(metrics.womensHealthCount)} hint="Concept coverage" Icon={Activity} />
      <Metric label="Coverage" value={coveragePct} hint="Evidence with ≥1 edge" Icon={ShieldCheck} />
      <Metric label="Density" value={density} hint="Graph connectivity" Icon={Waves} />
    </div>
  );
}
