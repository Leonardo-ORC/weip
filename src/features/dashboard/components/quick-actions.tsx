import { Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import type { QuickAction } from "../types";

interface QuickActionsProps {
  actions: QuickAction[];
}

export function QuickActions({ actions }: QuickActionsProps) {
  return (
    <section aria-label="Quick actions">
      <div className="mb-3 flex items-end justify-between">
        <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
          Quick actions
        </div>
      </div>
      <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {actions.map((a) => (
          <li key={a.id}>
            <Link
              to={a.to as never}
              aria-label={a.title}
              className="group flex h-full items-center gap-3 rounded-xl border border-hairline bg-background/50 p-4 transition hover:border-border hover:bg-background"
            >
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-secondary text-foreground">
                <a.icon className="h-4 w-4" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-foreground">{a.title}</p>
                <p className="mt-0.5 line-clamp-1 text-xs text-muted-foreground">{a.description}</p>
              </div>
              <ArrowUpRight className="h-4 w-4 text-muted-foreground transition group-hover:text-foreground" />
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
