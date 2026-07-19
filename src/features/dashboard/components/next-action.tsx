import { Link } from "@tanstack/react-router";
import { ArrowRight, Database } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface NextActionProps {
  eyebrow?: string;
  title?: string;
  description?: string;
  to?: string;
  cta?: string;
  icon?: LucideIcon;
  className?: string;
}

/**
 * One — and only one — primary scientific action.
 * Everything else on the dashboard should feel secondary compared to this card.
 */
export function NextAction({
  eyebrow = "Next recommended action",
  title = "Review extracted evidence",
  description = "New evidence objects are ready in your workspace. Verify extractions before promoting them to the Knowledge Graph.",
  to = "/app/evidence",
  cta = "Review evidence",
  icon: Icon = Database,
  className,
}: NextActionProps) {
  return (
    <section
      aria-label="Next recommended action"
      className={cn(
        "relative overflow-hidden rounded-2xl border border-hairline bg-gradient-to-br from-primary/8 via-background to-background p-6 lg:p-8",
        className,
      )}
    >
      <div className="pointer-events-none absolute inset-0 opacity-[0.05] grid-pattern" aria-hidden />
      <div className="relative grid gap-6 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
        <div className="flex items-start gap-4">
          <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
            <Icon className="h-5 w-5" />
          </span>
          <div className="min-w-0">
            <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
              {eyebrow}
            </div>
            <h2 className="font-display mt-1 text-xl text-foreground lg:text-2xl">{title}</h2>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
              {description}
            </p>
          </div>
        </div>
        <Link
          to={to as never}
          className="inline-flex w-fit items-center gap-2 self-start rounded-full bg-ink px-5 py-2.5 text-sm font-medium text-background shadow-soft transition hover:opacity-90 lg:self-center"
        >
          {cta}
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </section>
  );
}
