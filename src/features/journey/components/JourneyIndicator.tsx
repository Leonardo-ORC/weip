import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { JOURNEY_STEPS } from "../steps";
import type { JourneyStepId } from "../types";

interface Props {
  currentStep: JourneyStepId;
  completed: readonly JourneyStepId[];
  onStepClick?: (id: JourneyStepId) => void;
  compact?: boolean;
}

export function JourneyIndicator({ currentStep, completed, onStepClick, compact }: Props) {
  return (
    <ol
      className={cn(
        "flex items-center gap-1.5",
        compact ? "text-[10px]" : "text-[11px]",
      )}
      aria-label="Guided Research Journey progress"
    >
      {JOURNEY_STEPS.map((s, i) => {
        const isDone = completed.includes(s.id);
        const isCurrent = s.id === currentStep;
        return (
          <li key={s.id} className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => onStepClick?.(s.id)}
              disabled={!onStepClick}
              aria-current={isCurrent ? "step" : undefined}
              className={cn(
                "group flex items-center gap-1.5 rounded-full border px-2 py-1 font-mono uppercase tracking-[0.18em] transition",
                isCurrent
                  ? "border-primary bg-primary/10 text-primary"
                  : isDone
                    ? "border-foreground/40 bg-background text-foreground"
                    : "border-hairline bg-background text-muted-foreground",
                onStepClick ? "hover:border-primary/60" : "cursor-default",
              )}
              title={s.label}
            >
              <span
                className={cn(
                  "grid h-4 w-4 place-items-center rounded-full border text-[9px] font-medium",
                  isCurrent
                    ? "border-primary bg-primary text-primary-foreground"
                    : isDone
                      ? "border-foreground bg-foreground text-background"
                      : "border-hairline",
                )}
              >
                {isDone ? <Check className="h-2.5 w-2.5" /> : s.index}
              </span>
              <span className={cn("hidden md:inline")}>{s.label}</span>
            </button>
            {i < JOURNEY_STEPS.length - 1 ? (
              <span aria-hidden className="h-px w-3 bg-hairline md:w-5" />
            ) : null}
          </li>
        );
      })}
    </ol>
  );
}
