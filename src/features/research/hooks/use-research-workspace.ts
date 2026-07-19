import { useCallback, useMemo, useState } from "react";
import {
  CollectionService,
  EMPTY_WORKSPACE_FILTERS,
  HypothesisService,
  NotesService,
  ProjectService,
  QuestionService,
  ResearchWorkspaceService,
  TimelineService,
  WorkspaceSearchService,
} from "../services";
import type {
  Priority,
  ResearchArea,
  ResearchStatus,
  WorkspaceFilters,
} from "../types";

function toggle<T>(arr: T[], v: T): T[] {
  return arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v];
}

export function useResearchWorkspace() {
  const allProjects = useMemo(() => ProjectService.list(), []);
  const allQuestions = useMemo(() => QuestionService.list(), []);
  const allHypotheses = useMemo(() => HypothesisService.list(), []);
  const allCollections = useMemo(() => CollectionService.list(), []);
  const timeline = useMemo(() => TimelineService.list(), []);
  const notes = useMemo(() => NotesService.list(), []);
  const statistics = useMemo(() => ResearchWorkspaceService.statistics(), []);
  const owners = useMemo(() => ResearchWorkspaceService.owners(), []);

  const [filters, setFilters] = useState<WorkspaceFilters>(EMPTY_WORKSPACE_FILTERS);
  const [selectedProjectId, setSelectedProjectId] = useState<string>(allProjects[0]?.id ?? "");

  const projects = useMemo(
    () => WorkspaceSearchService.projects(allProjects, filters),
    [allProjects, filters],
  );
  const questions = useMemo(
    () => WorkspaceSearchService.questions(allQuestions, filters.query),
    [allQuestions, filters.query],
  );
  const hypotheses = useMemo(
    () => WorkspaceSearchService.hypotheses(allHypotheses, filters.query),
    [allHypotheses, filters.query],
  );
  const collections = useMemo(
    () => WorkspaceSearchService.collections(allCollections, filters.query),
    [allCollections, filters.query],
  );
  const notesFiltered = useMemo(
    () => WorkspaceSearchService.notes(notes, filters.query),
    [notes, filters.query],
  );

  const selectedProject = useMemo(
    () => allProjects.find((p) => p.id === selectedProjectId) ?? allProjects[0],
    [allProjects, selectedProjectId],
  );

  const setQuery = useCallback(
    (query: string) => setFilters((f) => ({ ...f, query })),
    [],
  );
  const toggleStatus = useCallback(
    (s: ResearchStatus) => setFilters((f) => ({ ...f, statuses: toggle(f.statuses, s) })),
    [],
  );
  const toggleArea = useCallback(
    (a: ResearchArea) => setFilters((f) => ({ ...f, areas: toggle(f.areas, a) })),
    [],
  );
  const togglePriority = useCallback(
    (p: Priority) => setFilters((f) => ({ ...f, priorities: toggle(f.priorities, p) })),
    [],
  );
  const toggleOwner = useCallback(
    (id: string) => setFilters((f) => ({ ...f, owners: toggle(f.owners, id) })),
    [],
  );
  const setUpdatedWithin = useCallback(
    (days: number | null) => setFilters((f) => ({ ...f, updatedWithinDays: days })),
    [],
  );
  const resetFilters = useCallback(() => setFilters(EMPTY_WORKSPACE_FILTERS), []);

  const activeFilterCount =
    filters.statuses.length +
    filters.areas.length +
    filters.priorities.length +
    filters.owners.length +
    (filters.updatedWithinDays !== null ? 1 : 0);

  return {
    filters,
    setQuery,
    toggleStatus,
    toggleArea,
    togglePriority,
    toggleOwner,
    setUpdatedWithin,
    resetFilters,
    activeFilterCount,
    projects,
    questions,
    hypotheses,
    collections,
    notes: notesFiltered,
    timeline,
    statistics,
    owners,
    selectedProject,
    selectProject: setSelectedProjectId,
  };
}

export type ResearchWorkspaceState = ReturnType<typeof useResearchWorkspace>;
