import { KnowledgeGraphService } from "../services/knowledge-graph-service";
import { SemanticIndexService } from "../services/semantic-index";
import type { GraphNode } from "../types";
import { EdgeTypeBadge, NodeTypeBadge } from "./GraphBadges";

interface Props {
  node: GraphNode | null;
  onSelect?: (node: GraphNode) => void;
}

export function RelationshipInspector({ node, onSelect }: Props) {
  if (!node) {
    return (
      <div className="rounded-2xl border border-dashed border-hairline bg-background/60 p-6 text-sm text-muted-foreground">
        Select a node to inspect its semantic neighborhood.
      </div>
    );
  }
  const index = SemanticIndexService.get();
  const outgoing = index.edgesBySource.get(node.id) ?? [];
  const incoming = index.edgesByTarget.get(node.id) ?? [];
  const evidenceCount = node.evidenceIds.length;
  const validation = KnowledgeGraphService.validation.validate();
  const nodeIssues = validation.issues.filter((i) => i.nodeId === node.id);

  return (
    <div className="flex flex-col gap-5 rounded-2xl border border-hairline bg-background/60 p-5">
      <div>
        <div className="flex flex-wrap items-center gap-2">
          <NodeTypeBadge type={node.type} />
          <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
            {node.canonicalKey}
          </span>
        </div>
        <h3 className="font-display mt-2 text-lg leading-tight tracking-tight">{node.label}</h3>
        <div className="mt-2 flex flex-wrap gap-3 text-xs text-muted-foreground">
          <span>Degree {node.degree}</span>
          <span>Confidence {(node.confidence * 100).toFixed(0)}%</span>
          <span>Evidence {evidenceCount}</span>
        </div>
      </div>

      {node.meta?.summary ? (
        <p className="text-sm text-muted-foreground">{node.meta.summary}</p>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-2">
        <NeighborList
          title="Outgoing"
          items={outgoing.map((e) => ({
            id: e.id,
            type: e.type,
            confidence: e.confidence,
            other: index.nodeById.get(e.targetId),
          }))}
          onSelect={onSelect}
        />
        <NeighborList
          title="Incoming"
          items={incoming.map((e) => ({
            id: e.id,
            type: e.type,
            confidence: e.confidence,
            other: index.nodeById.get(e.sourceId),
          }))}
          onSelect={onSelect}
        />
      </div>

      {nodeIssues.length > 0 ? (
        <div className="rounded-xl border border-amber-500/30 bg-amber-500/5 p-3 text-xs text-amber-800 dark:text-amber-300">
          <div className="font-medium">Validation notes</div>
          <ul className="mt-1 list-disc pl-4">
            {nodeIssues.map((i) => (
              <li key={i.code + i.message}>{i.message}</li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}

function NeighborList({
  title,
  items,
  onSelect,
}: {
  title: string;
  items: readonly { id: string; type: string; confidence: number; other?: GraphNode }[];
  onSelect?: (node: GraphNode) => void;
}) {
  return (
    <div>
      <div className="mb-2 font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">{title}</div>
      {items.length === 0 ? (
        <div className="text-xs text-muted-foreground">No connections.</div>
      ) : (
        <ul className="flex flex-col gap-2">
          {items.slice(0, 8).map((item) => (
            <li key={item.id}>
              <button
                type="button"
                onClick={() => item.other && onSelect?.(item.other)}
                className="group flex w-full items-center justify-between rounded-lg border border-hairline bg-background px-3 py-2 text-left transition hover:border-primary/30 hover:bg-primary/5"
              >
                <span className="flex items-center gap-2">
                  <EdgeTypeBadge type={item.type as never} />
                  <span className="truncate text-xs text-foreground">
                    {item.other?.label ?? "Missing node"}
                  </span>
                </span>
                <span className="text-[10px] text-muted-foreground">{(item.confidence * 100).toFixed(0)}%</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
