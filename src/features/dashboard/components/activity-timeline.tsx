import { cn } from "@/lib/utils";
import type { ActivityEvent } from "../types";
import { DashboardWidget } from "./widget";
import { EmptyActivity } from "./empty-states";

interface ActivityTimelineProps {
  items: ActivityEvent[];
  compact?: boolean;
}

export function ActivityTimeline({ items, compact }: ActivityTimelineProps) {
  if (items.length === 0) return <EmptyActivity />;
  return (
    <ol className="relative space-y-0" aria-label="Recent activity">
      {items.map((item, i) => (
        <li key={item.id} className={cn("relative flex gap-4", compact ? "pb-4" : "pb-6", "last:pb-0")}>
          {i !== items.length - 1 ? (
            <span aria-hidden className="absolute left-[19px] top-9 h-full w-px bg-hairline" />
          ) : null}
          <div
            className={cn(
              "grid h-10 w-10 shrink-0 place-items-center rounded-full border border-hairline bg-background",
              item.tone === "primary" && "border-primary/30 bg-primary/5 text-primary",
              item.tone === "accent" && "border-accent/30 bg-accent/5 text-accent",
              item.tone === "success" && "border-emerald-500/30 bg-emerald-500/5 text-emerald-600 dark:text-emerald-400",
            )}
          >
            <item.icon className="h-4 w-4" />
          </div>
          <div className="min-w-0 flex-1 pt-1">
            <div className="flex items-baseline justify-between gap-2">
              <p className="truncate text-sm font-medium text-foreground">{item.title}</p>
              <span className="shrink-0 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                {item.time}
              </span>
            </div>
            {item.description ? (
              <p className="mt-0.5 text-sm leading-relaxed text-muted-foreground">{item.description}</p>
            ) : null}
            {item.actor ? (
              <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground/80">
                {item.actor}
              </p>
            ) : null}
          </div>
        </li>
      ))}
    </ol>
  );
}

export function ActivityWidget({ items }: { items: ActivityEvent[] }) {
  return (
    <DashboardWidget
      eyebrow="Timeline"
      title="Recent activity"
      subtitle="Foundational milestones across the platform."
    >
      <ActivityTimeline items={items} />
    </DashboardWidget>
  );
}
