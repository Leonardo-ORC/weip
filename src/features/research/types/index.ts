import type { LucideIcon } from "lucide-react";

export type ResearchStatus = "active" | "planning" | "paused" | "completed" | "archived";
export type Priority = "critical" | "high" | "medium" | "low";
export type ResearchArea =
  | "hormonal-health"
  | "reproductive-health"
  | "menopause"
  | "pcos"
  | "endometriosis"
  | "pregnancy"
  | "oncology"
  | "cardiometabolic";

export type QuestionStatus = "open" | "investigating" | "answered" | "inconclusive";
export type HypothesisStatus =
  | "draft"
  | "under-review"
  | "supported"
  | "refuted"
  | "inconclusive";
export type Confidence = "very-low" | "low" | "moderate" | "high" | "very-high";
export type CollectionStatus = "draft" | "curated" | "shared" | "locked";

export interface ResearchOwner {
  id: string;
  name: string;
  initials: string;
  role: string;
}

export interface ResearchProject {
  id: string;
  title: string;
  description: string;
  area: ResearchArea;
  status: ResearchStatus;
  priority: Priority;
  progress: number; // 0-100
  evidenceCount: number;
  collectionCount: number;
  questionCount: number;
  hypothesisCount: number;
  owner: ResearchOwner;
  collaborators: ResearchOwner[];
  updatedAt: string; // ISO
  createdAt: string;
  tags: string[];
}

export interface ResearchQuestion {
  id: string;
  projectId: string;
  question: string;
  rationale: string;
  status: QuestionStatus;
  priority: Priority;
  linkedHypotheses: number;
  linkedEvidence: number;
  updatedAt: string;
  tags: string[];
}

export interface Hypothesis {
  id: string;
  projectId: string;
  title: string;
  description: string;
  status: HypothesisStatus;
  confidence: Confidence;
  supporting: number;
  contradicting: number;
  updatedAt: string;
  tags: string[];
}

export interface ResearchCollection {
  id: string;
  projectId: string;
  name: string;
  description: string;
  evidenceCount: number;
  status: CollectionStatus;
  tags: string[];
  updatedAt: string;
  owner: ResearchOwner;
}

export type TimelineEventKind =
  | "project-created"
  | "evidence-added"
  | "hypothesis-updated"
  | "collection-modified"
  | "note-created"
  | "question-added"
  | "milestone";

export interface TimelineEvent {
  id: string;
  kind: TimelineEventKind;
  title: string;
  description: string;
  projectId?: string;
  actor: ResearchOwner;
  at: string; // ISO
}

export interface ResearchNote {
  id: string;
  title: string;
  summary: string;
  projectId: string;
  updatedAt: string;
  author: ResearchOwner;
  tags: string[];
}

export interface WorkspaceStatistics {
  projects: number;
  activeQuestions: number;
  hypotheses: number;
  collections: number;
  evidenceLinked: number;
  recentSessions: number;
}

export interface WorkspaceFilters {
  query: string;
  statuses: ResearchStatus[];
  areas: ResearchArea[];
  owners: string[];
  priorities: Priority[];
  updatedWithinDays: number | null;
}

export interface QuickAction {
  id: string;
  label: string;
  description: string;
  icon: LucideIcon;
  kind:
    | "new-project"
    | "new-question"
    | "new-hypothesis"
    | "new-collection"
    | "new-note"
    | "import-evidence";
}

export const RESEARCH_AREA_LABEL: Record<ResearchArea, string> = {
  "hormonal-health": "Hormonal Health",
  "reproductive-health": "Reproductive Health",
  menopause: "Menopause",
  pcos: "PCOS",
  endometriosis: "Endometriosis",
  pregnancy: "Pregnancy",
  oncology: "Oncology",
  cardiometabolic: "Cardiometabolic",
};

export const STATUS_LABEL: Record<ResearchStatus, string> = {
  active: "Active",
  planning: "Planning",
  paused: "Paused",
  completed: "Completed",
  archived: "Archived",
};

export const PRIORITY_LABEL: Record<Priority, string> = {
  critical: "Critical",
  high: "High",
  medium: "Medium",
  low: "Low",
};
