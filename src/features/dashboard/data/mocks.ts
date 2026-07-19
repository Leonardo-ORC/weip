import {
  Activity,
  Bell,
  BookOpen,
  Bot,
  Boxes,
  Brain,
  Cpu,
  Database,
  FileSearch,
  FlaskConical,
  FolderKanban,
  GitBranch,
  Layers,
  Library,
  Lightbulb,
  LineChart,
  Lock,
  Network,
  Plus,
  ShieldCheck,
  Sparkles,
  Users,
  Workflow,
} from "lucide-react";
import type {
  ActivityEvent,
  CollectionSummary,
  HealthCheck,
  InsightItem,
  NotificationItem,
  PipelineNode,
  PlatformModule,
  ProjectSummary,
  QuickAction,
  RoadmapModule,
  SearchEntity,
  WidgetLayoutSlot,
} from "../types";

export const PLATFORM_MODULES: PlatformModule[] = [
  { id: "sources", name: "Scientific Sources", description: "8 providers registered under a common contract.", icon: Database, status: "operational", version: "v0.1.0", availability: "Catalog live", readiness: 100 },
  { id: "processing", name: "Processing Framework", description: "8 deterministic stages armed for orchestration.", icon: Workflow, status: "planned", version: "v0.1.0", availability: "Runtime pending", readiness: 65 },
  { id: "extraction", name: "Extraction Engine", description: "5 model providers · 9 prompt domains.", icon: Cpu, status: "planned", version: "v0.1.0", availability: "Runtime pending", readiness: 60 },
  { id: "ontology", name: "Clinical Ontology", description: "Hormones, cycles, conditions.", icon: Network, status: "future", version: "—", availability: "Next sprint", readiness: 15 },
  { id: "graph", name: "Knowledge Graph", description: "Concept-level evidence links.", icon: GitBranch, status: "future", version: "—", availability: "Horizon", readiness: 5 },
  { id: "intelligence", name: "Research Intelligence", description: "Explainable insights & research gaps.", icon: Sparkles, status: "future", version: "—", availability: "Horizon", readiness: 5 },
];

export const HEALTH_CHECKS: HealthCheck[] = [
  { id: "auth", name: "Authentication", description: "Supabase session & profiles.", icon: ShieldCheck, status: "healthy", latency: "42 ms" },
  { id: "sources", name: "Scientific Sources", description: "Provider catalog reachable.", icon: Database, status: "healthy", latency: "—" },
  { id: "processing", name: "Processing", description: "Pipeline registry armed.", icon: Workflow, status: "planned" },
  { id: "extraction", name: "Extraction", description: "Model + prompt registries armed.", icon: Cpu, status: "planned" },
  { id: "database", name: "Database", description: "Profiles table live.", icon: Boxes, status: "healthy", latency: "18 ms" },
  { id: "ai", name: "Future AI", description: "Reserved capacity.", icon: Bot, status: "future" },
  { id: "graph", name: "Future Graph", description: "Reserved capacity.", icon: GitBranch, status: "future" },
];

export const RECENT_ACTIVITY: ActivityEvent[] = [
  { id: "a1", title: "Europe PMC source registered", description: "Added to the scientific catalog.", time: "2m", icon: Database, tone: "primary", actor: "System" },
  { id: "a2", title: "Pipeline framework updated", description: "8 processing stages now armed.", time: "1h", icon: Workflow, actor: "Platform" },
  { id: "a3", title: "Extraction model registered", description: "Anthropic Claude added to the registry.", time: "3h", icon: Cpu, tone: "accent", actor: "System" },
  { id: "a4", title: "Ontology module planned", description: "Slot reserved for next sprint.", time: "Yesterday", icon: Network, actor: "Roadmap" },
  { id: "a5", title: "Project created", description: "Perimenopause hormonal signals.", time: "2d", icon: FolderKanban, tone: "success", actor: "You" },
  { id: "a6", title: "Workspace updated", description: "Sidebar navigation refined.", time: "3d", icon: Layers, actor: "Platform" },
];

export const ACTIVE_PROJECTS: ProjectSummary[] = [
  { id: "p1", title: "Perimenopause hormonal signals", description: "FSH, estradiol and cycle irregularity across international cohorts.", status: "active", updatedAt: "3h ago", progress: 62, owner: { name: "You", initials: "YO" }, tag: "Cohort" },
  { id: "p2", title: "Endometriosis clinical landscape", description: "Interventional trials, endpoints and eligibility across phases.", status: "review", updatedAt: "1d ago", progress: 38, owner: { name: "M. Alvarez", initials: "MA" }, tag: "Trials" },
  { id: "p3", title: "MHT drug safety index", description: "Menopausal hormone therapy adverse-event evidence across regulators.", status: "active", updatedAt: "Yesterday", progress: 81, owner: { name: "S. Okafor", initials: "SO" }, tag: "Safety" },
  { id: "p4", title: "PCOS biomarker atlas", description: "Longitudinal biomarker signatures for PCOS phenotyping.", status: "planning", updatedAt: "4d ago", progress: 12, owner: { name: "R. Chen", initials: "RC" }, tag: "Biomarkers" },
];

export const COLLECTIONS: CollectionSummary[] = [
  { id: "c1", name: "Hormone therapy — landmark RCTs", items: 48, updatedAt: "2h ago", status: "curated" },
  { id: "c2", name: "Endometriosis diagnostic evidence", items: 132, updatedAt: "Yesterday", status: "shared" },
  { id: "c3", name: "Menopause guidelines (2020–2026)", items: 27, updatedAt: "3d ago", status: "curated" },
  { id: "c4", name: "PCOS working set", items: 9, updatedAt: "1w ago", status: "draft" },
];

