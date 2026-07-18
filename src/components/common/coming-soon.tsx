import type { ReactNode } from "react";
import { Tag } from "./tag";
import { cn } from "@/lib/utils";

interface ComingSoonProps {
  title: ReactNode;
  description?: ReactNode;
  items?: { title: ReactNode; description?: ReactNode }[];
  className?: string;
}

/**
 * Editorial placeholder for pages awaiting real content. Uses the established
 * visual language — hairlines, ink typography, warm neutrals.
 */
export function ComingSoon({ title, description, items = [], className }: ComingSoonProps) {
  return (
    <div className={cn("space-y-16", className)}>
      <div className="max-w-2xl">
        <Tag variant="outline">In development</Tag>
        <h2 className="font-display mt-6 text-3xl leading-[1.1] tracking-tight lg:text-4xl text-balance">
          {title}
        </h2>
        {description ? (
          <p className="mt-6 text-lg leading-relaxed text-muted-foreground">{description}</p>
        ) : null}
      </div>

      {items.length > 0 ? (
        <div className="grid gap-px overflow-hidden rounded-2xl border border-hairline bg-hairline sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item, i) => (
            <div key={i} className="bg-background p-8">
              <div className="font-mono text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
                {String(i + 1).padStart(2, "0")}
              </div>
              <div className="font-display mt-6 text-xl tracking-tight">{item.title}</div>
              {item.description ? (
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  {item.description}
                </p>
              ) : null}
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}
