import { cn } from "@/lib/utils";
import { Lock } from "lucide-react";
import type { ExtractionStageDefinition } from "../models";
import { ValidationBadge } from "./ValidationBadge";
import {
  formatExtractionStageContract,
  formatExtractionStagePosition,
} from "../utils/format";

export function ExtractionStage({
  stage,
  position,
  total,
  className,
}: {
  stage: ExtractionStageDefinition;
  position: number;
  total: number;
  className?: string;
}) {
  const locked = stage.state === "locked";
  const emphasised = stage.state === "current";

  return (
    <article
      className={cn(
        "surface-card relative flex h-full min-h-[220px] flex-col gap-4 p-6 transition-all duration-500",
        emphasised && "ring-1 ring-primary/40 shadow-elevated",
        locked && "opacity-60",
        className,
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex flex-col gap-1">
          <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
            {formatExtractionStagePosition(position, total)} · Extraction
          </span>
          <h3 className="font-display text-xl tracking-tight">{stage.name}</h3>
        </div>
        {locked ? (
          <Lock className="h-4 w-4 text-muted-foreground" aria-hidden />
        ) : (
          <ValidationBadge state={stage.state} />
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
          {formatExtractionStageContract(stage)}
        </code>
      </div>
    </article>
  );
}
