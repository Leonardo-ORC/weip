import { cn } from "@/lib/utils";
import type { PipelineStatus, StageVisualState } from "../types";
import {
  PIPELINE_STATUS_LABELS,
  STAGE_VISUAL_STATE_LABELS,
} from "../models";

const statusTone: Record<PipelineStatus, string> = {
  pending: "bg-secondary text-muted-foreground border border-hairline",
  running: "bg-accent/20 text-foreground border border-accent/40",
  completed: "bg-teal/15 text-foreground border border-teal/30",
  failed: "bg-destructive/10 text-foreground border border-destructive/25",
  skipped: "bg-muted text-muted-foreground border border-hairline",
  cancelled: "bg-muted text-muted-foreground border border-hairline",
};

const visualTone: Record<StageVisualState, string> = {
  locked: "bg-secondary text-muted-foreground border border-hairline",
  active: "bg-teal/15 text-foreground border border-teal/30",
  current: "bg-primary/10 text-foreground border border-primary/30",
  "coming-soon": "bg-secondary text-muted-foreground border border-hairline",
};

export function PipelineStatusBadge({
  status,
  visualState,
  className,
}: {
  status?: PipelineStatus;
  visualState?: StageVisualState;
  className?: string;
}) {
  const label = status
    ? PIPELINE_STATUS_LABELS[status]
    : visualState
      ? STAGE_VISUAL_STATE_LABELS[visualState]
      : "";
  const tone = status
    ? statusTone[status]
    : visualState
      ? visualTone[visualState]
      : "";

  if (!label) return null;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.2em]",
        tone,
        className,
      )}
    >
      {label}
    </span>
  );
}
