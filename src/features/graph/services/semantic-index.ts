/**
 * SemanticIndexService — read-optimized lookups over the graph store.
 * Recomputed lazily on demand from the store snapshot.
 */

import type { GraphEdge, GraphNode, GraphNodeType } from "../types";
import { KnowledgeGraphStore } from "./graph-store";

export interface SemanticIndex {
  readonly nodeById: ReadonlyMap<string, GraphNode>;
  readonly nodesByType: ReadonlyMap<GraphNodeType, readonly GraphNode[]>;
  readonly edgesBySource: ReadonlyMap<string, readonly GraphEdge[]>;
  readonly edgesByTarget: ReadonlyMap<string, readonly GraphEdge[]>;
  readonly nodesByEvidence: ReadonlyMap<string, readonly GraphNode[]>;
  readonly labelIndex: ReadonlyMap<string, GraphNode>;
  readonly version: number;
}

let cache: SemanticIndex | null = null;
let cacheVersion = -1;

function build(): SemanticIndex {
  const snap = KnowledgeGraphStore.snapshot();
  const nodeById = new Map<string, GraphNode>();
  const nodesByType = new Map<GraphNodeType, GraphNode[]>();
  const nodesByEvidence = new Map<string, GraphNode[]>();
  const labelIndex = new Map<string, GraphNode>();
  for (const n of snap.nodes) {
    nodeById.set(n.id, n);
    const arr = nodesByType.get(n.type) ?? [];
    arr.push(n);
    nodesByType.set(n.type, arr);
    for (const evId of n.evidenceIds) {
      const list = nodesByEvidence.get(evId) ?? [];
      list.push(n);
      nodesByEvidence.set(evId, list);
    }
    labelIndex.set(n.canonicalKey, n);
    for (const alias of n.aliases) {
      labelIndex.set(alias.toLowerCase(), n);
    }
  }
  const edgesBySource = new Map<string, GraphEdge[]>();
  const edgesByTarget = new Map<string, GraphEdge[]>();
  for (const e of snap.edges) {
    const s = edgesBySource.get(e.sourceId) ?? [];
    s.push(e);
    edgesBySource.set(e.sourceId, s);
    const t = edgesByTarget.get(e.targetId) ?? [];
    t.push(e);
    edgesByTarget.set(e.targetId, t);
  }
  return {
    nodeById,
    nodesByType: nodesByType as ReadonlyMap<GraphNodeType, readonly GraphNode[]>,
    edgesBySource: edgesBySource as ReadonlyMap<string, readonly GraphEdge[]>,
    edgesByTarget: edgesByTarget as ReadonlyMap<string, readonly GraphEdge[]>,
    nodesByEvidence: nodesByEvidence as ReadonlyMap<string, readonly GraphNode[]>,
    labelIndex,
    version: snap.version,
  };
}

export const SemanticIndexService = {
  get(): SemanticIndex {
    const currentVersion = KnowledgeGraphStore.snapshot().version;
    if (!cache || cacheVersion !== currentVersion) {
      cache = build();
      cacheVersion = currentVersion;
    }
    return cache;
  },
  invalidate(): void {
    cache = null;
    cacheVersion = -1;
  },
  findByLabel(label: string): GraphNode | undefined {
    const index = this.get();
    return index.labelIndex.get(label.toLowerCase());
  },
  neighborsOf(nodeId: string): readonly GraphNode[] {
    const index = this.get();
    const out = index.edgesBySource.get(nodeId) ?? [];
    const inn = index.edgesByTarget.get(nodeId) ?? [];
    const set = new Set<string>();
    for (const e of out) set.add(e.targetId);
    for (const e of inn) set.add(e.sourceId);
    return Array.from(set)
      .map((id) => index.nodeById.get(id))
      .filter((n): n is GraphNode => Boolean(n));
  },
  nodesForEvidence(evidenceId: string): readonly GraphNode[] {
    return this.get().nodesByEvidence.get(evidenceId) ?? [];
  },
};

export type ISemanticIndexService = typeof SemanticIndexService;
