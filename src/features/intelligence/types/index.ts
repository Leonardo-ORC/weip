/**
 * Research Intelligence — canonical contracts.
 *
 * The Intelligence layer is a read-only service that consumes Evidence
 * Objects, the Knowledge Graph, Projects, Collections, Research Questions
 * and Hypotheses. It never mutates them. Its output is a strongly typed
 * catalog of Insights and Recommendations that any existing workspace can
 * render without redesigning its UI.
 */

import type { EvidenceObject } from "@/features/evidence-explorer/types";
import type { GraphEdge, GraphNode } from "@/features/graph/types";
import type {
  Hypothesis,
  ResearchArea,
  ResearchCollection,
  ResearchProject,
  ResearchQuestion,
} from "@/features/research/types";

export type InsightKind =
  | "research-gap"
  | "research-opportunity"
  | "conflicting-evidence"
  | "high-confidence-evidence"
  | "emerging-topic"
  | "weakly-studied-area"
  | "rapidly-growing-area"
  | "highly-connected-concept"
  | "trending-concept"
  | "coverage-gap"
  | "concept-overlap"
  | "duplicate-evidence"
  | "collection-similarity"
  | "suggested-merge"
  | "supporting-evidence"
  | "suggested-hypothesis"
  | "suggested-question"
  | "suggested-collaboration"
  | "suggested-collection"
  | "suggested-reading";

export type InsightSurface =
  | "dashboard"
  | "workspace"
  | "projects"
  | "collections"
  | "research"
  | "evidence"
  | "ontology"
  | "pipeline";

export type InsightSeverity = "info" | "signal" | "opportunity" | "warning";
export type ReasoningSource = "deterministic" | "graph" | "ai" | "hybrid";

export interface ConfidenceBreakdown {
  readonly knowledge: number;      // 0..1 — how much structured knowledge backs it
  readonly evidenceCoverage: number; // 0..1 — evidence base thickness
  readonly graphSupport: number;   // 0..1 — graph connectivity support
  readonly ai: number;             // 0..1 — AI confidence (0 when deterministic)
  readonly overall: number;        // 0..1 — weighted composite
}

export interface InsightTraceability {
  readonly evidenceIds: readonly string[];
  readonly edgeIds: readonly string[];
  readonly nodeIds: readonly string[];
  readonly projectIds: readonly string[];
  readonly collectionIds: readonly string[];
  readonly reasoningSource: ReasoningSource;
  readonly generatedAt: string;
  readonly aiModel: string | null;
  readonly explanation: string;
}

export interface ResearchInsight {
  readonly id: string;
  readonly kind: InsightKind;
  readonly surface: readonly InsightSurface[];
  readonly severity: InsightSeverity;
  readonly title: string;
  readonly description: string;
  readonly confidence: ConfidenceBreakdown;
  readonly traceability: InsightTraceability;
  readonly score: number; // 0..1 ranking priority
  readonly tags: readonly string[];
}

export interface RankedEvidence {
  readonly evidence: EvidenceObject;
  readonly score: number;
  readonly reasons: readonly string[];
  readonly confidence: ConfidenceBreakdown;
}

export interface RankedNode {
  readonly node: GraphNode;
  readonly score: number;
  readonly reason: string;
}

export interface TrendPoint {
  readonly label: string;
  readonly value: number;
  readonly delta: number;
}

export interface TrendingConcept {
  readonly node: GraphNode;
  readonly evidenceCount: number;
  readonly degree: number;
  readonly momentum: number; // 0..1
}

export interface KnowledgeGrowthPoint {
  readonly label: string;
  readonly nodes: number;
  readonly edges: number;
  readonly evidence: number;
}

export interface IntelligenceMetricsSummary {
  readonly insights: number;
  readonly opportunities: number;
  readonly gaps: number;
  readonly highConfidence: number;
  readonly emerging: number;
  readonly recommendationSuccess: number; // 0..1
  readonly extractionQuality: number;     // 0..1
  readonly knowledgeCoverage: number;     // 0..1
  readonly relationshipDensity: number;   // 0..1
  readonly evidenceConfidence: number;    // 0..1
  readonly intelligenceQuality: number;   // 0..1
  readonly knowledgeGrowth: number;       // 0..1
  readonly lastComputedAt: string;
}

export interface IntelligenceContext {
  readonly evidence: readonly EvidenceObject[];
  readonly projects: readonly ResearchProject[];
  readonly questions: readonly ResearchQuestion[];
  readonly hypotheses: readonly Hypothesis[];
  readonly collections: readonly ResearchCollection[];
  readonly graphNodes: readonly GraphNode[];
  readonly graphEdges: readonly GraphEdge[];
}

export interface AreaCoverage {
  readonly area: ResearchArea;
  readonly evidenceCount: number;
  readonly coverage: number; // 0..1
  readonly gap: number;      // 0..1
}

export const INTELLIGENCE_ENGINE_VERSION = "1.0.0" as const;
