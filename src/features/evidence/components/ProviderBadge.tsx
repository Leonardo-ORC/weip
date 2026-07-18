import { Tag } from "@/components/common/tag";
import { cn } from "@/lib/utils";
import { PROVIDER_STATUS_LABELS } from "../models/provider";
import type { ProviderStatus } from "../types/provider";

const toneClass: Record<ProviderStatus, string> = {
  available: "bg-teal/15 text-foreground border border-teal/30",
  experimental: "bg-accent/20 text-foreground border border-accent/40",
  planned: "bg-primary/10 text-foreground border border-primary/25",
  future: "bg-secondary text-muted-foreground border border-hairline",
  deprecated: "bg-destructive/10 text-foreground border border-destructive/25",
};

export function ProviderBadge({
  status,
  className,
}: {
  status: ProviderStatus;
  className?: string;
}) {
  return (
    <Tag className={cn("!border", toneClass[status], className)}>
      {PROVIDER_STATUS_LABELS[status]}
    </Tag>
  );
}
