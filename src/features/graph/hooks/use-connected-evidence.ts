import { useEffect, useState } from "react";
import { installEvidenceBridge } from "../bridge/evidence-bridge";
import { GraphQueryService } from "../services/query";
import { KnowledgeGraphStore } from "../services/graph-store";
import { SemanticIndexService } from "../services/semantic-index";
import type { GraphNode } from "../types";

export function useConnectedConceptsForEvidence(evidenceId: string): readonly GraphNode[] {
  const [tick, setTick] = useState(0);
  useEffect(() => {
    installEvidenceBridge();
    return KnowledgeGraphStore.subscribe(() => setTick((t) => t + 1));
  }, []);
  void tick;
  const evidenceNodeId = `evidence:${evidenceId}`;
  return SemanticIndexService.neighborsOf(evidenceNodeId).filter((n) => n.type !== "evidence");
}

export function useNeighborEvidence(evidenceId: string, limit = 6): readonly GraphNode[] {
  const [tick, setTick] = useState(0);
  useEffect(() => {
    installEvidenceBridge();
    return KnowledgeGraphStore.subscribe(() => setTick((t) => t + 1));
  }, []);
  void tick;
  return GraphQueryService.neighborEvidenceForEvidence(evidenceId, limit);
}
