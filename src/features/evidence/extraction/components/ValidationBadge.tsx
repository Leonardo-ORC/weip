import { cn } from "@/lib/utils";
import { EXTRACTION_FLOW_STATE_LABELS } from "../models";
import type { ExtractionFlowState } from "../types";

const tone: Record<ExtractionFlowState, string> = {
  locked: "bg-secondary text-muted-foreground border border-hairline",
  active: "bg-teal/15 text-foreground border border-teal/30",
  current: "bg-primary/10 text-foreground border border-primary/30",
  "coming-soon": "bg-secondary text-muted-foreground border border-hairline",
};

export function ValidationBadge({
  state,
  label,
  className,
}: {
  state: ExtractionFlowState;
  label?: string;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.2em]",
        tone[state],
        className,
      )}
    >
      {label ?? EXTRACTION_FLOW_STATE_LABELS[state]}
    </span>
  );
}
