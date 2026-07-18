import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface FeatureCardProps {
  index?: number | string;
  icon?: ReactNode;
  title: ReactNode;
  description?: ReactNode;
  footer?: ReactNode;
  className?: string;
}

export function FeatureCard({
  index,
  icon,
  title,
  description,
  footer,
  className,
}: FeatureCardProps) {
  return (
    <article
      className={cn(
        "surface-card group relative overflow-hidden p-8 transition-all duration-500 hover:-translate-y-0.5 hover:shadow-elevated",
        className,
      )}
    >
      <div className="flex items-start justify-between">
        <div className="hairline flex h-10 w-10 items-center justify-center rounded-full">
          {icon ?? (
            <span className="font-mono text-xs text-muted-foreground">
              {typeof index === "number" ? String(index).padStart(2, "0") : index ?? ""}
            </span>
          )}
        </div>
        <div
          aria-hidden
          className="h-10 w-10 rounded-full opacity-20 transition-opacity group-hover:opacity-40"
          style={{
            background: "radial-gradient(circle at 30% 30%, var(--teal), transparent 70%)",
          }}
        />
      </div>
      <h3 className="font-display mt-10 text-2xl tracking-tight">{title}</h3>
      {description ? (
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{description}</p>
      ) : null}
      {footer ? <div className="mt-6">{footer}</div> : null}
    </article>
  );
}
