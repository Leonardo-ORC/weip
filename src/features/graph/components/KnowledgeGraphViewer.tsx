import { useMemo } from "react";
import { cn } from "@/lib/utils";
import type { GraphEdge, GraphNode, GraphSnapshot } from "../types";
import { NODE_TYPE_LABEL } from "./GraphBadges";

interface Props {
  snapshot: GraphSnapshot;
  activeNodeId?: string | null;
  onSelect?: (node: GraphNode) => void;
  maxNodes?: number;
  height?: number;
}

interface Positioned {
  node: GraphNode;
  x: number;
  y: number;
}

const RADIUS_INNER = 90;
const RADIUS_OUTER = 220;

const TYPE_COLOR: Record<string, string> = {
  evidence: "#4f46e5",
  drug: "#6366f1",
  disease: "#e11d48",
  condition: "#d97706",
  hormone: "#0d9488",
  biomarker: "#059669",
  "womens-health-concept": "#db2777",
  "clinical-outcome": "#0d9488",
  gene: "#7c3aed",
  protein: "#a21caf",
  symptom: "#ea580c",
  procedure: "#0284c7",
  "lab-test": "#0891b2",
  project: "#525252",
  collection: "#525252",
  "research-question": "#525252",
  hypothesis: "#525252",
};

/**
 * Deterministic radial layout — inner ring holds evidence hubs, outer
 * ring holds concepts. Purely SVG so it is SSR-safe.
 */
export function KnowledgeGraphViewer({
  snapshot,
  activeNodeId,
  onSelect,
  maxNodes = 60,
  height = 480,
}: Props) {
  const { positioned, edges } = useMemo(() => {
    const rankedEvidence = snapshot.nodes
      .filter((n) => n.type === "evidence")
      .sort((a, b) => b.degree - a.degree)
      .slice(0, 12);
    const rankedConcepts = snapshot.nodes
      .filter((n) => n.type !== "evidence")
      .sort((a, b) => b.degree - a.degree)
      .slice(0, Math.max(0, maxNodes - rankedEvidence.length));
    const positions: Positioned[] = [];
    const inner = rankedEvidence.length;
    const outer = rankedConcepts.length;
    rankedEvidence.forEach((node, i) => {
      const angle = inner === 0 ? 0 : (i / inner) * Math.PI * 2 - Math.PI / 2;
      positions.push({ node, x: Math.cos(angle) * RADIUS_INNER, y: Math.sin(angle) * RADIUS_INNER });
    });
    rankedConcepts.forEach((node, i) => {
      const angle = outer === 0 ? 0 : (i / outer) * Math.PI * 2 - Math.PI / 2;
      positions.push({ node, x: Math.cos(angle) * RADIUS_OUTER, y: Math.sin(angle) * RADIUS_OUTER });
    });
    const visibleIds = new Set(positions.map((p) => p.node.id));
    const visibleEdges = snapshot.edges.filter((e) => visibleIds.has(e.sourceId) && visibleIds.has(e.targetId));
    return { positioned: positions, edges: visibleEdges };
  }, [snapshot, maxNodes]);

  const nodeById = new Map(positioned.map((p) => [p.node.id, p]));

  if (positioned.length === 0) {
    return (
      <div
        className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-hairline bg-background/60 text-sm text-muted-foreground"
        style={{ height }}
      >
        The knowledge graph is empty. Import evidence from the Sources workspace to populate it.
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-hairline bg-background/60 p-4">
      <svg
        viewBox={`-260 -260 520 520`}
        width="100%"
        style={{ height }}
        role="img"
        aria-label="Knowledge graph visualization"
      >
        <defs>
          <radialGradient id="graph-bg" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="currentColor" stopOpacity="0.05" />
            <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
          </radialGradient>
        </defs>
        <circle r="240" fill="url(#graph-bg)" className="text-primary" />
        <circle r={RADIUS_INNER + 30} fill="none" stroke="currentColor" strokeOpacity="0.06" className="text-foreground" />
        <circle r={RADIUS_OUTER + 20} fill="none" stroke="currentColor" strokeOpacity="0.06" className="text-foreground" />
        {edges.map((edge) => {
          const s = nodeById.get(edge.sourceId);
          const t = nodeById.get(edge.targetId);
          if (!s || !t) return null;
          const isActive = activeNodeId && (edge.sourceId === activeNodeId || edge.targetId === activeNodeId);
          return (
            <line
              key={edge.id}
              x1={s.x}
              y1={s.y}
              x2={t.x}
              y2={t.y}
              stroke={isActive ? "#4f46e5" : "currentColor"}
              strokeOpacity={isActive ? 0.5 : 0.12}
              strokeWidth={isActive ? 1.4 : 0.8}
              className="text-foreground"
            />
          );
        })}
        {positioned.map(({ node, x, y }) => {
          const isActive = node.id === activeNodeId;
          const size = node.type === "evidence" ? 6 : 4 + Math.min(4, node.degree);
          return (
            <g key={node.id} transform={`translate(${x}, ${y})`} className="cursor-pointer" onClick={() => onSelect?.(node)}>
              <circle
                r={size + (isActive ? 3 : 0)}
                fill={TYPE_COLOR[node.type] ?? "#525252"}
                fillOpacity={isActive ? 1 : 0.85}
                stroke="white"
                strokeWidth={isActive ? 2 : 1}
              />
              {node.degree >= 3 || isActive ? (
                <text
                  y={size + 12}
                  textAnchor="middle"
                  className={cn("fill-current text-[9px] font-medium", isActive ? "text-foreground" : "text-muted-foreground")}
                >
                  {node.label.length > 22 ? node.label.slice(0, 20) + "…" : node.label}
                </text>
              ) : null}
            </g>
          );
        })}
      </svg>
      <div className="mt-3 flex flex-wrap gap-3 text-[10px] text-muted-foreground">
        {(["evidence", "drug", "condition", "hormone", "biomarker", "womens-health-concept", "clinical-outcome"] as const).map((t) => (
          <span key={t} className="inline-flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full" style={{ background: TYPE_COLOR[t] }} />
            {NODE_TYPE_LABEL[t]}
          </span>
        ))}
      </div>
    </div>
  );
}
