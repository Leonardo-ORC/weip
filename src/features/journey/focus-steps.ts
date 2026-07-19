import type { JourneyStepId } from "./types";
import {
  DEMO_DRUG_SCORE,
  DEMO_EVIDENCE_STATS,
  DEMO_GRAPH_STATS,
  DEMO_INSIGHTS,
  DEMO_SOURCES,
} from "./dataset";

export interface FocusMetric {
  label: string;
  value: number;
  suffix?: string;
  format?: "number" | "score";
}

export interface FocusStepData {
  id: JourneyStepId;
  operation: string;
  scientificInput: { label: string; value: string }[];
  stages: string[];
  outputs: FocusMetric[];
  outputHeadline: string;
  achievement: string;
  nextObjective: string;
  nextLabel: string;
}

const TOTAL_STUDIES = DEMO_SOURCES.reduce((s, x) => s + x.count, 0);

export const FOCUS_STEPS: Record<JourneyStepId, FocusStepData> = {
  sources: {
    id: "sources",
    operation: "Import curated studies on metformin in women with PCOS.",
    scientificInput: [
      { label: "Query", value: "metformin AND PCOS AND women" },
      { label: "Providers", value: "PubMed · ClinicalTrials.gov · OpenAlex" },
    ],
    stages: ["Search", "Deduplicate", "Validate", "Normalize", "Store"],
    outputs: [
      { label: "Studies imported", value: TOTAL_STUDIES },
      { label: "PubMed", value: DEMO_SOURCES[0].count },
      { label: "ClinicalTrials.gov", value: DEMO_SOURCES[1].count },
      { label: "OpenAlex", value: DEMO_SOURCES[2].count },
    ],
    outputHeadline: `${TOTAL_STUDIES} Scientific Studies imported`,
    achievement: "Unified corpus ready for extraction.",
    nextObjective: "Extract structured evidence from every study.",
    nextLabel: "Continue to Evidence Extraction",
  },
  extraction: {
    id: "extraction",
    operation: "Extract structured evidence from imported studies.",
    scientificInput: [
      { label: "Corpus", value: `${TOTAL_STUDIES} studies` },
      { label: "Extractors", value: "Deterministic + AI enrichment" },
    ],
    stages: [
      "Parse",
      "Deterministic extract",
      "AI enrich",
      "Validate",
      "Traceability",
      "Persist",
    ],
    outputs: [
      { label: "Studies processed", value: TOTAL_STUDIES },
      { label: "Populations", value: DEMO_EVIDENCE_STATS.populations },
      { label: "Interventions", value: DEMO_EVIDENCE_STATS.interventions },
      { label: "Outcomes", value: DEMO_EVIDENCE_STATS.outcomes },
    ],
    outputHeadline: `${DEMO_EVIDENCE_STATS.objects} studies fully extracted`,
    achievement: "Population, intervention and outcomes extracted with provenance.",
    nextObjective: "Review the canonical Evidence Objects.",
    nextLabel: "Continue to Evidence Objects",
  },
  evidence: {
    id: "evidence",
    operation: "Materialize canonical Evidence Objects.",
    scientificInput: [
      { label: "Extractions", value: `${TOTAL_STUDIES} processed` },
      { label: "Schema", value: "Canonical Evidence Object v1" },
    ],
    stages: ["Assemble", "Type-check", "Link provenance", "Index", "Expose"],
    outputs: [
      { label: "Evidence Objects", value: DEMO_EVIDENCE_STATS.objects },
      { label: "Populations", value: DEMO_EVIDENCE_STATS.populations },
      { label: "Interventions", value: DEMO_EVIDENCE_STATS.interventions },
      { label: "Outcomes", value: DEMO_EVIDENCE_STATS.outcomes },
    ],
    outputHeadline: `${DEMO_EVIDENCE_STATS.objects} Evidence Objects created`,
    achievement: "Every study is now a comparable, typed Evidence Object.",
    nextObjective: "Generate semantic relationships between concepts.",
    nextLabel: "Continue to Knowledge Graph",
  },
  graph: {
    id: "graph",
    operation: "Generate semantic relationships.",
    scientificInput: [
      { label: "Evidence Objects", value: String(DEMO_EVIDENCE_STATS.objects) },
      { label: "Relation types", value: "TREATS · CAUSES · MEASURES · IS_A" },
    ],
    stages: [
      "Resolve entities",
      "Infer edges",
      "Score confidence",
      "Cluster",
      "Persist",
    ],
    outputs: [
      { label: "Nodes", value: DEMO_GRAPH_STATS.nodes },
      { label: "Edges", value: DEMO_GRAPH_STATS.edges },
      { label: "Clusters", value: DEMO_GRAPH_STATS.clusters },
    ],
    outputHeadline: `${DEMO_GRAPH_STATS.edges} Semantic Relationships generated`,
    achievement: "A subgraph centered on metformin and reproductive outcomes.",
    nextObjective: "Surface insights, gaps and trends from the graph.",
    nextLabel: "Continue to Research Intelligence",
  },
  intelligence: {
    id: "intelligence",
    operation: "Generate explainable research intelligence.",
    scientificInput: [
      { label: "Graph size", value: `${DEMO_GRAPH_STATS.nodes} nodes · ${DEMO_GRAPH_STATS.edges} edges` },
      { label: "Enrichment", value: "OpenAI (traceable)" },
    ],
    stages: [
      "Detect gaps",
      "Analyze trends",
      "Score confidence",
      "Explain",
      "Publish",
    ],
    outputs: [
      { label: "Insights", value: DEMO_INSIGHTS.length },
      { label: "Gaps", value: 1 },
      { label: "Trends", value: 1 },
      { label: "Conflicts", value: 1 },
    ],
    outputHeadline: `${DEMO_INSIGHTS.length} AI Insights produced`,
    achievement: "Every insight traceable to its supporting evidence.",
    nextObjective: "Calculate the Women's Drug Score.",
    nextLabel: "Continue to Drug Score",
  },
  "drug-score": {
    id: "drug-score",
    operation: "Calculate the Women's Drug Score for metformin in PCOS.",
    scientificInput: [
      { label: "Inputs", value: "Evidence · Graph · Intelligence" },
      { label: "Model", value: "Coverage · Quality · Representation · Completeness" },
    ],
    stages: [
      "Score coverage",
      "Score quality",
      "Score representation",
      "Score outcomes",
      "Compose",
    ],
    outputs: [
      { label: "Overall", value: DEMO_DRUG_SCORE.overall, format: "score" },
      { label: "Coverage", value: DEMO_DRUG_SCORE.breakdown[0].value },
      { label: "Quality", value: DEMO_DRUG_SCORE.breakdown[1].value },
      { label: "Representation", value: DEMO_DRUG_SCORE.breakdown[2].value },
    ],
    outputHeadline: `Drug Score ${DEMO_DRUG_SCORE.overall}/100 · Grade ${DEMO_DRUG_SCORE.grade}`,
    achievement: "An objective, explainable score with full breakdown.",
    nextObjective: "Compose the complete scientific project.",
    nextLabel: "Continue to Project Summary",
  },
  summary: {
    id: "summary",
    operation: "Compose the reproducible scientific project.",
    scientificInput: [
      { label: "Artifacts", value: "Sources · Evidence · Graph · Intelligence · Score" },
      { label: "Project", value: "Metformin × PCOS" },
    ],
    stages: ["Collect artifacts", "Version", "Snapshot", "Publish"],
    outputs: [
      { label: "Studies", value: TOTAL_STUDIES },
      { label: "Evidence Objects", value: DEMO_EVIDENCE_STATS.objects },
      { label: "Graph edges", value: DEMO_GRAPH_STATS.edges },
      { label: "Insights", value: DEMO_INSIGHTS.length },
    ],
    outputHeadline: "Scientific project assembled",
    achievement: "A complete reproducible project ready to share or extend.",
    nextObjective: "Return to WEIP with your project intact.",
    nextLabel: "Continue Using WEIP",
  },
};
