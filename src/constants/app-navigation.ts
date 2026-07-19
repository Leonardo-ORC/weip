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
  Briefcase,
  Bell,
  UserRound,
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

export const APP_NAV_SECTIONS: AppNavSection[] = [
  {
    title: "Workspace",
    items: [
      { label: "Dashboard", to: "/app/dashboard", icon: LayoutDashboard, description: "Overview" },
      { label: "Workspace", to: "/app/workspace", icon: Briefcase, description: "Your surfaces" },
      { label: "Projects", to: "/app/projects", icon: FolderKanban, description: "Research programs" },
      { label: "Collections", to: "/app/collections", icon: Library, description: "Curated evidence" },
    ],
  },
  {
    title: "Intelligence",
    items: [
      { label: "Evidence", to: "/app/evidence", icon: Database, description: "Scientific sources", badge: "Live" },
      { label: "Ontology", to: "/app/ontology", icon: Network, description: "Clinical concepts", badge: "Soon" },
      { label: "Research", to: "/app/research", icon: FlaskConical, description: "Discovery tools" },
      { label: "Pipeline", to: "/app/pipeline", icon: Workflow, description: "Processing" },
      { label: "Models", to: "/app/models", icon: Cpu, description: "Extraction engines" },
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
