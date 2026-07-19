import { cn } from "@/lib/utils";
import type { EvidenceExtractionMetadata, ValidationReport } from "../types";

export function EvidenceExtractionStatus({
  metadata,
  validation,
  className,
}: {
  metadata: EvidenceExtractionMetadata;
  validation: ValidationReport;
  className?: string;
}) {
  const tone = validation.passed
    ? "border-teal/40 text-teal"
    : "border-amber-500/40 text-amber-600 dark:text-amber-400";
  return (
    <div
      className={cn(
        "flex flex-wrap items-center gap-3 rounded-lg border border-hairline bg-background/40 px-3 py-2 text-[11px]",
        className,
      )}
    >
      <span className={cn("inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5", tone)}>
        <span className="h-1.5 w-1.5 rounded-full bg-current" />
        {validation.passed ? "Extraction OK" : "Needs review"}
      </span>
      <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
        engine v{metadata.engineVersion}
      </span>
      <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
        {metadata.strategies.join(" + ")}
      </span>
      {metadata.aiProviderId ? (
        <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-primary">
          ai · {metadata.aiProviderId}
        </span>
      ) : null}
      <span className="ml-auto font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
        {metadata.durationMs}ms
      </span>
    </div>
  );
}
