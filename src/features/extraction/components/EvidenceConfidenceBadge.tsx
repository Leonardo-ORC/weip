import { cn } from "@/lib/utils";
import type { ConfidenceReport } from "../types";

const TONE: Record<ConfidenceReport["grade"], string> = {
  "very-high": "border-teal/40 bg-teal/10 text-teal",
  high: "border-teal/40 bg-teal/10 text-teal",
  moderate: "border-primary/40 bg-primary/10 text-primary",
  low: "border-amber-500/40 bg-amber-500/10 text-amber-600 dark:text-amber-400",
  "very-low": "border-destructive/40 bg-destructive/10 text-destructive",
};

const LABEL: Record<ConfidenceReport["grade"], string> = {
  "very-high": "Very high",
  high: "High",
  moderate: "Moderate",
  low: "Low",
  "very-low": "Very low",
};

export function EvidenceConfidenceBadge({
  confidence,
  className,
}: {
  confidence: ConfidenceReport;
  className?: string;
}) {
  const pct = Math.round(confidence.overall * 100);
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-full border px-2.5 py-1 text-[11px]",
        TONE[confidence.grade],
        className,
      )}
      title={`Overall extraction confidence: ${pct}%`}
    >
      <span className="font-mono text-[10px] uppercase tracking-[0.18em]">Confidence</span>
      <span className="font-medium">{LABEL[confidence.grade]}</span>
      <span className="font-mono opacity-70">{pct}%</span>
    </span>
  );
}
