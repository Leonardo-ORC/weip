import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
  icon?: ReactNode;
  title: ReactNode;
  description?: ReactNode;
  action?: ReactNode;
  className?: string;
}

export function EmptyState({ icon, title, description, action, className }: EmptyStateProps) {
  return (
    <div
      className={cn(
        "surface-card flex flex-col items-center justify-center gap-4 p-16 text-center",
        className,
      )}
    >
      {icon ? (
        <div className="hairline flex h-14 w-14 items-center justify-center rounded-full text-muted-foreground">
          {icon}
        </div>
      ) : null}
      <h3 className="font-display text-2xl tracking-tight">{title}</h3>
      {description ? (
        <p className="max-w-md text-sm leading-relaxed text-muted-foreground">{description}</p>
      ) : null}
      {action ? <div className="pt-2">{action}</div> : null}
    </div>
  );
}
