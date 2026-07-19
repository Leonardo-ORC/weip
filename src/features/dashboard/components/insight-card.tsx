import type { InsightItem } from "../types";
import { DashboardWidget } from "./widget";

export function InsightCard({ item }: { item: InsightItem }) {
  return (
    <li className="rounded-xl border border-hairline bg-background/40 p-4">
      <div className="flex items-center justify-between">
        <div className="grid h-8 w-8 place-items-center rounded-lg bg-primary/10 text-primary">
          <item.icon className="h-4 w-4" />
        </div>
        <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
          {item.hint}
        </span>
      </div>
      <div className="font-display mt-4 text-3xl leading-none text-foreground">{item.value}</div>
      <div className="mt-1.5 text-xs text-muted-foreground">{item.label}</div>
    </li>
  );
}

export function InsightsPanel({ items }: { items: InsightItem[] }) {
  return (
    <DashboardWidget
      eyebrow="Signals"
      title="At a glance"
      subtitle="A compact read of the platform surface."
    >
      <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {items.map((i) => (
          <InsightCard key={i.id} item={i} />
        ))}
      </ul>
    </DashboardWidget>
  );
}
