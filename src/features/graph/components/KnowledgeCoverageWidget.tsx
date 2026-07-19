import { Link } from "@tanstack/react-router";
import { Activity, ArrowRight, GitBranch, Network } from "lucide-react";
import { DashboardWidget } from "@/features/dashboard/components/widget";
import { useKnowledgeMetrics } from "../hooks/use-knowledge-graph";

export function KnowledgeCoverageWidget() {
  const metrics = useKnowledgeMetrics();
  const coverage = (metrics.coverage * 100).toFixed(0);
  return (
    <DashboardWidget
      eyebrow="Knowledge Graph"
      title="Semantic coverage"
      subtitle="Live view of the graph built from Evidence Objects."
      action={
        <Link
          to="/app/graph"
          className="inline-flex items-center gap-1 rounded-full border border-hairline px-3 py-1 text-xs text-foreground transition hover:bg-secondary"
        >
          Open graph <ArrowRight className="h-3 w-3" />
        </Link>
      }
    >
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Cell icon={Network} label="Nodes" value={String(metrics.nodeCount)} hint={`${metrics.conceptCount} concepts`} />
        <Cell icon={GitBranch} label="Relationships" value={String(metrics.edgeCount)} hint={`avg degree ${metrics.avgDegree.toFixed(1)}`} />
        <Cell icon={Activity} label="Women's health" value={String(metrics.womensHealthCount)} hint="Concept coverage" />
        <Cell icon={Network} label="Coverage" value={`${coverage}%`} hint="Evidence with ≥1 edge" />
      </div>
    </DashboardWidget>
  );
}

function Cell({ icon: Icon, label, value, hint }: { icon: typeof Activity; label: string; value: string; hint: string }) {
  return (
    <div className="rounded-xl border border-hairline bg-background/60 p-4">
      <div className="flex items-center justify-between">
        <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">{label}</div>
        <Icon className="h-3.5 w-3.5 text-muted-foreground" />
      </div>
      <div className="font-display mt-1 text-xl tracking-tight text-foreground">{value}</div>
      <div className="mt-1 text-xs text-muted-foreground">{hint}</div>
    </div>
  );
}
