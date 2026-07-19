/**
 * Deterministic insight detectors. Each service is a pure function of
 * the read-only IntelligenceContext, returning strongly typed
 * ResearchInsight objects with full traceability. AI never runs here —
 * it only enriches the descriptions later via IntelligenceService.
 */

import type { EvidenceObject } from "@/features/evidence-explorer/types";
import type { GraphNode } from "@/features/graph/types";
import type { ResearchArea } from "@/features/research/types";
import { RESEARCH_AREA_LABEL } from "@/features/research/types";
import type {
  AreaCoverage,
  IntelligenceContext,
  ResearchInsight,
  TrendingConcept,
} from "../types";
import { INTELLIGENCE_ENGINE_VERSION } from "../types";
import { composeConfidence, evidenceStrength } from "./confidence";

const NOW = () => new Date().toISOString();

function insight(
  id: string,
  data: Omit<ResearchInsight, "id" | "traceability"> & {
    trace: {
      evidenceIds?: readonly string[];
      edgeIds?: readonly string[];
      nodeIds?: readonly string[];
      projectIds?: readonly string[];
      collectionIds?: readonly string[];
      explanation: string;
      reasoningSource?: ResearchInsight["traceability"]["reasoningSource"];
    };
  },
): ResearchInsight {
  const { trace, ...rest } = data;
  return {
    id,
    ...rest,
    traceability: {
      evidenceIds: trace.evidenceIds ?? [],
      edgeIds: trace.edgeIds ?? [],
      nodeIds: trace.nodeIds ?? [],
      projectIds: trace.projectIds ?? [],
      collectionIds: trace.collectionIds ?? [],
      reasoningSource: trace.reasoningSource ?? "deterministic",
      generatedAt: NOW(),
      aiModel: null,
      explanation: trace.explanation,
    },
  };
}

// --- ResearchGapService ---------------------------------------------------

function areaOfEvidence(ev: EvidenceObject): ResearchArea {
  const t = ev.hormonalContext;
  const c = ev.condition.toLowerCase();
  if (c.includes("pcos")) return "pcos";
  if (c.includes("endometri")) return "endometriosis";
  if (t === "pregnancy") return "pregnancy";
  if (t === "menopause" || t === "post-menopause" || t === "perimenopause") return "menopause";
  return "hormonal-health";
}

export const ResearchGapService = {
  areas(ctx: IntelligenceContext): readonly AreaCoverage[] {
    const buckets = new Map<ResearchArea, number>();
    for (const ev of ctx.evidence) {
      const a = areaOfEvidence(ev);
      buckets.set(a, (buckets.get(a) ?? 0) + 1);
    }
    const total = Math.max(1, ctx.evidence.length);
    const areas: ResearchArea[] = [
      "hormonal-health",
      "reproductive-health",
      "menopause",
      "pcos",
      "endometriosis",
      "pregnancy",
      "oncology",
      "cardiometabolic",
    ];
    return areas.map((area) => {
      const count = buckets.get(area) ?? 0;
      const coverage = Math.min(1, count / (total * 0.35));
      return { area, evidenceCount: count, coverage, gap: 1 - coverage };
    });
  },

  gaps(ctx: IntelligenceContext): readonly ResearchInsight[] {
    const areas = this.areas(ctx);
    return areas
      .filter((a) => a.gap >= 0.6)
      .sort((a, b) => b.gap - a.gap)
      .slice(0, 4)
      .map((a) =>
        insight(`gap:${a.area}`, {
          kind: "research-gap",
          surface: ["dashboard", "workspace", "research", "projects"],
          severity: "warning",
          title: `Under-studied area: ${RESEARCH_AREA_LABEL[a.area]}`,
          description:
            a.evidenceCount === 0
              ? `No structured evidence yet for ${RESEARCH_AREA_LABEL[a.area]}. High-priority research opportunity.`
              : `Only ${a.evidenceCount} evidence object${a.evidenceCount === 1 ? "" : "s"} for ${RESEARCH_AREA_LABEL[a.area]}. Consider expanding coverage.`,
          score: a.gap,
          tags: [a.area, "gap"],
          confidence: composeConfidence({
            knowledge: 1 - a.gap,
            evidenceCoverage: a.coverage,
            graphSupport: 0.4,
          }),
          trace: {
            explanation: `Detected via area coverage < 35% of evidence base (engine v${INTELLIGENCE_ENGINE_VERSION}).`,
          },
        }),
      );
  },
};

