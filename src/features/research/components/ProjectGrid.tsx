import { cn } from "@/lib/utils";
import type { ResearchProject } from "../types";
import { RESEARCH_AREA_LABEL } from "../types";
import {
  OwnerAvatar,
  PriorityBadge,
  RelativeTime,
  StatusBadge,
} from "./ResearchBadge";

export function ProjectCard({
  project,
  active,
  onSelect,
}: {
  project: ResearchProject;
  active?: boolean;
  onSelect?: (id: string) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onSelect?.(project.id)}
      className={cn(
        "group flex h-full w-full flex-col rounded-2xl border bg-background/60 p-5 text-left transition",
        active
          ? "border-foreground/40 shadow-soft"
          : "border-hairline hover:border-foreground/25 hover:bg-background",
      )}
    >
      <div className="mb-3 flex items-center gap-2">
        <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
          {RESEARCH_AREA_LABEL[project.area]}
        </span>
        <span className="text-muted-foreground/40">·</span>
        <RelativeTime iso={project.updatedAt} />
      </div>
      <h3 className="font-display text-lg leading-snug tracking-tight text-foreground">
        {project.title}
      </h3>
      <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
        {project.description}
      </p>

      <div className="mt-4 flex flex-wrap items-center gap-1.5">
        <StatusBadge status={project.status} />
        <PriorityBadge priority={project.priority} />
        {project.tags.slice(0, 2).map((t) => (
          <span
            key={t}
            className="rounded-full border border-hairline px-2 py-0.5 text-[10px] text-muted-foreground"
          >
            {t}
          </span>
        ))}
      </div>

      <div className="mt-5">
        <div className="mb-1.5 flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
          <span>Progress</span>
          <span>{project.progress}%</span>
        </div>
        <div className="h-1 rounded-full bg-secondary">
          <div
            className="h-full rounded-full bg-foreground/80"
            style={{ width: `${project.progress}%` }}
          />
        </div>
      </div>

      <div className="mt-5 grid grid-cols-3 gap-3 border-t border-hairline pt-4 text-center">
        <Stat value={project.evidenceCount} label="Evidence" />
        <Stat value={project.collectionCount} label="Collections" />
        <Stat value={project.questionCount} label="Questions" />
      </div>

      <div className="mt-4 flex items-center justify-between">
        <div className="flex -space-x-1.5">
          <OwnerAvatar initials={project.owner.initials} name={project.owner.name} />
          {project.collaborators.slice(0, 3).map((c) => (
            <OwnerAvatar key={c.id} initials={c.initials} name={c.name} />
          ))}
        </div>
        <span className="text-[11px] text-muted-foreground">{project.owner.name}</span>
      </div>
    </button>
  );
}

function Stat({ value, label }: { value: number; label: string }) {
  return (
    <div>
      <div className="font-display text-base tracking-tight">{value}</div>
      <div className="font-mono text-[9px] uppercase tracking-[0.22em] text-muted-foreground">
        {label}
      </div>
    </div>
  );
}

export function ProjectGrid({
  projects,
  selectedId,
  onSelect,
}: {
  projects: ResearchProject[];
  selectedId?: string;
  onSelect?: (id: string) => void;
}) {
  if (projects.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-hairline bg-background/40 p-10 text-center text-sm text-muted-foreground">
        No projects match the current filters.
      </div>
    );
  }
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {projects.map((p) => (
        <ProjectCard key={p.id} project={p} active={p.id === selectedId} onSelect={onSelect} />
      ))}
    </div>
  );
}
