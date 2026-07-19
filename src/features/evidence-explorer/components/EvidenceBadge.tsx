import { cn } from "@/lib/utils";
import type {
  ConfidenceLevel,
  EvidenceQuality,
  EvidenceStatus,
  EvidenceType,
  HormonalContext,
  StudyDesign,
} from "../types";

export const EVIDENCE_TYPE_LABEL: Record<EvidenceType, string> = {
  "clinical-trial": "Clinical Trial",
  "systematic-review": "Systematic Review",
  "meta-analysis": "Meta-analysis",
  guideline: "Guideline",
  "drug-label": "Drug Label",
  "case-report": "Case Report",
};

export const HORMONAL_LABEL: Record<HormonalContext, string> = {
  reproductive: "Reproductive",
  pregnancy: "Pregnancy",
  perimenopause: "Perimenopause",
  menopause: "Menopause",
  "post-menopause": "Post-menopause",
  "not-applicable": "N/A",
};

const STATUS_TONE: Record<EvidenceStatus, string> = {
  structured: "bg-teal/15 text-teal",
  processing: "bg-accent/15 text-accent",
  draft: "bg-muted text-muted-foreground",
  archived: "bg-destructive/10 text-destructive",
};

const STATUS_LABEL: Record<EvidenceStatus, string> = {
  structured: "Structured",
  processing: "Processing",
  draft: "Draft",
  archived: "Archived",
};

const CONFIDENCE_TONE: Record<ConfidenceLevel, string> = {
  high: "text-teal",
  moderate: "text-accent",
  low: "text-muted-foreground",
  "very-low": "text-destructive",
};

const QUALITY_TONE: Record<EvidenceQuality, string> = {
  A: "bg-teal/15 text-teal",
  B: "bg-accent/15 text-accent",
  C: "bg-muted text-muted-foreground",
  D: "bg-destructive/10 text-destructive",
};

export function EvidenceStatusBadge({ status, className }: { status: EvidenceStatus; className?: string }) {
  return (
    <span
      className={cn(
        "shrink-0 rounded-full px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.18em]",
        STATUS_TONE[status],
        className,
      )}
    >
      {STATUS_LABEL[status]}
    </span>
  );
}

export function EvidenceBadge({
  children,
  tone = "default",
  className,
}: {
  children: React.ReactNode;
  tone?: "default" | "primary" | "accent" | "outline";
  className?: string;
}) {
  const tones = {
    default: "bg-secondary text-foreground/80",
    primary: "bg-primary/10 text-primary",
    accent: "bg-accent/15 text-accent",
    outline: "border border-hairline text-muted-foreground",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.18em]",
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}

export function EvidenceTag({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full border border-hairline px-2 py-0.5 text-[11px] text-muted-foreground">
      {children}
    </span>
  );
}

export function ConfidenceIndicator({ level }: { level: ConfidenceLevel }) {
  const dots = { high: 4, moderate: 3, low: 2, "very-low": 1 }[level];
  return (
    <span className={cn("inline-flex items-center gap-0.5", CONFIDENCE_TONE[level])}>
      {Array.from({ length: 4 }).map((_, i) => (
        <span
          key={i}
          className={cn(
            "h-1.5 w-1.5 rounded-full",
            i < dots ? "bg-current" : "bg-current/20",
          )}
        />
      ))}
      <span className="ml-1 font-mono text-[10px] uppercase tracking-[0.18em] capitalize">
        {level.replace("-", " ")}
      </span>
    </span>
  );
}

export function QualityBadge({ quality }: { quality: EvidenceQuality }) {
  return (
    <span
      className={cn(
        "grid h-6 w-6 place-items-center rounded-md font-mono text-[11px] font-semibold",
        QUALITY_TONE[quality],
      )}
      title={`Evidence quality ${quality}`}
    >
      {quality}
    </span>
  );
}

export const EVIDENCE_TYPES: EvidenceType[] = [
  "clinical-trial",
  "systematic-review",
  "meta-analysis",
  "guideline",
  "drug-label",
  "case-report",
];

export const STUDY_DESIGNS: StudyDesign[] = [
  "RCT",
  "Cohort",
  "Case-control",
  "Cross-sectional",
  "Meta-analysis",
  "Systematic review",
  "Guideline",
  "Case report",
];

export const HORMONAL_CONTEXTS: HormonalContext[] = [
  "reproductive",
  "pregnancy",
  "perimenopause",
  "menopause",
  "post-menopause",
  "not-applicable",
];

export const CONFIDENCE_LEVELS: ConfidenceLevel[] = ["high", "moderate", "low", "very-low"];
export const QUALITY_LEVELS: EvidenceQuality[] = ["A", "B", "C", "D"];
