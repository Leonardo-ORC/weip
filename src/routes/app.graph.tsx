import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AppPage } from "@/components/app/app-page";
import {
  EntityCluster,
  KnowledgeGraphViewer,
  KnowledgeMetrics,
  RelationshipInspector,
  SemanticPathViewer,
  useKnowledgeGraph,
} from "@/features/graph";
import {
  GraphTraversalService,
  GraphValidationService,
} from "@/features/graph/services";
import type { GraphNode } from "@/features/graph/types";

export const Route = createFileRoute("/app/graph")({
  head: () => ({
    meta: [
      { title: "Knowledge Graph — WEIP" },
      {
        name: "description",
        content:
          "Live semantic network built from Evidence Objects — biomedical entities, women's health concepts, drugs, conditions and outcomes.",
      },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: KnowledgeGraphPage,
});

function KnowledgeGraphPage() {
  const { snapshot, metrics } = useKnowledgeGraph();
  const [activeId, setActiveId] = useState<string | null>(null);

  const active = useMemo(
    () => snapshot.nodes.find((n) => n.id === activeId) ?? null,
    [snapshot, activeId],
  );

  const validation = useMemo(() => GraphValidationService.validate(), [snapshot.version]);

  const [pathTarget, setPathTarget] = useState<string | null>(null);
  const path = useMemo(() => {
    if (!activeId || !pathTarget || activeId === pathTarget) return null;
    return GraphTraversalService.shortestPath(activeId, pathTarget);
  }, [activeId, pathTarget, snapshot.version]);

  return (
    <AppPage
      breadcrumbs={[{ label: "Workspace", to: "/app/dashboard" }, { label: "Knowledge Graph" }]}
      eyebrow="Knowledge Layer"
      title="Living Knowledge Graph"
      subtitle="Every Evidence Object becomes part of a semantic network — with provenance on every relationship."
    >
      <div className="flex flex-col gap-8">
        <div data-journey-target="graph">
          <KnowledgeMetrics metrics={metrics} />
        </div>

        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_380px]">
          <section className="flex flex-col gap-4">
            <SectionHeader
              eyebrow="Semantic network"
              title="Evidence ↔ Concepts"
              hint={`v${snapshot.version} · ${new Date(snapshot.builtAt).toLocaleTimeString()}`}
            />
            <KnowledgeGraphViewer
              snapshot={snapshot}
              activeNodeId={activeId}
              onSelect={(node) => {
                if (activeId && activeId !== node.id) setPathTarget(node.id);
                setActiveId(node.id);
              }}
            />
            {path ? (
              <div>
                <SectionHeader eyebrow="Semantic path" title="Shortest connection" />
                <SemanticPathViewer path={path} />
              </div>
            ) : null}
          </section>

          <aside className="flex flex-col gap-4">
            <RelationshipInspector node={active} onSelect={(n) => setActiveId(n.id)} />
            <ValidationSummary report={validation} />
          </aside>
        </div>

        <section className="flex flex-col gap-4">
          <SectionHeader
            eyebrow="Entity clusters"
            title="Concept distribution"
            hint="Grouped by node type"
          />
          <EntityCluster
            nodes={snapshot.nodes as GraphNode[]}
            activeId={activeId}
            onSelect={(n) => setActiveId(n.id)}
          />
        </section>
      </div>
    </AppPage>
  );
}

function SectionHeader({ eyebrow, title, hint }: { eyebrow: string; title: string; hint?: string }) {
  return (
    <div className="flex items-end justify-between">
      <div>
        <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">{eyebrow}</div>
        <div className="font-display text-base tracking-tight">{title}</div>
      </div>
      {hint ? <div className="font-mono text-[10px] text-muted-foreground">{hint}</div> : null}
    </div>
  );
}

function ValidationSummary({ report }: { report: ReturnType<typeof GraphValidationService.validate> }) {
  const counts = { error: 0, warn: 0, info: 0 } as Record<string, number>;
  for (const i of report.issues) counts[i.severity] = (counts[i.severity] ?? 0) + 1;
  return (
    <div className="rounded-2xl border border-hairline bg-background/60 p-5">
      <div className="flex items-center justify-between">
        <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">Graph validation</div>
        <span className={"text-[10px] " + (report.passed ? "text-emerald-600" : "text-amber-600")}>
          {report.passed ? "Passed" : "Attention"}
        </span>
      </div>
      <div className="font-display mt-2 text-xl tracking-tight">{(report.score * 100).toFixed(0)}%</div>
      <div className="mt-3 grid grid-cols-3 gap-2 text-xs text-muted-foreground">
        <div className="rounded-md border border-hairline bg-background px-2 py-1.5">
          <div className="text-[10px] uppercase tracking-widest">Errors</div>
          <div className="text-sm text-foreground">{counts.error}</div>
        </div>
        <div className="rounded-md border border-hairline bg-background px-2 py-1.5">
          <div className="text-[10px] uppercase tracking-widest">Warnings</div>
          <div className="text-sm text-foreground">{counts.warn}</div>
        </div>
        <div className="rounded-md border border-hairline bg-background px-2 py-1.5">
          <div className="text-[10px] uppercase tracking-widest">Info</div>
          <div className="text-sm text-foreground">{counts.info}</div>
        </div>
      </div>
    </div>
  );
}
