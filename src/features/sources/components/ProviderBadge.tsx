import { cn } from "@/lib/utils";
import type { SourceId } from "../types";
import { ScientificSourceRegistry } from "../registry";

const ACCENT: Record<string, string> = {
  indigo:
    "border-primary/30 bg-primary/10 text-primary dark:text-primary-foreground/90",
  teal: "border-teal-500/30 bg-teal-500/10 text-teal-700 dark:text-teal-300",
  amber: "border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-300",
};

interface ProviderBadgeProps {
  source: SourceId;
  size?: "sm" | "md";
  showDot?: boolean;
  className?: string;
}

export function ProviderBadge({ source, size = "sm", showDot = true, className }: ProviderBadgeProps) {
  const meta = ScientificSourceRegistry.metadataFor(source);
  if (!meta) return null;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border font-mono uppercase tracking-[0.18em]",
        size === "sm" ? "px-2 py-0.5 text-[10px]" : "px-3 py-1 text-xs",
        ACCENT[meta.badgeAccent] ?? ACCENT.indigo,
        className,
      )}
      title={meta.description}
    >
      {showDot ? (
        <span
          className={cn(
            "inline-block h-1.5 w-1.5 rounded-full",
            meta.badgeAccent === "indigo" && "bg-primary",
            meta.badgeAccent === "teal" && "bg-teal-500",
            meta.badgeAccent === "amber" && "bg-amber-500",
          )}
          aria-hidden
        />
      ) : null}
      {meta.shortName}
    </span>
  );
}
