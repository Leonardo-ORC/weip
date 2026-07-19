/**
 * IntelligenceService — the public facade. Aggregates every deterministic
 * detector into a single catalog of insights, plus surface-specific
 * queries used by every workspace.
 */

import type { EvidenceObject } from "@/features/evidence-explorer/types";
import type { GraphNode } from "@/features/graph/types";
import type {
  IntelligenceContext,
  IntelligenceMetricsSummary,
  InsightSurface,
  KnowledgeGrowthPoint,
  ResearchInsight,
} from "../types";
import { INTELLIGENCE_ENGINE_VERSION } from "../types";
import { IntelligenceContextService } from "./context-service";
import { clamp01 } from "./confidence";
import {
  CollectionAnalysisService,
  ConceptDiscoveryService,
  ConflictDetectionService,
  EvidenceRankingService,
  HypothesisSuggestionService,
  ProjectRecommendationService,
  ResearchGapService,
  ResearchRecommendationService,
  TrendAnalysisService,
} from "./insight-detectors";

export const ResearchIntelligenceService = {
  version: INTELLIGENCE_ENGINE_VERSION,

  context(): IntelligenceContext {
    return IntelligenceContextService.build();
  },

  allInsights(ctx?: IntelligenceContext): readonly ResearchInsight[] {
    const c = ctx ?? this.context();
    return [
      ...ResearchGapService.gaps(c),
      ...TrendAnalysisService.trendingInsights(c),
      ...TrendAnalysisService.emergingWomensHealth(c),
      ...EvidenceRankingService.highConfidenceInsights(c),
      ...ConceptDiscoveryService.insights(c),
      ...CollectionAnalysisService.insights(c),
      ...ProjectRecommendationService.insights(c),
      ...ConflictDetectionService.insights(c),
      ...HypothesisSuggestionService.suggestions(c),
      ...ResearchRecommendationService.suggestedNextActions(c),
    ].sort((a, b) => b.score - a.score);
  },

  forSurface(surface: InsightSurface, ctx?: IntelligenceContext): readonly ResearchInsight[] {
    return this.allInsights(ctx).filter((i) => i.surface.includes(surface));
  },

  metrics(ctx?: IntelligenceContext): IntelligenceMetricsSummary {
    const c = ctx ?? this.context();
    const insights = this.allInsights(c);
    const opportunities = insights.filter(
      (i) => i.severity === "opportunity" || i.kind === "research-opportunity",
    ).length;
    const gaps = insights.filter((i) => i.kind === "research-gap" || i.kind === "coverage-gap").length;
    const highConfidence = insights.filter((i) => i.kind === "high-confidence-evidence").length;
    const emerging = insights.filter((i) => i.kind === "emerging-topic" || i.kind === "trending-concept").length;

    const evidenceConfidence = c.evidence.length
      ? c.evidence.reduce(
          (s, e) => s + (e.confidence === "high" ? 1 : e.confidence === "moderate" ? 0.7 : e.confidence === "low" ? 0.45 : 0.2),
          0,
        ) / c.evidence.length
      : 0;

    const extractionQuality = c.evidence.length
      ? c.evidence.filter((e) => e.extraction && e.extraction.confidence.overall >= 0.6).length /
        c.evidence.length
      : 0.7;

    const evidenceNodes = c.graphNodes.filter((n) => n.type === "evidence").length;
    const linkedEvidenceNodes = c.graphNodes.filter(
      (n) => n.type === "evidence" && n.degree > 0,
    ).length;
    const knowledgeCoverage = evidenceNodes ? linkedEvidenceNodes / evidenceNodes : 0;
    const maxEdges = c.graphNodes.length > 1 ? (c.graphNodes.length * (c.graphNodes.length - 1)) / 2 : 1;
    const relationshipDensity = clamp01(c.graphEdges.length / maxEdges);

    const recommendationSuccess = insights.length
      ? insights.reduce((s, i) => s + i.confidence.overall, 0) / insights.length
      : 0;

    const intelligenceQuality = clamp01(
      (evidenceConfidence + knowledgeCoverage + recommendationSuccess) / 3,
    );
    const knowledgeGrowth = clamp01(
      (c.graphNodes.length / 60) * 0.5 + (c.graphEdges.length / 120) * 0.5,
    );

    return {
      insights: insights.length,
      opportunities,
      gaps,
      highConfidence,
      emerging,
      recommendationSuccess,
      extractionQuality,
      knowledgeCoverage,
      relationshipDensity,
      evidenceConfidence,
      intelligenceQuality,
      knowledgeGrowth,
      lastComputedAt: new Date().toISOString(),
    };
  },

  suggestedEvidenceForProject(projectId: string, ctx?: IntelligenceContext): readonly EvidenceObject[] {
    return ResearchRecommendationService.suggestedEvidenceForProject(projectId, ctx ?? this.context());
  },

  similarProjects(projectId: string, ctx?: IntelligenceContext) {
    return ResearchRecommendationService.similarProjects(projectId, ctx ?? this.context());
  },

  relatedEvidence(ev: EvidenceObject, ctx?: IntelligenceContext): readonly EvidenceObject[] {
    return EvidenceRankingService.relatedTo(ev, ctx ?? this.context());
  },

  highConfidenceEvidence(ctx?: IntelligenceContext): readonly EvidenceObject[] {
    return EvidenceRankingService.highConfidence(ctx ?? this.context());
  },

  trendingConcepts(ctx?: IntelligenceContext) {
    return TrendAnalysisService.trendingConcepts(ctx ?? this.context());
  },

  highlyConnectedConcepts(ctx?: IntelligenceContext): readonly GraphNode[] {
    return ConceptDiscoveryService.highlyConnected(ctx ?? this.context());
  },

  areaCoverage(ctx?: IntelligenceContext) {
    return ResearchGapService.areas(ctx ?? this.context());
  },

  knowledgeGrowth(ctx?: IntelligenceContext): readonly KnowledgeGrowthPoint[] {
    const c = ctx ?? this.context();
    // Deterministic 6-step ramp derived from current totals
    const N = c.graphNodes.length;
    const E = c.graphEdges.length;
    const V = c.evidence.length;
    return [0.2, 0.35, 0.5, 0.68, 0.84, 1].map((k, i) => ({
      label: `T-${5 - i}`,
      nodes: Math.round(N * k),
      edges: Math.round(E * k),
      evidence: Math.round(V * k),
    }));
  },
};

export type IResearchIntelligenceService = typeof ResearchIntelligenceService;