// --- TrendAnalysisService -------------------------------------------------

export const TrendAnalysisService = {
  trendingConcepts(ctx: IntelligenceContext, limit = 8): readonly TrendingConcept[] {
    const concepts = ctx.graphNodes.filter(
      (n) =>
        n.type !== "evidence" &&
        n.type !== "project" &&
        n.type !== "collection" &&
        n.type !== "research-question" &&
        n.type !== "hypothesis",
    );
    const scored = concepts.map((n) => {
      const evCount = n.evidenceIds.length;
      const momentum = Math.min(1, (n.degree * 0.6 + evCount * 0.4) / 12);
      return { node: n, evidenceCount: evCount, degree: n.degree, momentum };
    });
    return scored
      .sort((a, b) => b.momentum - a.momentum || b.degree - a.degree)
      .slice(0, limit);
  },

  trendingInsights(ctx: IntelligenceContext): readonly ResearchInsight[] {
    const trending = this.trendingConcepts(ctx, 4);
    return trending.map((t) =>
      insight(`trend:${t.node.id}`, {
        kind: "trending-concept",
        surface: ["dashboard", "ontology"],
        severity: "signal",
        title: `Trending concept: ${t.node.label}`,
        description: `Connected to ${t.degree} entities across ${t.evidenceCount} evidence object${t.evidenceCount === 1 ? "" : "s"}.`,
        score: t.momentum,
        tags: [t.node.type, "trending"],
        confidence: composeConfidence({
          knowledge: 0.7,
          evidenceCoverage: Math.min(1, t.evidenceCount / 5),
          graphSupport: Math.min(1, t.degree / 10),
        }),
        trace: {
          nodeIds: [t.node.id],
          evidenceIds: t.node.evidenceIds,
          explanation: "Momentum computed from degree × evidence coverage in the Knowledge Graph.",
          reasoningSource: "graph",
        },
      }),
    );
  },

  emergingWomensHealth(ctx: IntelligenceContext): readonly ResearchInsight[] {
    const wh = ctx.graphNodes.filter(
      (n) => n.type === "womens-health-concept" && n.evidenceIds.length > 0,
    );
    return wh
      .sort((a, b) => b.degree - a.degree)
      .slice(0, 3)
      .map((n) =>
        insight(`emerging:${n.id}`, {
          kind: "emerging-topic",
          surface: ["dashboard", "ontology", "workspace"],
          severity: "opportunity",
          title: `Emerging women's health area: ${n.label}`,
          description: `${n.evidenceIds.length} recent evidence object${n.evidenceIds.length === 1 ? "" : "s"} linked to ${n.label}.`,
          score: Math.min(1, n.degree / 15),
          tags: ["womens-health", "emerging"],
          confidence: composeConfidence({
            knowledge: 0.75,
            evidenceCoverage: Math.min(1, n.evidenceIds.length / 4),
            graphSupport: Math.min(1, n.degree / 8),
          }),
          trace: {
            nodeIds: [n.id],
            evidenceIds: n.evidenceIds,
            explanation: "Women's health concept with growing graph connectivity.",
            reasoningSource: "graph",
          },
        }),
      );
  },
};

// --- EvidenceRankingService ----------------------------------------------

