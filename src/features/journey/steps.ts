import type { JourneyStep, JourneyStepId } from "./types";

export const JOURNEY_STEPS: readonly JourneyStep[] = [
  {
    id: "sources",
    index: 1,
    label: "Scientific Sources",
    eyebrow: "Step 1 of 7",
    route: "/app/sources",
    objective: "Import a curated set of studies on metformin in women with PCOS.",
    context:
      "Every scientific investigation starts with primary evidence. WEIP unifies PubMed, ClinicalTrials.gov and OpenAlex behind one query surface.",
    primaryAction: "Import demonstration studies",
    result: "12 curated studies imported and normalized into the pipeline.",
  },
  {
    id: "extraction",
    index: 2,
    label: "Evidence Extraction",
    eyebrow: "Step 2 of 7",
    route: "/app/pipeline",
    objective: "Watch deterministic and AI extractors process the imported studies.",
    context:
      "Raw literature becomes machine-readable. Deterministic extractors run first; AI enriches — never replaces — the structured fields, with full provenance.",
    primaryAction: "Run extraction pipeline",
    result: "Population, intervention, outcomes and study design extracted with traceability.",
  },
  {
    id: "evidence",
    index: 3,
    label: "Evidence Objects",
    eyebrow: "Step 3 of 7",
    route: "/app/evidence",
    objective: "Review the canonical Evidence Objects produced from the studies.",
    context:
      "Evidence Objects are the atomic unit of WEIP — strongly typed, comparable, and linked back to their source and extractor.",
    primaryAction: "Review Evidence Objects",
    result: "12 Evidence Objects ready for graph construction and reasoning.",
  },
  {
    id: "graph",
    index: 4,
    label: "Knowledge Graph",
    eyebrow: "Step 4 of 7",
    route: "/app/graph",
    objective: "Explore the relationships that emerged between drugs, conditions and outcomes.",
    context:
      "Every Evidence Object contributes nodes and edges to a living Knowledge Graph. Relationships preserve confidence and the evidence that supports them.",
    primaryAction: "Explore the Knowledge Graph",
    result: "A subgraph centered on metformin, insulin resistance and reproductive outcomes.",
  },
  {
    id: "intelligence",
    index: 5,
    label: "Research Intelligence",
    eyebrow: "Step 5 of 7",
    route: "/app/research",
    objective: "Generate explainable insights, gaps and trends from the graph.",
    context:
      "Research Intelligence reads Evidence Objects and the graph to surface opportunities and gaps — every insight is traceable to its evidence.",
    primaryAction: "Generate Research Intelligence",
    result: "Insights on outcome heterogeneity and an under-studied age subgroup.",
  },
  {
    id: "drug-score",
    index: 6,
    label: "Drug Score",
    eyebrow: "Step 6 of 7",
    route: "/app/journey",
    objective: "Calculate how well metformin has been studied in women with PCOS.",
    context:
      "Drug Score turns the accumulated evidence into an objective, transparent measure of research completeness for a drug–population pair.",
    primaryAction: "Calculate Drug Score",
    result: "A composite score with breakdown across coverage, quality and representation.",
  },
  {
    id: "summary",
    index: 7,
    label: "Project Summary",
    eyebrow: "Step 7 of 7",
    route: "/app/journey",
    objective: "See the complete scientific project you just built.",
    context:
      "Every artifact — sources, evidence, graph, intelligence, score — is composed into a single reproducible project.",
    primaryAction: "Open project summary",
    result: "A complete scientific project ready to share or extend.",
  },
] as const;

export const STEP_INDEX: Record<JourneyStepId, number> = JOURNEY_STEPS.reduce(
  (acc, s, i) => ({ ...acc, [s.id]: i }),
  {} as Record<JourneyStepId, number>,
);

export function getStep(id: JourneyStepId): JourneyStep {
  return JOURNEY_STEPS[STEP_INDEX[id]];
}

export function nextStepId(id: JourneyStepId): JourneyStepId | null {
  const i = STEP_INDEX[id];
  return i < JOURNEY_STEPS.length - 1 ? JOURNEY_STEPS[i + 1].id : null;
}
