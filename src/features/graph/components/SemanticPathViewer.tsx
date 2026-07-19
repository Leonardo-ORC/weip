import { ArrowRight } from "lucide-react";
import type { SemanticPath } from "../types";
import { EdgeTypeBadge, NodeTypeBadge } from "./GraphBadges";

export function SemanticPathViewer({ path }: { path: SemanticPath | null }) {
  if (!path) {
    return (
      <div className="rounded-xl border border-dashed border-hairline bg-background/60 p-4 text-xs text-muted-foreground">
        No semantic path found.
      </div>
    );
  }
  return (
    <div className="flex flex-wrap items-center gap-2 rounded-xl border border-hairline bg-background/60 p-4">
      {path.nodes.map((node, i) => (
        <div key={node.id} className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-hairline bg-background px-2 py-0.5 text-[11px]">
            <NodeTypeBadge type={node.type} />
            {node.label}
          </span>
          {i < path.edges.length ? (
            <span className="flex items-center gap-1">
              <ArrowRight className="h-3 w-3 text-muted-foreground" />
              <EdgeTypeBadge type={path.edges[i].type} />
            </span>
          ) : null}
        </div>
      ))}
    </div>
  );
}