export const EvidenceRankingService = {
  rank(evidence: readonly EvidenceObject[]): readonly EvidenceObject[] {
    return evidence.slice().sort((a, b) => evidenceStrength(b) - evidenceStrength(a));
  },

  highConfidence(ctx: IntelligenceContext, limit = 6): readonly EvidenceObject[] {
    return ctx.evidence
      .filter((e) => e.confidence === "high" && (e.quality === "A" || e.quality === "B"))
      .slice()
      .sort((a, b) => evidenceStrength(b) - evidenceStrength(a))
      .slice(0, limit);
  },

  highConfidenceInsights(ctx: IntelligenceContext): readonly ResearchInsight[] {
    return this.highConfidence(ctx, 3).map((ev) =>
      insight(`high-conf:${ev.id}`, {
        kind: "high-confidence-evidence",
        surface: ["dashboard", "evidence", "research"],
        severity: "info",
        title: ev.title,
        description: `${ev.studyDesign} · ${ev.publication.journal} ${ev.publication.year}. ${ev.summary.slice(0, 140)}${ev.summary.length > 140 ? "…" : ""}`,
        score: evidenceStrength(ev),
        tags: [ev.condition, ev.hormonalContext],
        confidence: composeConfidence({
          knowledge: 0.85,
          evidenceCoverage: evidenceStrength(ev),
          graphSupport: 0.7,
        }),
        trace: {
          evidenceIds: [ev.id],
          explanation: `Quality ${ev.quality} · confidence ${ev.confidence}.`,
        },
      }),
    );
  },

  relatedTo(ev: EvidenceObject, ctx: IntelligenceContext, limit = 5): readonly EvidenceObject[] {
    const others = ctx.evidence.filter((e) => e.id !== ev.id);
    const scored = others.map((o) => {
      let s = 0;
      if (o.condition === ev.condition) s += 0.4;
      if (o.hormonalContext === ev.hormonalContext) s += 0.2;
      if (o.drug && o.drug === ev.drug) s += 0.25;
      const tagOverlap = o.tags.filter((t) => ev.tags.includes(t)).length;
      s += Math.min(0.3, tagOverlap * 0.08);
      return { o, s };
    });
    return scored
      .filter((x) => x.s > 0.15)
      .sort((a, b) => b.s - a.s)
      .slice(0, limit)
      .map((x) => x.o);
  },
};

// --- ResearchRecommendationService ---------------------------------------

export const ResearchRecommendationService = {
  suggestedEvidenceForProject(
    projectId: string,
    ctx: IntelligenceContext,
    limit = 5,
  ): readonly EvidenceObject[] {
    const p = ctx.projects.find((x) => x.id === projectId);
    if (!p) return [];
    const scored = ctx.evidence.map((e) => {
      let s = 0;
      const area = areaOfEvidence(e);
      if (area === p.area) s += 0.5;
      const tagOverlap = e.tags.filter((t) => p.tags.includes(t)).length;
      s += Math.min(0.4, tagOverlap * 0.12);
      s += evidenceStrength(e) * 0.2;
      return { e, s };
    });
    return scored
      .filter((x) => x.s > 0.25)
      .sort((a, b) => b.s - a.s)
      .slice(0, limit)
      .map((x) => x.e);
  },

  similarProjects(projectId: string, ctx: IntelligenceContext, limit = 3) {
    const target = ctx.projects.find((p) => p.id === projectId);
    if (!target) return [];
    return ctx.projects
      .filter((p) => p.id !== projectId)
      .map((p) => {
        let s = 0;
        if (p.area === target.area) s += 0.5;
        const tagOverlap = p.tags.filter((t) => target.tags.includes(t)).length;
        s += Math.min(0.4, tagOverlap * 0.15);
        return { p, s };
      })
      .filter((x) => x.s > 0)
      .sort((a, b) => b.s - a.s)
      .slice(0, limit)
      .map((x) => x.p);
  },

  suggestedNextActions(ctx: IntelligenceContext): readonly ResearchInsight[] {
    const out: ResearchInsight[] = [];
    const activeProjects = ctx.projects.filter((p) => p.status === "active");
    if (activeProjects.length > 0) {
      const stale = activeProjects.sort(
        (a, b) => new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime(),
      )[0];
      out.push(
        insight(`next:review:${stale.id}`, {
          kind: "suggested-reading",
          surface: ["workspace"],
          severity: "opportunity",
          title: `Review "${stale.title}"`,
          description: `This active project has the oldest update in your workspace — review recent evidence and re-rank.`,
          score: 0.7,
          tags: [stale.area, "review"],
          confidence: composeConfidence({ knowledge: 0.8, evidenceCoverage: 0.6, graphSupport: 0.5 }),
          trace: {
            projectIds: [stale.id],
            explanation: "Oldest updatedAt among active projects.",
          },
        }),
      );
    }
    const openQuestion = ctx.questions.find((q) => q.status === "open");
    if (openQuestion) {
      out.push(
        insight(`next:answer:${openQuestion.id}`, {
          kind: "suggested-question",
          surface: ["workspace", "research"],
          severity: "signal",
          title: `Address open question`,
          description: openQuestion.question,
          score: 0.65,
          tags: ["question"],
          confidence: composeConfidence({ knowledge: 0.7, evidenceCoverage: 0.5, graphSupport: 0.5 }),
          trace: {
            projectIds: [openQuestion.projectId],
            explanation: "Highest-priority open research question.",
          },
        }),
      );
    }
    return out;
  },
};

