import { FolderKanban, HelpCircle, Layers, Lightbulb, Link2, Users } from "lucide-react";
import { cn } from "@/lib/utils";
import type { WorkspaceStatistics } from "../types";

interface Item {
  key: keyof WorkspaceStatistics;
  label: string;
  hint: string;
  icon: React.ComponentType<{ className?: string }>;
}

const ITEMS: Item[] = [
  { key: "projects", label: "Projects", hint: "Ongoing investigations", icon: FolderKanban },
  { key: "activeQuestions", label: "Active questions", hint: "Being explored", icon: HelpCircle },
  { key: "hypotheses", label: "Hypotheses", hint: "Formal statements", icon: Lightbulb },
  { key: "collections", label: "Collections", hint: "Evidence groups", icon: Layers },
  { key: "evidenceLinked", label: "Evidence linked", hint: "Across all projects", icon: Link2 },
  { key: "recentSessions", label: "Recent sessions", hint: "Last 7 days", icon: Users },
];

export function WorkspaceOverview({
  stats,
  className,
}: {
  stats: WorkspaceStatistics;
  className?: string;
}) {
  return (
    <div className={cn("grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6", className)}>
      {ITEMS.map(({ key, label, hint, icon: Icon }) => (
        <div
          key={key}
          className="rounded-2xl border border-hairline bg-background/60 p-4"
        >
          <div className="flex items-center justify-between">
            <div className="grid h-8 w-8 place-items-center rounded-lg bg-secondary text-foreground/80">
              <Icon className="h-4 w-4" />
            </div>
            <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
              {hint}
            </div>
          </div>
          <div className="mt-4 font-display text-3xl tracking-tight text-foreground">
            {stats[key]}
          </div>
          <div className="mt-1 text-xs text-muted-foreground">{label}</div>
        </div>
      ))}
    </div>
  );
}
