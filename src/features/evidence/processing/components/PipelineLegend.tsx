import { cn } from "@/lib/utils";
import { STAGE_VISUAL_STATE_LABELS } from "../models";
import type { StageVisualState } from "../types";

const items: readonly { id: StageVisualState; description: string }[] = [
  { id: "active", description: "Layer shipped in a previous sprint." },
  { id: "current", description: "Focus of this sprint — architecture only." },
  { id: "coming-soon", description: "Planned in the near-term roadmap." },
  { id: "locked", description: "Downstream layer, gated on prior work." },
];

const dotTone: Record<StageVisualState, string> = {
  active: "bg-teal",
  current: "bg-primary",
  "coming-soon": "bg-muted-foreground/50",
  locked: "bg-muted-foreground/25",
};

export function PipelineLegend({ className }: { className?: string }) {
  return (
    <ul
      className={cn(
        "grid gap-3 rounded-xl border border-hairline bg-secondary/30 p-5 sm:grid-cols-2 lg:grid-cols-4",
        className,
      )}
    >
      {items.map((item) => (
        <li key={item.id} className="flex items-start gap-3">
          <span
            aria-hidden
            className={cn("mt-1.5 h-2 w-2 flex-none rounded-full", dotTone[item.id])}
          />
          <div className="flex flex-col gap-0.5">
            <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-foreground">
              {STAGE_VISUAL_STATE_LABELS[item.id]}
            </span>
            <span className="text-xs leading-relaxed text-muted-foreground">
              {item.description}
            </span>
          </div>
        </li>
      ))}
    </ul>
  );
}