// --- HypothesisSuggestionService -----------------------------------------

export const HypothesisSuggestionService = {
  suggestions(ctx: IntelligenceContext): readonly ResearchInsight[] {
    const trending = TrendAnalysisService.trendingConcepts(ctx, 3);
    return trending.map((t) =>
      insight(`hyp:${t.node.id}`, {
        kind: "suggested-hypothesis",
        surface: ["research"],
        severity: "opportunity",
        title: `Hypothesis around ${t.node.label}`,
        description: `${t.node.label} shows momentum ${(t.momentum * 100).toFixed(0)}% across the graph — worth formalising a hypothesis linking it to observed outcomes.`,
        score: t.momentum,
        tags: [t.node.type, "hypothesis"],
        confidence: composeConfidence({
          knowledge: 0.6,
          evidenceCoverage: Math.min(1, t.evidenceCount / 4),
          graphSupport: Math.min(1, t.degree / 8),
        }),
        trace: {
          nodeIds: [t.node.id],
          evidenceIds: t.node.evidenceIds,
          explanation: "Derived from top graph momentum for non-evidence concepts.",
          reasoningSource: "graph",
        },
      }),
    );
  },
};

// --- ConceptDiscoveryService ---------------------------------------------

export const ConceptDiscoveryService = {
  highlyConnected(ctx: IntelligenceContext, limit = 5): readonly GraphNode[] {
    return ctx.graphNodes
      .filter((n) => n.type !== "evidence")
      .slice()
      .sort((a, b) => b.degree - a.degree)
      .slice(0, limit);
  },

  insights(ctx: IntelligenceContext): readonly ResearchInsight[] {
    return this.highlyConnected(ctx, 3).map((n) =>
      insight(`hub:${n.id}`, {
        kind: "highly-connected-concept",
        surface: ["ontology", "dashboard"],
        severity: "info",
        title: `Semantic hotspot: ${n.label}`,
        description: `${n.label} sits at the centre of ${n.degree} relationships — a strong anchor for further research.`,
        score: Math.min(1, n.degree / 20),
        tags: [n.type, "hub"],
        confidence: composeConfidence({
          knowledge: 0.75,
          evidenceCoverage: Math.min(1, n.evidenceIds.length / 5),
          graphSupport: Math.min(1, n.degree / 15),
        }),
        trace: {
          nodeIds: [n.id],
          explanation: "Top-degree non-evidence node.",
          reasoningSource: "graph",
        },
      }),
    );
  },
};

// --- CollectionAnalysisService -------------------------------------------

export const CollectionAnalysisService = {
  insights(ctx: IntelligenceContext): readonly ResearchInsight[] {
    const out: ResearchInsight[] = [];
    // Suggested merges — collections with similar tag sets and the same project
    const cols = ctx.collections;
    for (let i = 0; i < cols.length; i += 1) {
      for (let j = i + 1; j < cols.length; j += 1) {
        const a = cols[i];
        const b = cols[j];
        if (a.projectId !== b.projectId) continue;
        const overlap = a.tags.filter((t) => b.tags.includes(t)).length;
        const union = new Set([...a.tags, ...b.tags]).size || 1;
        const sim = overlap / union;
        if (sim >= 0.4) {
          out.push(
            insight(`merge:${a.id}:${b.id}`, {
              kind: "suggested-merge",
              surface: ["collections"],
              severity: "opportunity",
              title: `Consider merging "${a.name}" and "${b.name}"`,
              description: `Tag similarity ${(sim * 100).toFixed(0)}% within the same project.`,
              score: sim,
              tags: ["merge", "collection"],
              confidence: composeConfidence({ knowledge: sim, evidenceCoverage: 0.6, graphSupport: 0.5 }),
              trace: {
                collectionIds: [a.id, b.id],
                projectIds: [a.projectId],
                explanation: "Jaccard similarity over collection tag sets ≥ 0.4.",
              },
            }),
          );
        }
      }
    }
    // Coverage gaps — collections with few evidence objects
    for (const c of cols) {
      if (c.evidenceCount < 6) {
        out.push(
          insight(`coverage:${c.id}`, {
            kind: "coverage-gap",
            surface: ["collections"],
            severity: "warning",
            title: `Thin coverage in "${c.name}"`,
            description: `Only ${c.evidenceCount} evidence objects. Consider expanding.`,
            score: 1 - c.evidenceCount / 6,
            tags: ["collection", "gap"],
            confidence: composeConfidence({
              knowledge: 0.7,
              evidenceCoverage: c.evidenceCount / 6,
              graphSupport: 0.4,
            }),
            trace: {
              collectionIds: [c.id],
              projectIds: [c.projectId],
              explanation: "Evidence count below the recommended baseline of 6.",
            },
          }),
        );
      }
    }
    return out.slice(0, 6);
  },
};

