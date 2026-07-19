import type { LucideIcon } from "lucide-react";

/* Platform modules */
export type ModuleStatus = "operational" | "planned" | "future" | "degraded";

export interface PlatformModule {
  id: string;
  name: string;
  description: string;
  icon: LucideIcon;
  status: ModuleStatus;
  version: string;
  availability: string;
  readiness: number; // 0-100
}

/* Health */
export type HealthStatus = "healthy" | "planned" | "future" | "degraded";
export interface HealthCheck {
  id: string;
  name: string;
  description: string;
  icon: LucideIcon;
  status: HealthStatus;
  latency?: string;
}

/* Projects */
export type ProjectStatus = "active" | "paused" | "planning" | "review";
export interface ProjectSummary {
  id: string;
  title: string;
  description: string;
  status: ProjectStatus;
  updatedAt: string;
  progress: number;
  owner: { name: string; initials: string };
  tag?: string;
}

/* Collections */
export interface CollectionSummary {
  id: string;
  name: string;
  items: number;
  updatedAt: string;
  status: "curated" | "draft" | "shared";
}

/* Activity */
export type ActivityTone = "default" | "primary" | "accent" | "success";
export interface ActivityEvent {
  id: string;
  title: string;
  description?: string;
  time: string;
  icon: LucideIcon;
  tone?: ActivityTone;
  actor?: string;
}

/* Notifications */
export type NotificationCategory = "system" | "research" | "platform" | "projects" | "security";
export interface NotificationItem {
  id: string;
  title: string;
  description: string;
  time: string;
  category: NotificationCategory;
  unread?: boolean;
}

/* Roadmap */
export type RoadmapPhase = "next" | "later" | "horizon";
export interface RoadmapModule {
  id: string;
  name: string;
  description: string;
  icon: LucideIcon;
  phase: RoadmapPhase;
  eta?: string;
}

/* Insights */
export interface InsightItem {
  id: string;
  label: string;
  value: string;
  hint?: string;
  icon: LucideIcon;
}

/* Quick actions */
export interface QuickAction {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  to: string;
  hint?: string;
}

/* Pipeline conceptual node */
export interface PipelineNode {
  id: string;
  name: string;
  status: "complete" | "ready" | "locked";
  description: string;
  icon: LucideIcon;
}

/* Global search entity */
export type SearchEntityKind = "project" | "collection" | "module" | "activity";
export interface SearchEntity {
  id: string;
  kind: SearchEntityKind;
  title: string;
  subtitle?: string;
  to?: string;
}

/* Widget layout contract (future drag/drop) */
export type WidgetId =
  | "welcome"
  | "quick-actions"
  | "platform-status"
  | "insights"
  | "recent-activity"
  | "active-projects"
  | "collections"
  | "pipeline-overview"
  | "system-health"
  | "future-modules"
  | "notifications";

export interface WidgetLayoutSlot {
  id: WidgetId;
  column: "primary" | "secondary" | "full";
  order: number;
  minHeight?: number;
}
