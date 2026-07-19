import {
  COLLECTIONS,
  HYPOTHESES,
  NOTES,
  OWNERS,
  PROJECTS,
  QUESTIONS,
  STATISTICS,
  TIMELINE,
} from "../mock";
import type {
  Hypothesis,
  ResearchCollection,
  ResearchNote,
  ResearchOwner,
  ResearchProject,
  ResearchQuestion,
  TimelineEvent,
  WorkspaceFilters,
  WorkspaceStatistics,
} from "../types";

export const EMPTY_WORKSPACE_FILTERS: WorkspaceFilters = {
  query: "",
  statuses: [],
  areas: [],
  owners: [],
  priorities: [],
  updatedWithinDays: null,
};

export interface IProjectService {
  list(): ResearchProject[];
  byId(id: string): ResearchProject | undefined;
  byArea(area: string): ResearchProject[];
}
export interface IQuestionService {
  list(): ResearchQuestion[];
  byProject(id: string): ResearchQuestion[];
}
export interface IHypothesisService {
  list(): Hypothesis[];
  byProject(id: string): Hypothesis[];
}
export interface ICollectionService {
  list(): ResearchCollection[];
  byProject(id: string): ResearchCollection[];
}
export interface ITimelineService {
  list(): TimelineEvent[];
}
export interface INotesService {
  list(): ResearchNote[];
  byProject(id: string): ResearchNote[];
}
export interface IResearchWorkspaceService {
  statistics(): WorkspaceStatistics;
  owners(): ResearchOwner[];
}

export const ProjectService: IProjectService = {
  list: () => PROJECTS,
  byId: (id) => PROJECTS.find((p) => p.id === id),
  byArea: (area) => PROJECTS.filter((p) => p.area === area),
};

export const QuestionService: IQuestionService = {
  list: () => QUESTIONS,
  byProject: (id) => QUESTIONS.filter((q) => q.projectId === id),
};

export const HypothesisService: IHypothesisService = {
  list: () => HYPOTHESES,
  byProject: (id) => HYPOTHESES.filter((h) => h.projectId === id),
};

export const CollectionService: ICollectionService = {
  list: () => COLLECTIONS,
  byProject: (id) => COLLECTIONS.filter((c) => c.projectId === id),
};

export const TimelineService: ITimelineService = {
  list: () =>
    [...TIMELINE].sort((a, b) => new Date(b.at).getTime() - new Date(a.at).getTime()),
};

export const NotesService: INotesService = {
  list: () =>
    [...NOTES].sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()),
  byProject: (id) => NOTES.filter((n) => n.projectId === id),
};

export const ResearchWorkspaceService: IResearchWorkspaceService = {
  statistics: () => STATISTICS,
  owners: () => OWNERS,
};

// ---------- search / filter helpers ----------

function matches(text: string, q: string): boolean {
  if (!q) return true;
  return text.toLowerCase().includes(q.toLowerCase());
}

function isRecent(iso: string, days: number | null): boolean {
  if (days === null) return true;
  return Date.now() - new Date(iso).getTime() <= days * 86_400_000;
}

export const WorkspaceSearchService = {
  projects(items: ResearchProject[], f: WorkspaceFilters): ResearchProject[] {
    return items.filter(
      (p) =>
        (matches(p.title, f.query) ||
          matches(p.description, f.query) ||
          p.tags.some((t) => matches(t, f.query))) &&
        (f.statuses.length === 0 || f.statuses.includes(p.status)) &&
        (f.areas.length === 0 || f.areas.includes(p.area)) &&
        (f.priorities.length === 0 || f.priorities.includes(p.priority)) &&
        (f.owners.length === 0 || f.owners.includes(p.owner.id)) &&
        isRecent(p.updatedAt, f.updatedWithinDays),
    );
  },
  questions(items: ResearchQuestion[], q: string): ResearchQuestion[] {
    return items.filter(
      (i) => matches(i.question, q) || matches(i.rationale, q) || i.tags.some((t) => matches(t, q)),
    );
  },
  hypotheses(items: Hypothesis[], q: string): Hypothesis[] {
    return items.filter(
      (i) => matches(i.title, q) || matches(i.description, q) || i.tags.some((t) => matches(t, q)),
    );
  },
  collections(items: ResearchCollection[], q: string): ResearchCollection[] {
    return items.filter(
      (i) => matches(i.name, q) || matches(i.description, q) || i.tags.some((t) => matches(t, q)),
    );
  },
  notes(items: ResearchNote[], q: string): ResearchNote[] {
    return items.filter(
      (i) => matches(i.title, q) || matches(i.summary, q) || i.tags.some((t) => matches(t, q)),
    );
  },
};