export const NOTIFICATIONS: NotificationItem[] = [
  { id: "n1", title: "Extraction engine ready", description: "5 model providers registered.", time: "2m", category: "platform", unread: true },
  { id: "n2", title: "Pipeline framework armed", description: "8 stages available for orchestration.", time: "1h", category: "platform", unread: true },
  { id: "n3", title: "New evidence source", description: "Europe PMC added to the catalog.", time: "6h", category: "research", unread: true },
  { id: "n4", title: "Project shared with you", description: "M. Alvarez invited you to Endometriosis landscape.", time: "1d", category: "projects" },
  { id: "n5", title: "Security review scheduled", description: "Quarterly access review on Aug 3.", time: "2d", category: "security" },
  { id: "n6", title: "System maintenance", description: "No downtime expected.", time: "3d", category: "system" },
];

export const ROADMAP: RoadmapModule[] = [
  
  { id: "r2", name: "Knowledge Graph", description: "Concept-level evidence linking.", icon: GitBranch, phase: "next", eta: "Q3" },
  { id: "r3", name: "Research Gap Engine", description: "Systematic detection of missing evidence.", icon: FileSearch, phase: "later", eta: "Q4" },
  { id: "r4", name: "Evidence Explorer", description: "Faceted navigation across structured evidence.", icon: BookOpen, phase: "later", eta: "Q4" },
  { id: "r5", name: "Clinical Intelligence", description: "Explainable, cited scientific answers.", icon: Brain, phase: "horizon" },
  { id: "r6", name: "Explainability", description: "Provenance & confidence across every claim.", icon: Lightbulb, phase: "horizon" },
  { id: "r7", name: "Developer API", description: "Programmatic access to evidence & intelligence.", icon: Cpu, phase: "horizon" },
];

export const INSIGHTS: InsightItem[] = [
  { id: "i1", label: "Scientific sources", value: "8", hint: "Available in catalog", icon: Database },
  { id: "i2", label: "Extraction models", value: "5", hint: "Registered engines", icon: Cpu },
  { id: "i3", label: "Prompt domains", value: "9", hint: "Scientific coverage", icon: FlaskConical },
  { id: "i4", label: "Pipeline stages", value: "8", hint: "Deterministic contract", icon: Workflow },
  { id: "i5", label: "Active projects", value: "4", hint: "Illustrative", icon: FolderKanban },
  { id: "i6", label: "Collections", value: "12", hint: "Curated sets", icon: Library },
];

export const QUICK_ACTIONS: QuickAction[] = [
  { id: "qa1", title: "Browse Evidence", description: "Explore the scientific source catalog.", icon: Database, to: "/app/evidence", hint: "8 providers" },
  { id: "qa2", title: "Explore Ontology", description: "Structured clinical concepts.", icon: Network, to: "/app/ontology", hint: "Soon" },
  { id: "qa3", title: "Open Pipeline", description: "Ingestion & processing stages.", icon: Workflow, to: "/app/pipeline", hint: "8 stages" },
  { id: "qa4", title: "New Project", description: "Start a new research program.", icon: Plus, to: "/app/projects" },
  { id: "qa5", title: "Open Collections", description: "Curated scientific evidence.", icon: Library, to: "/app/collections" },
  { id: "qa6", title: "View Research", description: "Discovery tools and hypotheses.", icon: FlaskConical, to: "/app/research" },
  { id: "qa7", title: "AI Assistant", description: "Research copilot — coming soon.", icon: Bot, to: "/app/models", hint: "Soon" },
];

export const PIPELINE_NODES: PipelineNode[] = [
  { id: "sources", name: "Scientific Sources", status: "complete", description: "Catalog of curated providers.", icon: Database },
  { id: "processing", name: "Processing", status: "ready", description: "8-stage deterministic pipeline.", icon: Workflow },
  { id: "extraction", name: "Extraction", status: "ready", description: "Multi-model extraction engine.", icon: Cpu },
  { id: "ontology", name: "Ontology", status: "locked", description: "Clinical concept model.", icon: Network },
  { id: "graph", name: "Knowledge Graph", status: "locked", description: "Concept-level evidence links.", icon: GitBranch },
  { id: "intelligence", name: "Research Intelligence", status: "locked", description: "Explainable insights & gaps.", icon: Sparkles },
];

export const SEARCH_ENTITIES: SearchEntity[] = [
  ...ACTIVE_PROJECTS.map((p) => ({ id: p.id, kind: "project" as const, title: p.title, subtitle: p.tag, to: "/app/projects" })),
  ...COLLECTIONS.map((c) => ({ id: c.id, kind: "collection" as const, title: c.name, subtitle: `${c.items} items`, to: "/app/collections" })),
  ...PLATFORM_MODULES.map((m) => ({ id: m.id, kind: "module" as const, title: m.name, subtitle: m.availability })),
  ...RECENT_ACTIVITY.slice(0, 4).map((a) => ({ id: a.id, kind: "activity" as const, title: a.title, subtitle: a.time })),
];

/* Layout contract — future drag/drop composition */
export const DEFAULT_LAYOUT: WidgetLayoutSlot[] = [
  { id: "welcome", column: "full", order: 0 },
  { id: "quick-actions", column: "full", order: 1 },
  { id: "insights", column: "full", order: 2 },
  { id: "platform-status", column: "primary", order: 3 },
  { id: "recent-activity", column: "secondary", order: 4 },
  { id: "active-projects", column: "full", order: 5 },
  { id: "collections", column: "primary", order: 6 },
  { id: "notifications", column: "secondary", order: 7 },
  { id: "pipeline-overview", column: "full", order: 8 },
  { id: "system-health", column: "primary", order: 9 },
  { id: "future-modules", column: "secondary", order: 10 },
];

export const ICONS = { Activity, Bell, Lock, LineChart, Users };
