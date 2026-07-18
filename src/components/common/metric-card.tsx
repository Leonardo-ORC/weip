import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface MetricCardProps {
  eyebrow?: string;
  value: ReactNode;
  label: ReactNode;
  description?: ReactNode;
  className?: string;
}

export function MetricCard({ eyebrow, value, label, description, className }: MetricCardProps) {
  return (
    <div className={cn("group relative bg-background p-8 transition-colors hover:bg-secondary/40", className)}>
      {eyebrow ? (
        <div className="flex items-center justify-between">
          <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
            {eyebrow}
          </span>
          <span className="text-teal opacity-0 transition-opacity group-hover:opacity-100">↗</span>
        </div>
      ) : null}
      <div className="font-display mt-10 text-5xl tracking-tight">{value}</div>
      <div className="mt-2 text-sm font-medium">{label}</div>
      {description ? (
        <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{description}</p>
      ) : null}
    </div>
  );
}

export function StatCard({
  value,
  label,
  trend,
  className,
}: {
  value: ReactNode;
  label: ReactNode;
  trend?: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("surface-card p-6", className)}>
      <div className="flex items-baseline justify-between">
        <div className="font-display text-4xl tracking-tight">{value}</div>
        {trend ? <div className="text-xs text-muted-foreground">{trend}</div> : null}
      </div>
      <div className="mt-2 text-sm text-muted-foreground">{label}</div>
    </div>
  );
}
