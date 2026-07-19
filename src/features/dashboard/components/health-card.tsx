import { cn } from "@/lib/utils";
import type { HealthCheck, HealthStatus } from "../types";
import { DashboardWidget } from "./widget";

const STATUS: Record<HealthStatus, { label: string; dot: string }> = {
  healthy: { label: "Healthy", dot: "bg-emerald-500" },
  planned: { label: "Planned", dot: "bg-primary" },
  future: { label: "Future", dot: "bg-muted-foreground/60" },
  degraded: { label: "Degraded", dot: "bg-amber-500" },
};

export function HealthCard({ check }: { check: HealthCheck }) {
  const s = STATUS[check.status];
  return (
    <li className="flex items-center gap-3 rounded-xl border border-hairline bg-background/40 px-4 py-3">
      <div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-secondary text-foreground/80">
        <check.icon className="h-4 w-4" />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <p className="truncate text-sm font-medium text-foreground">{check.name}</p>
          <span className={cn("h-1.5 w-1.5 shrink-0 rounded-full", s.dot)} />
        </div>
        <p className="truncate text-xs text-muted-foreground">{check.description}</p>
      </div>
      <div className="shrink-0 text-right">
        <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
          {s.label}
        </div>
        {check.latency ? (
          <div className="mt-0.5 font-mono text-[10px] text-muted-foreground/80">{check.latency}</div>
        ) : null}
      </div>
    </li>
  );
}

export function HealthList({ checks }: { checks: HealthCheck[] }) {
  return (
    <DashboardWidget
      eyebrow="Reliability"
      title="System health"
      subtitle="Illustrative — no live probes."
    >
      <ul className="grid gap-2">
        {checks.map((c) => (
          <HealthCard key={c.id} check={c} />
        ))}
      </ul>
    </DashboardWidget>
  );
}
