import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Eyebrow } from "@/components/common/eyebrow";
import {
  PROVIDER_CATEGORY_DESCRIPTIONS,
  PROVIDER_CATEGORY_LABELS,
} from "../models/provider";
import type { ProviderCategory as ProviderCategoryType } from "../types/provider";

export function ProviderCategory({
  category,
  count,
  children,
  className,
}: {
  category: ProviderCategoryType;
  count?: number;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("space-y-8", className)}>
      <header className="flex flex-col gap-3 border-b border-hairline pb-6">
        <div className="flex items-center justify-between">
          <Eyebrow>{PROVIDER_CATEGORY_LABELS[category]}</Eyebrow>
          {typeof count === "number" ? (
            <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
              {String(count).padStart(2, "0")} {count === 1 ? "provider" : "providers"}
            </span>
          ) : null}
        </div>
        <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">
          {PROVIDER_CATEGORY_DESCRIPTIONS[category]}
        </p>
      </header>
      {children}
    </section>
  );
}
