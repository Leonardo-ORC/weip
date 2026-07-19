import { useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import type { NotificationCategory, NotificationItem } from "../types";
import { DashboardWidget } from "./widget";
import { EmptyNotifications } from "./empty-states";

const CATEGORIES: { id: NotificationCategory | "all"; label: string }[] = [
  { id: "all", label: "All" },
  { id: "system", label: "System" },
  { id: "research", label: "Research" },
  { id: "platform", label: "Platform" },
  { id: "projects", label: "Projects" },
  { id: "security", label: "Security" },
];

const CATEGORY_TONE: Record<NotificationCategory, string> = {
  system: "bg-muted text-muted-foreground",
  research: "bg-primary/10 text-primary",
  platform: "bg-accent/15 text-accent",
  projects: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  security: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
};

export function NotificationPanel({ items }: { items: NotificationItem[] }) {
  const [filter, setFilter] = useState<NotificationCategory | "all">("all");
  const filtered = useMemo(
    () => (filter === "all" ? items : items.filter((n) => n.category === filter)),
    [items, filter],
  );
  const unread = items.filter((n) => n.unread).length;

  return (
    <DashboardWidget
      eyebrow="Inbox"
      title="Notifications"
      subtitle={`${unread} unread across categories.`}
      action={
        <button
          type="button"
          className="text-xs font-medium text-muted-foreground transition hover:text-foreground"
        >
          Mark all read
        </button>
      }
    >
      <div role="tablist" aria-label="Notification categories" className="mb-4 flex flex-wrap gap-1.5">
        {CATEGORIES.map((c) => (
          <button
            key={c.id}
            role="tab"
            aria-selected={filter === c.id}
            onClick={() => setFilter(c.id)}
            className={cn(
              "rounded-full border border-hairline px-2.5 py-1 text-[11px] transition",
              filter === c.id
                ? "border-foreground/70 bg-foreground text-background"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {c.label}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <EmptyNotifications />
      ) : (
        <ul className="grid gap-2">
          {filtered.map((n) => (
            <li
              key={n.id}
              className={cn(
                "flex items-start gap-3 rounded-xl border border-hairline bg-background/40 p-3.5",
                n.unread && "bg-background/70",
              )}
            >
              <span
                className={cn(
                  "mt-1 h-2 w-2 shrink-0 rounded-full",
                  n.unread ? "bg-primary" : "bg-transparent",
                )}
                aria-hidden
              />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className="truncate text-sm font-medium text-foreground">{n.title}</p>
                  <span
                    className={cn(
                      "shrink-0 rounded-full px-1.5 py-0.5 text-[10px] font-medium capitalize",
                      CATEGORY_TONE[n.category],
                    )}
                  >
                    {n.category}
                  </span>
                </div>
                <p className="mt-0.5 line-clamp-2 text-xs text-muted-foreground">{n.description}</p>
              </div>
              <span className="shrink-0 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                {n.time}
              </span>
            </li>
          ))}
        </ul>
      )}
    </DashboardWidget>
  );
}
