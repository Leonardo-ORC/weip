/**
 * KnowledgeGraphStore — subscribable in-memory graph store.
 *
 * Nodes and edges are keyed by canonical id. Upserts merge provenance,
 * aliases and confidence rather than overwriting. Every mutation bumps
 * the snapshot version and notifies listeners so React hooks can
 * rerender without polling.
 */

import type {
  EdgeProvenance,
  GraphEdge,
  GraphEdgeType,
  GraphNode,
  GraphNodeType,
  GraphSnapshot,
  GraphSubscriptionListener,
} from "../types";
import { GRAPH_ENGINE_VERSION } from "../types";

interface UpsertNodeInput {
  readonly id: string;
  readonly type: GraphNodeType;
  readonly label: string;
  readonly canonicalKey: string;
  readonly aliases?: readonly string[];
  readonly evidenceId?: string;
  readonly confidence?: number;
  readonly meta?: GraphNode["meta"];
}

interface UpsertEdgeInput {
  readonly id: string;
  readonly type: GraphEdgeType;
  readonly sourceId: string;
  readonly targetId: string;
  readonly confidence: number;
  readonly provenance: EdgeProvenance;
}

const nodes = new Map<string, GraphNode>();
const edges = new Map<string, GraphEdge>();
const listeners = new Set<GraphSubscriptionListener>();
let version = 0;
let builtAt = new Date(0).toISOString();

function nowIso(): string {
  return new Date().toISOString();
}

function bumpVersion(): void {
  version += 1;
  builtAt = nowIso();
}

function emit(): void {
  const snap = KnowledgeGraphStore.snapshot();
  for (const l of Array.from(listeners)) l(snap);
}

function recomputeDegrees(): void {
  const counts = new Map<string, number>();
  for (const edge of edges.values()) {
    counts.set(edge.sourceId, (counts.get(edge.sourceId) ?? 0) + 1);
    counts.set(edge.targetId, (counts.get(edge.targetId) ?? 0) + 1);
  }
  for (const [id, node] of nodes) {
    const degree = counts.get(id) ?? 0;
    if (degree !== node.degree) nodes.set(id, { ...node, degree });
  }
}

function dedupe<T>(items: readonly T[]): T[] {
  return Array.from(new Set(items));
}

export const KnowledgeGraphStore = {
  engineVersion: GRAPH_ENGINE_VERSION,

  subscribe(listener: GraphSubscriptionListener): () => void {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },

  snapshot(): GraphSnapshot {
    return {
      nodes: Array.from(nodes.values()),
      edges: Array.from(edges.values()),
      version,
      builtAt,
    };
  },

  getNode(id: string): GraphNode | undefined {
    return nodes.get(id);
  },

  getEdge(id: string): GraphEdge | undefined {
    return edges.get(id);
  },

  nodes(): readonly GraphNode[] {
    return Array.from(nodes.values());
  },

  edges(): readonly GraphEdge[] {
    return Array.from(edges.values());
  },

  upsertNode(input: UpsertNodeInput): GraphNode {
    const existing = nodes.get(input.id);
    const now = nowIso();
    if (!existing) {
      const node: GraphNode = {
        id: input.id,
        type: input.type,
        label: input.label,
        canonicalKey: input.canonicalKey,
        aliases: dedupe(input.aliases ?? []),
        evidenceIds: input.evidenceId ? [input.evidenceId] : [],
        degree: 0,
        confidence: input.confidence ?? 0.6,
        createdAt: now,
        updatedAt: now,
        meta: input.meta,
      };
      nodes.set(node.id, node);
      return node;
    }
    const merged: GraphNode = {
      ...existing,
      label: existing.label.length >= input.label.length ? existing.label : input.label,
      aliases: dedupe([...existing.aliases, ...(input.aliases ?? []), existing.label !== input.label ? input.label : ""].filter(Boolean)),
      evidenceIds: input.evidenceId
        ? dedupe([...existing.evidenceIds, input.evidenceId])
        : existing.evidenceIds,
      confidence: Math.max(existing.confidence, input.confidence ?? 0),
      updatedAt: now,
      meta: { ...existing.meta, ...input.meta },
    };
    nodes.set(merged.id, merged);
    return merged;
  },

  upsertEdge(input: UpsertEdgeInput): GraphEdge {
    const existing = edges.get(input.id);
    const now = nowIso();
    if (!existing) {
      const edge: GraphEdge = {
        id: input.id,
        type: input.type,
        sourceId: input.sourceId,
        targetId: input.targetId,
        confidence: input.confidence,
        weight: 1,
        provenance: [input.provenance],
        createdAt: now,
        updatedAt: now,
      };
      edges.set(edge.id, edge);
      return edge;
    }
    const provenance = existing.provenance.some(
      (p) =>
        p.evidenceId === input.provenance.evidenceId &&
        p.source === input.provenance.source,
    )
      ? existing.provenance
      : [...existing.provenance, input.provenance].slice(-25);
    const merged: GraphEdge = {
      ...existing,
      confidence: Math.max(existing.confidence, input.confidence),
      weight: existing.weight + 1,
      provenance,
      updatedAt: now,
    };
    edges.set(merged.id, merged);
    return merged;
  },

  removeEvidence(evidenceId: string): void {
    let changed = false;
    for (const [id, edge] of edges) {
      const filtered = edge.provenance.filter((p) => p.evidenceId !== evidenceId);
      if (filtered.length === 0 && edge.provenance.length > 0) {
        edges.delete(id);
        changed = true;
      } else if (filtered.length !== edge.provenance.length) {
        edges.set(id, { ...edge, provenance: filtered, weight: filtered.length || 1 });
        changed = true;
      }
    }
    for (const [id, node] of nodes) {
      if (node.evidenceIds.includes(evidenceId)) {
        const evidenceIds = node.evidenceIds.filter((e) => e !== evidenceId);
        nodes.set(id, { ...node, evidenceIds });
        changed = true;
      }
    }
    if (changed) {
      this.commit();
    }
  },

  commit(): void {
    recomputeDegrees();
    bumpVersion();
    emit();
  },

  clear(): void {
    if (nodes.size === 0 && edges.size === 0) return;
    nodes.clear();
    edges.clear();
    this.commit();
  },
};

export type IKnowledgeGraphStore = typeof KnowledgeGraphStore;
