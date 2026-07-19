import { AlertTriangle, CheckCircle2, Circle, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { PipelineRunState, PipelineStageState } from "../types";

function StageIcon({ status }: { status: PipelineStageState["status"] }) {
  if (status === "running") return <Loader2 className="h-3.5 w-3.5 animate-spin text-primary" />;
  if (status === "completed") return <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />;
  if (status === "failed") return <AlertTriangle className="h-3.5 w-3.5 text-destructive" />;
  return <Circle className="h-3.5 w-3.5 text-muted-foreground/50" />;
}

const STATUS_STYLES: Record<PipelineStageState["status"], string> = {
  idle: "border-hairline bg-background/40 text-muted-foreground",
  running: "border-primary/40 bg-primary/5 text-foreground",
  completed: "border-emerald-500/30 bg-emerald-500/5 text-foreground",
  failed: "border-destructive/40 bg-destructive/5 text-foreground",
  skipped: "border-hairline bg-background/40 text-muted-foreground",
};

export function UnifiedPipelineStatus({ run }: { run: PipelineRunState }) {
  return (
    <section className="rounded-2xl border border-hairline bg-background/60 p-5">
      <header className="mb-4 flex items-end justify-between">
        <div>
          <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
            Processing pipeline
          </div>
          <h3 className="font-display mt-1 text-base tracking-tight">Search → Expose</h3>
        </div>
        <span
          className={cn(
            "rounded-full border px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-[0.2em]",
            run.status === "completed" && "border-emerald-500/30 text-emerald-600 dark:text-emerald-400",
            run.status === "running" && "border-primary/40 text-primary",
            run.status === "failed" && "border-destructive/40 text-destructive",
            run.status === "idle" && "border-hairline text-muted-foreground",
          )}
        >
          {run.status}
        </span>
      </header>

      <ol className="grid gap-2">
        {run.stages.map((stage, i) => (
          <li
            key={stage.id}
            className={cn(
              "flex items-center gap-3 rounded-lg border px-3 py-2 text-xs transition",
              STATUS_STYLES[stage.status],
            )}
          >
            <span className="font-mono text-[10px] text-muted-foreground">
              {String(i + 1).padStart(2, "0")}
            </span>
            <StageIcon status={stage.status} />
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className="font-display text-sm text-foreground">{stage.label}</span>
                {typeof stage.count === "number" ? (
                  <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                    {stage.count}
                  </span>
                ) : null}
              </div>
              <div className="truncate text-[11px] text-muted-foreground">
                {stage.message ?? stage.description}
              </div>
            </div>
            {typeof stage.durationMs === "number" ? (
              <span className="font-mono text-[10px] text-muted-foreground">{stage.durationMs}ms</span>
            ) : null}
          </li>
        ))}
      </ol>

      {run.errors.length ? (
        <div className="mt-3 rounded-md border border-destructive/30 bg-destructive/5 px-3 py-2 text-xs text-destructive">
          {run.errors[0]!.message}
        </div>
      ) : null}
    </section>
  );
}
