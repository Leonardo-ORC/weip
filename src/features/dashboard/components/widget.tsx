import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface WidgetHeaderProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  action?: ReactNode;
}

export function WidgetHeader({ eyebrow, title, subtitle, action }: WidgetHeaderProps) {
  return (
    <div className="mb-5 grid grid-cols-[minmax(0,1fr)_auto] items-end gap-4">
      <div className="min-w-0">
        {eyebrow ? (
          <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
            {eyebrow}
          </div>
        ) : null}
        <h2 className="font-display mt-1 truncate text-xl text-foreground">{title}</h2>
        {subtitle ? (
          <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>
        ) : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}

interface DashboardWidgetProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
  padded?: boolean;
  as?: "section" | "article";
  ariaLabel?: string;
}

export function DashboardWidget({
  eyebrow,
  title,
  subtitle,
  action,
  children,
  className,
  padded = true,
  as: Tag = "section",
  ariaLabel,
}: DashboardWidgetProps) {
  return (
    <Tag
      aria-label={ariaLabel ?? title}
      className={cn(
        "rounded-2xl border border-hairline bg-background/60",
        padded && "p-6",
        className,
      )}
    >
      <WidgetHeader eyebrow={eyebrow} title={title} subtitle={subtitle} action={action} />
      {children}
    </Tag>
  );
}
