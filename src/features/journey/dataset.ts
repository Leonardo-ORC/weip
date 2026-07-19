/**
 * Deterministic demonstration dataset used across the Guided Research Journey.
 * Never randomized. Every judge sees the same scientific project.
 */

export const DEMO_PROJECT = {
  id: "demo-metformin-pcos",
  title: "Metformin in women with Polycystic Ovary Syndrome (PCOS)",
  question:
    "How well is metformin studied for reproductive and metabolic outcomes in women with PCOS?",
  drug: "Metformin",
  population: "Adult women with PCOS",
  outcomes: ["Ovulation restoration", "Insulin resistance", "Live birth rate"],
} as const;

export const DEMO_SOURCES = [
  { provider: "PubMed", count: 8, label: "RCTs and meta-analyses" },
  { provider: "ClinicalTrials.gov", count: 3, label: "Registered trials" },
  { provider: "OpenAlex", count: 1, label: "Review article" },
] as const;

export const DEMO_EVIDENCE_STATS = {
  objects: 12,
  populations: 12,
  interventions: 4,
  outcomes: 9,
} as const;

export const DEMO_GRAPH_STATS = {
  nodes: 47,
  edges: 84,
  clusters: 3,
} as const;

export const DEMO_INSIGHTS = [
  {
    kind: "gap",
    label: "Under-representation of women over 40",
    detail: "Only 2 of 12 studies included participants above 40 years of age.",
  },
  {
    kind: "trend",
    label: "Rising interest in combined therapies",
    detail: "Metformin + inositol combinations grew 3× in publications since 2020.",
  },
  {
    kind: "conflict",
    label: "Heterogeneous ovulation outcomes",
    detail: "Effect sizes vary across BMI subgroups — worth stratifying.",
  },
] as const;

export const DEMO_DRUG_SCORE = {
  overall: 68,
  grade: "B",
  breakdown: [
    { label: "Evidence coverage", value: 74, note: "12 studies, 3 sources" },
    { label: "Study quality", value: 71, note: "9 RCTs, 3 registered trials" },
    { label: "Population representation", value: 58, note: "Age > 40 under-studied" },
    { label: "Outcome completeness", value: 69, note: "9 of 12 target outcomes covered" },
  ],
} as const;

/**
 * Preset scientific scenario applied to every workspace when the
 * Guided Research Journey is active. Ensures no form starts empty —
 * researchers land on a fully configured investigation.
 */
export const DEMO_PRESET = {
  // Scientific Sources workspace
  sources: {
    term: "Metformin PCOS",
    condition: "Polycystic ovary syndrome",
    drug: "Metformin",
    disease: "",
    author: "",
    journal: "",
    yearFrom: "2015",
    yearTo: "2025",
    sources: ["pubmed", "clinicaltrials", "openalex"] as const,
    sort: "relevance" as const,
    pageSize: 15,
    autoSubmit: true,
  },
  // Evidence Explorer workspace
  evidence: {
    query: "Metformin",
    drugs: ["Metformin"],
    conditions: ["Polycystic ovary syndrome"],
    hormonalContexts: ["reproductive"] as const,
  },
  // Research workspace
  research: {
    query: "Metformin PCOS",
  },
} as const;
