import type { ReactNode } from "react";
import { AppBreadcrumb, type Crumb } from "./app-breadcrumb";
import { cn } from "@/lib/utils";

interface WorkspaceHeaderProps {
  eyebrow?: string;
  title: ReactNode;
  subtitle?: ReactNode;
  breadcrumbs?: Crumb[];
  primaryAction?: ReactNode;
  secondaryActions?: ReactNode;
  meta?: ReactNode;
  className?: string;
}

export function WorkspaceHeader({
  eyebrow,
  title,
  subtitle,
  breadcrumbs,
  primaryAction,
  secondaryActions,
  meta,
  className,
}: WorkspaceHeaderProps) {
  return (
    <header className={cn("border-b border-hairline bg-background/60 px-6 pb-8 pt-8 lg:px-10", className)}>
      {breadcrumbs?.length ? <AppBreadcrumb items={breadcrumbs} className="mb-5" /> : null}
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
        <div className="min-w-0">
          {eyebrow ? (
            <div className="mb-3 font-mono text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
              {eyebrow}
            </div>
          ) : null}
          <h1 className="font-display truncate text-[clamp(1.75rem,3vw,2.5rem)] leading-tight tracking-tight text-foreground">
            {title}
          </h1>
          {subtitle ? (
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">{subtitle}</p>
          ) : null}
        </div>
        {(primaryAction || secondaryActions) && (
          <div className="flex flex-wrap items-center gap-2 lg:justify-end">
            {secondaryActions}
            {primaryAction}
          </div>
        )}
      </div>
      {meta ? <div className="mt-6">{meta}</div> : null}
    </header>
  );
}
