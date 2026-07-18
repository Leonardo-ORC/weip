import { cn } from "@/lib/utils";
import { Lock } from "lucide-react";
import type { PipelineStageDefinition, StageVisualState } from "../types";
import { PIPELINE_STAGE_CATEGORY_LABELS } from "../models";
import { PipelineStatusBadge } from "./PipelineStatusBadge";
import { formatStageIoContract, formatStagePosition } from "../utils/format";

interface PipelineStageCardProps {
  stage: PipelineStageDefinition;
  position: number;
  total: number;
  visualState: StageVisualState;
  className?: string;
}

const outlineByState: Record<StageVisualState, string> = {
  locked: "opacity-60",
  active: "",
  current: "ring-1 ring-primary/40 shadow-elevated",
  "coming-soon": "",
};

export function PipelineStageCard({
  stage,
  position,
  total,
  visualState,
  className,
}: PipelineStageCardProps) {
  const locked = visualState === "locked";

  return (
    <article
      className={cn(
        "surface-card relative flex h-full min-h-[240px] flex-col gap-4 p-6 transition-all duration-500",
        outlineByState[visualState],
        className,
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex flex-col gap-1">
          <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
            {formatStagePosition(position, total)} · {PIPELINE_STAGE_CATEGORY_LABELS[stage.category]}
          </span>
          <h3 className="font-display text-xl tracking-tight">{stage.name}</h3>
        </div>
        {locked ? (
          <Lock className="h-4 w-4 text-muted-foreground" aria-hidden />
        ) : (
          <PipelineStatusBadge visualState={visualState} />
        )}
      </div>

      <p className="text-sm leading-relaxed text-muted-foreground">
        {stage.description}
      </p>

      <div className="mt-auto flex flex-col gap-2 border-t border-hairline pt-4">
        <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
          Contract
        </span>
        <code className="text-[11px] leading-relaxed text-foreground/80">
          {formatStageIoContract(stage)}
        </code>
      </div>
    </article>
  );
}