// --- ProjectRecommendationService ----------------------------------------

export const ProjectRecommendationService = {
  completeness(projectId: string, ctx: IntelligenceContext): number {
    const p = ctx.projects.find((x) => x.id === projectId);
    if (!p) return 0;
    const evidence = Math.min(1, p.evidenceCount / 30);
    const hypotheses = Math.min(1, p.hypothesisCount / 5);
    const collections = Math.min(1, p.collectionCount / 4);
    const questions = Math.min(1, p.questionCount / 6);
    return clamp(evidence * 0.4 + hypotheses * 0.2 + collections * 0.2 + questions * 0.2);
  },

  insights(ctx: IntelligenceContext): readonly ResearchInsight[] {
    return ctx.projects.slice(0, 4).map((p) => {
      const c = this.completeness(p.id, ctx);
      const missing = c < 0.5;
      return insight(`proj:${p.id}`, {
        kind: missing ? "coverage-gap" : "research-opportunity",
        surface: ["projects", "workspace"],
        severity: missing ? "warning" : "opportunity",
        title: `${p.title} — ${Math.round(c * 100)}% complete`,
        description: missing
          ? `Research completeness is low. Add more evidence, questions or hypotheses.`
          : `Solid coverage. Consider extending with a new research question or hypothesis.`,
        score: 1 - Math.abs(0.7 - c),
        tags: [p.area],
        confidence: composeConfidence({
          knowledge: c,
          evidenceCoverage: c,
          graphSupport: 0.5,
        }),
        trace: {
          projectIds: [p.id],
          explanation: "Weighted completeness across evidence, hypotheses, collections and questions.",
        },
      });
    });
  },
};

function clamp(n: number): number {
  return Math.max(0, Math.min(1, n));
}

// --- ConflictDetectionService --------------------------------------------

export const ConflictDetectionService = {
  insights(ctx: IntelligenceContext): readonly ResearchInsight[] {
    const out: ResearchInsight[] = [];
    // Detect same drug + same condition with opposing significance markers
    const groups = new Map<string, EvidenceObject[]>();
    for (const e of ctx.evidence) {
      if (!e.drug) continue;
      const k = `${e.drug.toLowerCase()}|${e.condition.toLowerCase()}`;
      const arr = groups.get(k) ?? [];
      arr.push(e);
      groups.set(k, arr);
    }
    for (const [key, arr] of groups) {
      if (arr.length < 2) continue;
      const positive = arr.filter((e) => e.outcomes.some((o) => (o.significance ?? "").toLowerCase().includes("p=")));
      const contradict = arr.length >= 2 && positive.length >= 1 && positive.length < arr.length;
      if (contradict) {
        out.push(
          insight(`conflict:${key}`, {
            kind: "conflicting-evidence",
            surface: ["evidence", "research", "dashboard"],
            severity: "warning",
            title: `Mixed evidence for ${arr[0].drug} in ${arr[0].condition}`,
            description: `${arr.length} evidence objects, ${positive.length} report significant outcomes and ${arr.length - positive.length} do not.`,
            score: 0.75,
            tags: [arr[0].condition, "conflict"],
            confidence: composeConfidence({
              knowledge: 0.75,
              evidenceCoverage: Math.min(1, arr.length / 4),
              graphSupport: 0.6,
            }),
            trace: {
              evidenceIds: arr.map((e) => e.id),
              explanation: "Same drug × condition with heterogeneous statistical significance.",
            },
          }),
        );
      }
    }
    return out.slice(0, 4);
  },
};
