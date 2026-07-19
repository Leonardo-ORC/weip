import { cn } from "@/lib/utils";
import type { RoadmapModule, RoadmapPhase } from "../types";
import { DashboardWidget } from "./widget";

const PHASE_LABEL: Record<RoadmapPhase, string> = {
  next: "Next",
  later: "Later",
  horizon: "Horizon",
};

const PHASE_TONE: Record<RoadmapPhase, string> = {
  next: "bg-primary/10 text-primary",
  later: "bg-accent/15 text-accent",
  horizon: "bg-muted text-muted-foreground",
};

export function RoadmapCard({ module }: { module: RoadmapModule }) {
  return (
    <li className="flex items-start gap-3 rounded-xl border border-hairline bg-background/40 p-4">
      <div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-secondary text-foreground/80">
        <module.icon className="h-4 w-4" />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <p className="truncate text-sm font-medium text-foreground">{module.name}</p>
          <span
            className={cn(
              "shrink-0 rounded-full px-1.5 py-0.5 text-[10px] font-medium",
              PHASE_TONE[module.phase],
            )}
          >
            {PHASE_LABEL[module.phase]}
          </span>
        </div>
        <p className="mt-0.5 line-clamp-2 text-xs text-muted-foreground">{module.description}</p>
      </div>
      <span className="shrink-0 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
        {module.eta ?? "Soon"}
      </span>
    </li>
  );
}

export function RoadmapWidget({ modules }: { modules: RoadmapModule[] }) {
  return (
    <DashboardWidget
      eyebrow="Roadmap"
      title="Future modules"
      subtitle="Upcoming platform capabilities."
    >
      <ul className="grid gap-2">
        {modules.map((m) => (
          <RoadmapCard key={m.id} module={m} />
        ))}
      </ul>
    </DashboardWidget>
  );
}
