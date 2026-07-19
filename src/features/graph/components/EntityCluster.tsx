import type { GraphNode, GraphNodeType } from "../types";
import { NODE_TYPE_LABEL } from "./GraphBadges";

export function EntityCluster({
  nodes,
  onSelect,
  activeId,
}: {
  nodes: readonly GraphNode[];
  activeId?: string | null;
  onSelect?: (node: GraphNode) => void;
}) {
  const byType = new Map<GraphNodeType, GraphNode[]>();
  for (const n of nodes) {
    if (n.type === "evidence") continue;
    const arr = byType.get(n.type) ?? [];
    arr.push(n);
    byType.set(n.type, arr);
  }
  const groups = Array.from(byType.entries()).sort((a, b) => b[1].length - a[1].length);
  if (groups.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-hairline p-6 text-center text-sm text-muted-foreground">
        Clusters will appear here as evidence is ingested.
      </div>
    );
  }
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {groups.map(([type, items]) => (
        <div key={type} className="rounded-xl border border-hairline bg-background/60 p-4">
          <div className="flex items-center justify-between">
            <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
              {NODE_TYPE_LABEL[type]}
            </div>
            <span className="text-[10px] text-muted-foreground">{items.length}</span>
          </div>
          <ul className="mt-3 flex flex-col gap-1.5">
            {items.slice(0, 8).map((n) => (
              <li key={n.id}>
                <button
                  type="button"
                  onClick={() => onSelect?.(n)}
                  className={
                    "flex w-full items-center justify-between rounded-md border border-transparent px-2 py-1 text-left text-xs transition hover:border-hairline hover:bg-secondary " +
                    (n.id === activeId ? "border-primary/40 bg-primary/5 text-primary" : "text-foreground")
                  }
                >
                  <span className="truncate">{n.label}</span>
                  <span className="ml-2 text-[10px] text-muted-foreground">·{n.degree}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
