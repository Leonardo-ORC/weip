import { useMemo } from "react";
import {
  ACTIVE_PROJECTS,
  COLLECTIONS,
  DEFAULT_LAYOUT,
  HEALTH_CHECKS,
  INSIGHTS,
  NOTIFICATIONS,
  PIPELINE_NODES,
  PLATFORM_MODULES,
  QUICK_ACTIONS,
  RECENT_ACTIVITY,
  ROADMAP,
  SEARCH_ENTITIES,
} from "../data/mocks";

/**
 * Aggregated dashboard data source.
 * Currently mock-only. Future sprints will replace this hook
 * with real service calls without changing widget contracts.
 */
export function useDashboardData() {
  return useMemo(
    () => ({
      modules: PLATFORM_MODULES,
      health: HEALTH_CHECKS,
      activity: RECENT_ACTIVITY,
      projects: ACTIVE_PROJECTS,
      collections: COLLECTIONS,
      notifications: NOTIFICATIONS,
      roadmap: ROADMAP,
      insights: INSIGHTS,
      quickActions: QUICK_ACTIONS,
      pipeline: PIPELINE_NODES,
      search: SEARCH_ENTITIES,
      layout: DEFAULT_LAYOUT,
    }),
    [],
  );
}
