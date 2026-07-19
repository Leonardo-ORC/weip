import { Link } from "@tanstack/react-router";
import { ArrowRight, FileText, FolderKanban } from "lucide-react";
import { DashboardWidget } from "@/features/dashboard";
import {
  NotesService,
  ProjectService,
  QuestionService,
  ResearchWorkspaceService,
  TimelineService,
} from "../services";
import { StatusBadge } from "./ResearchBadge";

export function ResearchReadyWidget() {
  const stats = ResearchWorkspaceService.statistics();
  const projects = ProjectService.list().filter((p) => p.status === "active").slice(0, 3);
  const notes = NotesService.list().slice(0, 3);
  const questions = QuestionService.list().filter((q) => q.status !== "answered").length;
  const activity = TimelineService.list().slice(0, 3);

  return (
    <DashboardWidget
      eyebrow="Research"
      title="Research Workspace"
      subtitle="Projects, questions, hypotheses and collections are live."
      action={
        <Link
          to="/app/research"
          className="inline-flex items-center gap-1 rounded-full border border-hairline px-3 py-1 text-xs text-foreground transition hover:bg-secondary"
        >
          Open workspace <ArrowRight className="h-3 w-3" />
        </Link>
      }
    >
      <div className="grid gap-5 lg:grid-cols-3">
        <div className="grid grid-cols-4 gap-3 lg:col-span-3">
          <Stat label="Active projects" value={stats.projects} />
          <Stat label="Open questions" value={questions} />
          <Stat label="Collections" value={stats.collections} />
          <Stat label="Notes" value={notes.length} />
        </div>

        <div className="lg:col-span-2">
          <div className="mb-2 font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
            Active projects
          </div>
          <ul className="grid gap-2">
            {projects.map((p) => (
              <li
                key={p.id}
                className="flex items-center gap-3 rounded-lg border border-hairline bg-background/40 p-2.5"
              >
                <div className="grid h-7 w-7 place-items-center rounded-md bg-secondary text-foreground/80">
                  <FolderKanban className="h-3.5 w-3.5" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-xs font-medium text-foreground">{p.title}</div>
                  <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                    {p.evidenceCount} evidence · {p.progress}%
                  </div>
                </div>
                <StatusBadge status={p.status} />
              </li>
            ))}
          </ul>
        </div>

        <div>
          <div className="mb-2 font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
            Recent notes
          </div>
          <ul className="grid gap-1.5">
            {notes.map((n) => (
              <li key={n.id}>
                <Link
                  to="/app/research"
                  className="flex items-center gap-2 rounded-md px-2 py-1.5 text-xs text-foreground hover:bg-secondary/60"
                >
                  <FileText className="h-3 w-3 text-muted-foreground" />
                  <span className="truncate">{n.title}</span>
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-3 mb-2 font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
            Latest activity
          </div>
          <ul className="grid gap-1">
            {activity.map((a) => (
              <li key={a.id} className="truncate text-[11px] text-muted-foreground">
                {a.title}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </DashboardWidget>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl border border-hairline bg-background/40 p-3">
      <div className="font-display text-2xl tracking-tight">{value}</div>
      <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
        {label}
      </div>
    </div>
  );
}
