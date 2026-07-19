import { FileText } from "lucide-react";
import type { ResearchNote, ResearchProject } from "../types";
import { OwnerAvatar, RelativeTime } from "./ResearchBadge";

export function ResearchNotes({
  notes,
  projects,
}: {
  notes: ResearchNote[];
  projects: ResearchProject[];
}) {
  if (notes.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-hairline bg-background/40 p-8 text-center text-sm text-muted-foreground">
        No notes match.
      </div>
    );
  }
  return (
    <div className="grid gap-3 md:grid-cols-2">
      {notes.map((n) => {
        const project = projects.find((p) => p.id === n.projectId);
        return (
          <article
            key={n.id}
            className="flex flex-col rounded-2xl border border-hairline bg-background/60 p-5"
          >
            <div className="mb-3 flex items-start gap-3">
              <div className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-secondary text-foreground/80">
                <FileText className="h-4 w-4" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
                  {project?.title ?? "Note"}
                </div>
                <h4 className="mt-0.5 font-display text-base leading-snug tracking-tight text-foreground">
                  {n.title}
                </h4>
              </div>
            </div>
            <p className="text-sm leading-relaxed text-muted-foreground">{n.summary}</p>
            <div className="mt-4 flex items-center justify-between border-t border-hairline pt-3">
              <div className="flex items-center gap-2">
                <OwnerAvatar initials={n.author.initials} name={n.author.name} />
                <span className="text-[11px] text-muted-foreground">{n.author.name}</span>
              </div>
              <RelativeTime iso={n.updatedAt} />
            </div>
          </article>
        );
      })}
    </div>
  );
}
