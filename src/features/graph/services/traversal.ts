/**
 * GraphTraversalService — neighborhoods and shortest semantic paths.
 */

import type { GraphEdge, GraphNeighborhood, GraphNode, SemanticPath } from "../types";
import { KnowledgeGraphStore } from "./graph-store";
import { SemanticIndexService } from "./semantic-index";

export const GraphTraversalService = {
  neighborhood(nodeId: string, depth = 1): GraphNeighborhood | null {
    const center = KnowledgeGraphStore.getNode(nodeId);
    if (!center) return null;
    const index = SemanticIndexService.get();
    const visited = new Set<string>([nodeId]);
    const nodes: GraphNode[] = [center];
    const edges: GraphEdge[] = [];
    let frontier: string[] = [nodeId];
    for (let d = 0; d < depth; d += 1) {
      const next: string[] = [];
      for (const id of frontier) {
        const out = index.edgesBySource.get(id) ?? [];
        const inn = index.edgesByTarget.get(id) ?? [];
        for (const e of [...out, ...inn]) {
          edges.push(e);
          const other = e.sourceId === id ? e.targetId : e.sourceId;
          if (!visited.has(other)) {
            visited.add(other);
            const node = index.nodeById.get(other);
            if (node) {
              nodes.push(node);
              next.push(other);
            }
          }
        }
      }
      frontier = next;
    }
    // Dedupe edges by id
    const seen = new Set<string>();
    const uniqueEdges = edges.filter((e) => {
      if (seen.has(e.id)) return false;
      seen.add(e.id);
      return true;
    });
    return { center, nodes, edges: uniqueEdges, depth };
  },

  shortestPath(sourceId: string, targetId: string, maxDepth = 5): SemanticPath | null {
    if (sourceId === targetId) return null;
    const index = SemanticIndexService.get();
    const prev = new Map<string, { via: GraphEdge; from: string }>();
    const visited = new Set<string>([sourceId]);
    let frontier: string[] = [sourceId];
    for (let d = 0; d < maxDepth; d += 1) {
      const next: string[] = [];
      for (const id of frontier) {
        const out = index.edgesBySource.get(id) ?? [];
        const inn = index.edgesByTarget.get(id) ?? [];
        for (const e of [...out, ...inn]) {
          const other = e.sourceId === id ? e.targetId : e.sourceId;
          if (visited.has(other)) continue;
          visited.add(other);
          prev.set(other, { via: e, from: id });
          if (other === targetId) {
            const edges: GraphEdge[] = [];
            const nodeIds: string[] = [targetId];
            let cursor = targetId;
            while (cursor !== sourceId) {
              const step = prev.get(cursor);
              if (!step) return null;
              edges.unshift(step.via);
              nodeIds.unshift(step.from);
              cursor = step.from;
            }
            const nodes = nodeIds
              .map((n) => index.nodeById.get(n))
              .filter((n): n is GraphNode => Boolean(n));
            const weight = edges.reduce((s, e) => s + (1 / Math.max(0.1, e.confidence)), 0);
            return { nodes, edges, length: edges.length, weight };
          }
          next.push(other);
        }
      }
      frontier = next;
      if (frontier.length === 0) break;
    }
    return null;
  },
};

export type IGraphTraversalService = typeof GraphTraversalService;
