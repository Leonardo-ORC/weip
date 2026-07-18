import { cn } from "@/lib/utils";
import { PROVIDER_STATUS_LABELS } from "../models/provider";
import type { ProviderStatus as ProviderStatusType } from "../types/provider";

const dotClass: Record<ProviderStatusType, string> = {
  available: "bg-teal",
  experimental: "bg-accent",
  planned: "bg-primary/70",
  future: "bg-muted-foreground/50",
  deprecated: "bg-destructive/70",
};

export function ProviderStatus({
  status,
  className,
}: {
  status: ProviderStatusType;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground",
        className,
      )}
    >
      <span aria-hidden className={cn("h-1.5 w-1.5 rounded-full", dotClass[status])} />
      {PROVIDER_STATUS_LABELS[status]}
    </span>
  );
}
