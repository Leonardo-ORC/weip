import { cn } from "@/lib/utils";
import type { ModuleStatus, PlatformModule } from "../types";
import { DashboardWidget } from "./widget";

const STATUS: Record<ModuleStatus, { label: string; dot: string }> = {
  operational: { label: "Operational", dot: "bg-emerald-500" },
  planned: { label: "Planned", dot: "bg-primary" },
  future: { label: "Future", dot: "bg-muted-foreground/60" },
  degraded: { label: "Degraded", dot: "bg-amber-500" },
};

export function PlatformStatusCard({ module }: { module: PlatformModule }) {
  const s = STATUS[module.status];
  return (
    <li className="flex h-full flex-col rounded-xl border border-hairline bg-background/40 p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-secondary text-foreground/80">
          <module.icon className="h-4 w-4" />
        </div>
        <div className="flex items-center gap-1.5">
          <span className={cn("h-1.5 w-1.5 rounded-full", s.dot)} />
          <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
            {s.label}
          </span>
        </div>
      </div>
      <h3 className="font-display mt-4 text-base text-foreground">{module.name}</h3>
      <p className="mt-1 flex-1 text-xs leading-relaxed text-muted-foreground">
        {module.description}
      </p>
      <div className="mt-4">
        <div className="h-1 overflow-hidden rounded-full bg-secondary">
          <div
            className={cn(
              "h-full rounded-full transition-[width]",
              module.status === "operational" ? "bg-emerald-500" : "bg-primary/70",
            )}
            style={{ width: `${module.readiness}%` }}
          />
        </div>
        <div className="mt-2 flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
          <span>{module.version}</span>
          <span>{module.availability}</span>
        </div>
      </div>
    </li>
  );
}

export function PlatformStatusGrid({ modules }: { modules: PlatformModule[] }) {
  return (
    <DashboardWidget
      eyebrow="Platform"
      title="Platform status"
      subtitle="Where WEIP stands today across every module."
    >
      <ul className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {modules.map((m) => (
          <PlatformStatusCard key={m.id} module={m} />
        ))}
      </ul>
    </DashboardWidget>
  );
}
