import { useEffect, useState } from "react";
import { installEvidenceBridge } from "../bridge/evidence-bridge";
import { KnowledgeGraphService } from "../services/knowledge-graph-service";
import { KnowledgeGraphStore } from "../services/graph-store";
import type { GraphMetrics, GraphSnapshot } from "../types";

function useSnapshot(): GraphSnapshot {
  const [snap, setSnap] = useState<GraphSnapshot>(() => KnowledgeGraphStore.snapshot());
  useEffect(() => {
    installEvidenceBridge();
    setSnap(KnowledgeGraphStore.snapshot());
    return KnowledgeGraphStore.subscribe((s) => setSnap(s));
  }, []);
  return snap;
}

export function useKnowledgeGraph(): {
  snapshot: GraphSnapshot;
  metrics: GraphMetrics;
} {
  const snapshot = useSnapshot();
  return { snapshot, metrics: KnowledgeGraphService.metrics() };
}

export function useKnowledgeMetrics(): GraphMetrics {
  useSnapshot();
  return KnowledgeGraphService.metrics();
}
