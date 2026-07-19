/**
 * KnowledgeGraphService — public facade for the graph engine.
 */

import type { EvidenceObject } from "@/features/evidence-explorer";
import type {
  GraphMetrics,
  GraphEdgeType,
  GraphNodeType,
  GraphSnapshot,
} from "../types";
import { GRAPH_ENGINE_VERSION } from "../types";
import { KnowledgeGraphBuilder } from "./graph-builder";
import { KnowledgeGraphStore } from "./graph-store";
import { GraphQueryService } from "./query";
import { GraphTraversalService } from "./traversal";
import { GraphValidationService } from "./validation";
import { SemanticIndexService } from "./semantic-index";

const EMPTY_NODES: Readonly<Record<GraphNodeType, number>> = {
  evidence: 0,
  disease: 0,
  condition: 0,
  hormone: 0,
  drug: 0,
  biomarker: 0,
  symptom: 0,
  procedure: 0,
  "lab-test": 0,
  gene: 0,
  protein: 0,
  "clinical-outcome": 0,
  "womens-health-concept": 0,
  project: 0,
  collection: 0,
  "research-question": 0,
  hypothesis: 0,
};

const EMPTY_EDGES: Readonly<Record<GraphEdgeType, number>> = {
  IS_A: 0,
  PART_OF: 0,
  TREATS: 0,
  ASSOCIATED_WITH: 0,
  CAUSES: 0,
  INDICATES: 0,
  MEASURED_BY: 0,
  RELATED_TO: 0,
  MENTIONS: 0,
  SUPPORTED_BY: 0,
  CONTRADICTS: 0,
  USES: 0,
  OBSERVED_IN: 0,
  LINKED_TO: 0,
};

export const KnowledgeGraphService = {
  engineVersion: GRAPH_ENGINE_VERSION,
  store: KnowledgeGraphStore,
  builder: KnowledgeGraphBuilder,
  query: GraphQueryService,
  traversal: GraphTraversalService,
  validation: GraphValidationService,
  index: SemanticIndexService,

  ingest(evidence: EvidenceObject): void {
    KnowledgeGraphBuilder.ingestEvidence(evidence);
  },

  ingestMany(items: readonly EvidenceObject[]): number {
    return KnowledgeGraphBuilder.ingestMany(items);
  },

  metrics(): GraphMetrics {
    const snap = KnowledgeGraphStore.snapshot();
    const nodesByType = { ...EMPTY_NODES } as Record<GraphNodeType, number>;
    const edgesByType = { ...EMPTY_EDGES } as Record<GraphEdgeType, number>;
    let evidenceCount = 0;
    let conceptCount = 0;
    let womens = 0;
    let biomed = 0;
    let evidenceWithEdges = 0;
    for (const n of snap.nodes) {
      nodesByType[n.type] = (nodesByType[n.type] ?? 0) + 1;
      if (n.type === "evidence") {
        evidenceCount += 1;
        if (n.degree > 0) evidenceWithEdges += 1;
      } else if (n.type === "womens-health-concept") {
        womens += 1;
        conceptCount += 1;
      } else if (
        n.type === "disease" || n.type === "condition" || n.type === "hormone" ||
        n.type === "drug" || n.type === "biomarker" || n.type === "gene" ||
        n.type === "protein" || n.type === "lab-test" || n.type === "symptom" ||
        n.type === "procedure" || n.type === "clinical-outcome"
      ) {
        biomed += 1;
        conceptCount += 1;
      }
    }
    for (const e of snap.edges) {
      edgesByType[e.type] = (edgesByType[e.type] ?? 0) + 1;
    }
    const totalDegree = snap.nodes.reduce((s, n) => s + n.degree, 0);
    const avgDegree = snap.nodes.length ? totalDegree / snap.nodes.length : 0;
    const maxEdges = snap.nodes.length > 1 ? (snap.nodes.length * (snap.nodes.length - 1)) / 2 : 1;
    const density = snap.edges.length / maxEdges;
    const coverage = evidenceCount ? evidenceWithEdges / evidenceCount : 0;
    return {
      nodeCount: snap.nodes.length,
      edgeCount: snap.edges.length,
      evidenceCount,
      conceptCount,
      womensHealthCount: womens,
      biomedicalCount: biomed,
      avgDegree,
      density,
      coverage,
      nodesByType,
      edgesByType,
    };
  },

  snapshot(): GraphSnapshot {
    return KnowledgeGraphStore.snapshot();
  },
};

export type IKnowledgeGraphService = typeof KnowledgeGraphService;
