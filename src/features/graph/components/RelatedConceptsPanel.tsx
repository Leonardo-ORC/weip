import { GraphQueryService } from "../services/query";
import { useConnectedConceptsForEvidence, useNeighborEvidence } from "../hooks/use-connected-evidence";
import { NodeTypeBadge } from "./GraphBadges";

export function RelatedConceptsPanel({ evidenceId }: { evidenceId: string }) {
  const concepts = useConnectedConceptsForEvidence(evidenceId);
  const neighbors = useNeighborEvidence(evidenceId, 6);
  if (concepts.length === 0 && neighbors.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-hairline bg-background/60 p-4 text-xs text-muted-foreground">
        This evidence is not yet connected to the knowledge graph. It will appear here after ingestion.
      </div>
    );
  }
  return (
    <div className="flex flex-col gap-4 rounded-xl border border-hairline bg-background/60 p-4">
      <div>
        <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">Connected concepts</div>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {concepts.length === 0 ? (
            <span className="text-xs text-muted-foreground">No linked concepts yet.</span>
          ) : (
            concepts.map((n) => (
              <span key={n.id} className="inline-flex items-center gap-1.5 rounded-full border border-hairline bg-background px-2 py-0.5 text-[11px] text-foreground">
                <NodeTypeBadge type={n.type} />
                {n.label}
              </span>
            ))
          )}
        </div>
      </div>
      <div>
        <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">Neighbor evidence</div>
        {neighbors.length === 0 ? (
          <div className="mt-2 text-xs text-muted-foreground">No semantically adjacent evidence yet.</div>
        ) : (
          <ul className="mt-2 flex flex-col gap-1.5">
            {neighbors.map((n) => (
              <li key={n.id} className="truncate rounded-md border border-hairline bg-background px-2.5 py-1.5 text-xs text-foreground">
                {n.label}
              </li>
            ))}
          </ul>
        )}
      </div>
      <MostConnectedShared />
    </div>
  );
}

function MostConnectedShared() {
  const top = GraphQueryService.nodes({ types: ["drug", "condition", "hormone", "biomarker", "womens-health-concept"], limit: 6 });
  if (top.length === 0) return null;
  return (
    <div>
      <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">Hubs in the graph</div>
      <div className="mt-2 flex flex-wrap gap-1.5">
        {top.map((n) => (
          <span key={n.id} className="inline-flex items-center gap-1 rounded-full border border-hairline bg-background px-2 py-0.5 text-[11px] text-muted-foreground">
            {n.label}
            <span className="text-[9px]">·{n.degree}</span>
          </span>
        ))}
      </div>
    </div>
  );
}
