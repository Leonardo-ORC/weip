import type { LucideIcon } from "lucide-react";
import {
  LayoutDashboard,
  Database,
  Network,
  FlaskConical,
  FolderKanban,
  Library,
  Workflow,
  Cpu,
  Settings2,
  LifeBuoy,
  Bell,
  UserRound,
  Radio,
  GitBranch,
  Sparkles,
} from "lucide-react";

export interface AppNavItem {
  label: string;
  to: string;
  icon: LucideIcon;
  description?: string;
  badge?: string;
}

export interface AppNavSection {
  title?: string;
  items: AppNavItem[];
}

/**
 * The sidebar teaches the platform's mental model:
 *   Sources → Evidence → Graph → Research → Projects
 *
 * Primary workflow surfaces receive the highest visual priority.
 * Supporting tools remain available but do not compete visually.
 */
export const APP_NAV_SECTIONS: AppNavSection[] = [
  {
    title: "Primary workflow",
    items: [
      { label: "Dashboard", to: "/app/dashboard", icon: LayoutDashboard },
      { label: "Scientific Sources", to: "/app/sources", icon: Radio },
      { label: "Evidence", to: "/app/evidence", icon: Database },
      { label: "Knowledge Graph", to: "/app/graph", icon: GitBranch },
      { label: "Research", to: "/app/research", icon: FlaskConical },
      { label: "Projects", to: "/app/projects", icon: FolderKanban },
    ],
  },
  {
    title: "Supporting tools",
    items: [
      { label: "Guided Journey", to: "/app/journey", icon: Sparkles, badge: "Demo" },
      { label: "Collections", to: "/app/collections", icon: Library },
      { label: "Ontology", to: "/app/ontology", icon: Network },
      { label: "Pipeline", to: "/app/pipeline", icon: Workflow },
      { label: "Models", to: "/app/models", icon: Cpu },
    ],
  },
];

export const APP_NAV_FOOTER: AppNavItem[] = [
  { label: "Settings", to: "/app/settings", icon: Settings2 },
  { label: "Help", to: "/app/help", icon: LifeBuoy },
];

export const APP_USER_MENU: AppNavItem[] = [
  { label: "Profile", to: "/app/profile", icon: UserRound },
  { label: "Notifications", to: "/app/notifications", icon: Bell },
  { label: "Settings", to: "/app/settings", icon: Settings2 },
];
