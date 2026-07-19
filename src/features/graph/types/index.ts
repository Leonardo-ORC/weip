/**
 * Knowledge Graph — canonical contracts.
 *
 * The Knowledge Graph is the semantic layer that connects every
 * Evidence Object, biomedical entity, women's health concept, project,
 * collection, research question and hypothesis into a single reusable
 * network. Every node and edge is strongly typed and carries full
 * provenance so researchers can always answer: "why are these two
 * things connected?".
 */

import type {
  BiomedicalEntityKind,
  ExtractionMethod,
  WomensHealthConcept,
} from "@/features/extraction/types";
import type { SourceId } from "@/features/sources/types";

export type GraphNodeType =
  | "evidence"
  | "disease"
  | "condition"
  | "hormone"
  | "drug"
  | "biomarker"
  | "symptom"
  | "procedure"
  | "lab-test"
  | "gene"
  | "protein"
  | "clinical-outcome"
  | "womens-health-concept"
  | "project"
  | "collection"
  | "research-question"
  | "hypothesis";

export type GraphEdgeType =
  | "IS_A"
  | "PART_OF"
  | "TREATS"
  | "ASSOCIATED_WITH"
  | "CAUSES"
  | "INDICATES"
  | "MEASURED_BY"
  | "RELATED_TO"
  | "MENTIONS"
  | "SUPPORTED_BY"
  | "CONTRADICTS"
  | "USES"
  | "OBSERVED_IN"
  | "LINKED_TO";

export interface EdgeProvenance {
  readonly evidenceId: string | null;
  readonly source: SourceId | "manual" | "ontology" | "extraction";
  readonly extractionVersion: string | null;
  readonly extractionMethod: ExtractionMethod;
  readonly aiProviderId: string | null;
  readonly aiModel: string | null;
  readonly confidence: number;
  readonly timestamp: string;
  readonly snippet?: string;
}

export interface GraphNode {
  readonly id: string;
  readonly type: GraphNodeType;
  readonly label: string;
  readonly canonicalKey: string;
  readonly aliases: readonly string[];
  readonly evidenceIds: readonly string[];
  readonly degree: number;
  readonly confidence: number;
  readonly createdAt: string;
  readonly updatedAt: string;
  readonly meta?: {
    readonly biomedicalKind?: BiomedicalEntityKind;
    readonly womensHealthConcept?: WomensHealthConcept;
    readonly evidenceRef?: string;
    readonly summary?: string;
  };
}

export interface GraphEdge {
  readonly id: string;
  readonly type: GraphEdgeType;
  readonly sourceId: string;
  readonly targetId: string;
  readonly confidence: number;
  readonly weight: number;
  readonly provenance: readonly EdgeProvenance[];
  readonly createdAt: string;
  readonly updatedAt: string;
}

export interface GraphSnapshot {
  readonly nodes: readonly GraphNode[];
  readonly edges: readonly GraphEdge[];
  readonly version: number;
  readonly builtAt: string;
}

export interface GraphMetrics {
  readonly nodeCount: number;
  readonly edgeCount: number;
  readonly evidenceCount: number;
  readonly conceptCount: number;
  readonly womensHealthCount: number;
  readonly biomedicalCount: number;
  readonly avgDegree: number;
  readonly density: number;
  readonly coverage: number; // 0..1 — evidence with at least one graph edge
  readonly nodesByType: Readonly<Record<GraphNodeType, number>>;
  readonly edgesByType: Readonly<Record<GraphEdgeType, number>>;
}

export interface GraphNeighborhood {
  readonly center: GraphNode;
  readonly nodes: readonly GraphNode[];
  readonly edges: readonly GraphEdge[];
  readonly depth: number;
}

export interface SemanticPath {
  readonly nodes: readonly GraphNode[];
  readonly edges: readonly GraphEdge[];
  readonly length: number;
  readonly weight: number;
}

export interface GraphValidationIssue {
  readonly code:
    | "duplicate-node"
    | "orphan-node"
    | "broken-edge"
    | "circular-edge"
    | "missing-provenance"
    | "confidence-inconsistent";
  readonly severity: "info" | "warn" | "error";
  readonly message: string;
  readonly nodeId?: string;
  readonly edgeId?: string;
}

export interface GraphValidationReport {
  readonly issues: readonly GraphValidationIssue[];
  readonly score: number;
  readonly passed: boolean;
  readonly checkedAt: string;
}

export type GraphSubscriptionListener = (snapshot: GraphSnapshot) => void;

export const GRAPH_ENGINE_VERSION = "1.0.0" as const;
