import { ChevronRight, Lock } from "lucide-react";
import { cn } from "@/lib/utils";
import type { PipelineNode } from "../types";
import { DashboardWidget } from "./widget";

const STATUS_STYLES: Record<PipelineNode["status"], { border: string; icon: string; label: string; tone: string }> = {
  complete: { border: "border-emerald-500/30 bg-emerald-500/5", icon: "text-emerald-600 dark:text-emerald-400", label: "Live", tone: "text-emerald-600 dark:text-emerald-400" },
  ready: { border: "border-primary/30 bg-primary/5", icon: "text-primary", label: "Ready", tone: "text-primary" },
  locked: { border: "border-hairline bg-background/40", icon: "text-muted-foreground", label: "Locked", tone: "text-muted-foreground" },
};

export function PipelineOverview({ nodes }: { nodes: PipelineNode[] }) {
  return (
    <DashboardWidget
      eyebrow="Architecture"
      title="Pipeline overview"
      subtitle="From scientific sources to research intelligence."
    >
      <ol className="flex flex-col gap-3 lg:flex-row lg:items-stretch lg:gap-0">
        {nodes.map((n, i) => {
          const s = STATUS_STYLES[n.status];
          const locked = n.status === "locked";
          return (
            <li key={n.id} className="flex items-stretch lg:flex-1">
              <div
                className={cn(
                  "flex w-full flex-col rounded-xl border p-4 transition",
                  s.border,
                  locked && "opacity-70",
                )}
                aria-label={`${n.name} — ${s.label}`}
              >
                <div className="flex items-center justify-between">
                  <div className={cn("grid h-9 w-9 place-items-center rounded-lg bg-background/60", s.icon)}>
                    <n.icon className="h-4 w-4" />
                  </div>
                  {locked ? (
                    <Lock className="h-3.5 w-3.5 text-muted-foreground" aria-hidden />
                  ) : (
                    <span className={cn("font-mono text-[10px] uppercase tracking-[0.2em]", s.tone)}>
                      {s.label}
                    </span>
                  )}
                </div>
                <h3 className="font-display mt-4 text-sm text-foreground">{n.name}</h3>
                <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-muted-foreground">
                  {n.description}
                </p>
              </div>
              {i < nodes.length - 1 ? (
                <div
                  className="mx-1 hidden shrink-0 items-center text-muted-foreground/60 lg:flex"
                  aria-hidden
                >
                  <ChevronRight className="h-4 w-4" />
                </div>
              ) : null}
            </li>
          );
        })}
      </ol>
    </DashboardWidget>
  );
}
