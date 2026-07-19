/**
 * GraphQueryService — declarative reads over the knowledge graph.
 */

import type {
  GraphEdge,
  GraphEdgeType,
  GraphNode,
  GraphNodeType,
} from "../types";
import { KnowledgeGraphStore } from "./graph-store";
import { SemanticIndexService } from "./semantic-index";

export interface NodeQuery {
  readonly types?: readonly GraphNodeType[];
  readonly minDegree?: number;
  readonly minConfidence?: number;
  readonly search?: string;
  readonly limit?: number;
}

export interface EdgeQuery {
  readonly types?: readonly GraphEdgeType[];
  readonly nodeId?: string;
  readonly minConfidence?: number;
  readonly limit?: number;
}

export const GraphQueryService = {
  nodes(query: NodeQuery = {}): readonly GraphNode[] {
    const snap = KnowledgeGraphStore.snapshot();
    const search = query.search?.trim().toLowerCase();
    const filtered = snap.nodes.filter((n) => {
      if (query.types && !query.types.includes(n.type)) return false;
      if (typeof query.minDegree === "number" && n.degree < query.minDegree) return false;
      if (typeof query.minConfidence === "number" && n.confidence < query.minConfidence) return false;
      if (search && !n.label.toLowerCase().includes(search) && !n.canonicalKey.includes(search)) return false;
      return true;
    });
    const sorted = filtered.slice().sort((a, b) => b.degree - a.degree || b.confidence - a.confidence);
    return typeof query.limit === "number" ? sorted.slice(0, query.limit) : sorted;
  },

  edges(query: EdgeQuery = {}): readonly GraphEdge[] {
    const snap = KnowledgeGraphStore.snapshot();
    const filtered = snap.edges.filter((e) => {
      if (query.types && !query.types.includes(e.type)) return false;
      if (query.nodeId && e.sourceId !== query.nodeId && e.targetId !== query.nodeId) return false;
      if (typeof query.minConfidence === "number" && e.confidence < query.minConfidence) return false;
      return true;
    });
    const sorted = filtered.slice().sort((a, b) => b.weight - a.weight);
    return typeof query.limit === "number" ? sorted.slice(0, query.limit) : sorted;
  },

  relatedConcepts(nodeId: string, limit = 12): readonly GraphNode[] {
    const neighbors = SemanticIndexService.neighborsOf(nodeId).filter(
      (n) => n.type !== "evidence",
    );
    return neighbors.slice(0, limit);
  },

  connectedEvidence(nodeId: string, limit = 20): readonly GraphNode[] {
    const neighbors = SemanticIndexService.neighborsOf(nodeId).filter(
      (n) => n.type === "evidence",
    );
    return neighbors.slice(0, limit);
  },

  neighborEvidenceForEvidence(evidenceId: string, limit = 8): readonly GraphNode[] {
    const evidenceNodeId = `evidence:${evidenceId}`;
    const conceptNeighbors = SemanticIndexService.neighborsOf(evidenceNodeId).filter(
      (n) => n.type !== "evidence",
    );
    const seen = new Set<string>([evidenceNodeId]);
    const out: GraphNode[] = [];
    for (const concept of conceptNeighbors) {
      const evidences = SemanticIndexService.neighborsOf(concept.id).filter(
        (n) => n.type === "evidence" && !seen.has(n.id),
      );
      for (const ev of evidences) {
        seen.add(ev.id);
        out.push(ev);
        if (out.length >= limit) return out;
      }
    }
    return out;
  },
};

export type IGraphQueryService = typeof GraphQueryService;
