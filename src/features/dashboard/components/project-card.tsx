import { Link } from "@tanstack/react-router";
import { ArrowUpRight, FolderKanban } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ProjectStatus, ProjectSummary } from "../types";
import { DashboardWidget } from "./widget";
import { EmptyProjects } from "./empty-states";

const STATUS: Record<ProjectStatus, { label: string; className: string }> = {
  active: { label: "Active", className: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" },
  paused: { label: "Paused", className: "bg-muted text-muted-foreground" },
  planning: { label: "Planning", className: "bg-primary/10 text-primary" },
  review: { label: "Review", className: "bg-amber-500/10 text-amber-600 dark:text-amber-400" },
};

export function ProjectCard({ project }: { project: ProjectSummary }) {
  const s = STATUS[project.status];
  return (
    <Link
      to="/app/projects"
      aria-label={project.title}
      className="group flex h-full flex-col justify-between rounded-2xl border border-hairline bg-background/50 p-5 transition hover:border-border"
    >
      <div>
        <div className="flex items-center justify-between gap-3">
          {project.tag ? (
            <span className="rounded-full border border-hairline px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
              {project.tag}
            </span>
          ) : <span />}
          <span className={cn("rounded-full px-2 py-0.5 text-[10px] font-medium", s.className)}>
            {s.label}
          </span>
        </div>
        <h3 className="font-display mt-4 text-lg leading-tight text-foreground">{project.title}</h3>
        <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
          {project.description}
        </p>
      </div>
      <div className="mt-6">
        <div className="flex items-center justify-between text-[11px] text-muted-foreground">
          <span>Progress</span>
          <span>{project.progress}%</span>
        </div>
        <div className="mt-1.5 h-1 overflow-hidden rounded-full bg-secondary">
          <div className="h-full rounded-full bg-primary" style={{ width: `${project.progress}%` }} />
        </div>
        <div className="mt-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="grid h-6 w-6 place-items-center rounded-full bg-secondary font-mono text-[10px] text-foreground/80">
              {project.owner.initials}
            </span>
            <span className="text-xs text-muted-foreground">{project.owner.name}</span>
          </div>
          <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
            {project.updatedAt}
          </span>
        </div>
      </div>
    </Link>
  );
}

interface ProjectsWidgetProps {
  projects: ProjectSummary[];
}

export function ProjectsWidget({ projects }: ProjectsWidgetProps) {
  return (
    <DashboardWidget
      eyebrow="Research"
      title="Active projects"
      subtitle="Illustrative research programs."
      action={
        <Link
          to="/app/projects"
          className="inline-flex items-center gap-1 text-xs font-medium text-foreground transition hover:opacity-80"
        >
          Open projects <ArrowUpRight className="h-3.5 w-3.5" />
        </Link>
      }
    >
      {projects.length === 0 ? (
        <EmptyProjects />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {projects.map((p) => (
            <ProjectCard key={p.id} project={p} />
          ))}
        </div>
      )}
    </DashboardWidget>
  );
}

export { FolderKanban };
