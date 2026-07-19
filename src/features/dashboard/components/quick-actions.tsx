import { Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import type { QuickAction } from "../types";
import { DashboardWidget } from "./widget";

interface QuickActionsProps {
  actions: QuickAction[];
}

export function QuickActions({ actions }: QuickActionsProps) {
  return (
    <DashboardWidget
      eyebrow="Shortcuts"
      title="Quick actions"
      subtitle="Jump into the most-used surfaces of the platform."
    >
      <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {actions.map((a) => (
          <li key={a.id}>
            <Link
              to={a.to as never}
              aria-label={a.title}
              className="group flex h-full flex-col justify-between rounded-xl border border-hairline bg-background/50 p-4 transition hover:border-border hover:bg-background"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary">
                  <a.icon className="h-4 w-4" />
                </div>
                <ArrowUpRight className="h-4 w-4 text-muted-foreground transition group-hover:text-foreground" />
              </div>
              <div className="mt-6 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="truncate text-sm font-medium text-foreground">{a.title}</p>
                  {a.hint ? (
                    <span className="shrink-0 rounded-full border border-hairline px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-[0.18em] text-muted-foreground">
                      {a.hint}
                    </span>
                  ) : null}
                </div>
                <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{a.description}</p>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </DashboardWidget>
  );
}
