import { cn } from "@/lib/utils";
import type {
  CollectionStatus,
  Confidence,
  HypothesisStatus,
  Priority,
  QuestionStatus,
  ResearchStatus,
} from "../types";

interface BadgeProps {
  children: React.ReactNode;
  tone?: "neutral" | "positive" | "warning" | "critical" | "info";
  className?: string;
}

export function ResearchBadge({ children, tone = "neutral", className }: BadgeProps) {
  const tones: Record<NonNullable<BadgeProps["tone"]>, string> = {
    neutral: "border-hairline bg-secondary/60 text-foreground/80",
    positive: "border-emerald-500/25 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
    warning: "border-amber-500/25 bg-amber-500/10 text-amber-700 dark:text-amber-300",
    critical: "border-red-500/25 bg-red-500/10 text-red-700 dark:text-red-300",
    info: "border-sky-500/25 bg-sky-500/10 text-sky-700 dark:text-sky-300",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.18em]",
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}

const STATUS_TONE: Record<ResearchStatus, BadgeProps["tone"]> = {
  active: "positive",
  planning: "info",
  paused: "warning",
  completed: "neutral",
  archived: "neutral",
};
export function StatusBadge({ status }: { status: ResearchStatus }) {
  return <ResearchBadge tone={STATUS_TONE[status]}>{status}</ResearchBadge>;
}

const PRIORITY_TONE: Record<Priority, BadgeProps["tone"]> = {
  critical: "critical",
  high: "warning",
  medium: "info",
  low: "neutral",
};
export function PriorityBadge({ priority }: { priority: Priority }) {
  return <ResearchBadge tone={PRIORITY_TONE[priority]}>{priority}</ResearchBadge>;
}

const QUESTION_TONE: Record<QuestionStatus, BadgeProps["tone"]> = {
  open: "info",
  investigating: "warning",
  answered: "positive",
  inconclusive: "neutral",
};
export function QuestionStatusBadge({ status }: { status: QuestionStatus }) {
  return <ResearchBadge tone={QUESTION_TONE[status]}>{status}</ResearchBadge>;
}

const HYPO_TONE: Record<HypothesisStatus, BadgeProps["tone"]> = {
  draft: "neutral",
  "under-review": "info",
  supported: "positive",
  refuted: "critical",
  inconclusive: "warning",
};
export function HypothesisStatusBadge({ status }: { status: HypothesisStatus }) {
  return <ResearchBadge tone={HYPO_TONE[status]}>{status.replace("-", " ")}</ResearchBadge>;
}

const COLLECTION_TONE: Record<CollectionStatus, BadgeProps["tone"]> = {
  draft: "neutral",
  curated: "info",
  shared: "positive",
  locked: "warning",
};
export function CollectionStatusBadge({ status }: { status: CollectionStatus }) {
  return <ResearchBadge tone={COLLECTION_TONE[status]}>{status}</ResearchBadge>;
}

export function ConfidenceIndicator({ level }: { level: Confidence }) {
  const map: Record<Confidence, { steps: number; tone: BadgeProps["tone"] }> = {
    "very-low": { steps: 1, tone: "critical" },
    low: { steps: 2, tone: "warning" },
    moderate: { steps: 3, tone: "info" },
    high: { steps: 4, tone: "positive" },
    "very-high": { steps: 5, tone: "positive" },
  };
  const { steps, tone } = map[level];
  const dot = tone === "positive" ? "bg-emerald-500" : tone === "warning" ? "bg-amber-500" : tone === "critical" ? "bg-red-500" : tone === "info" ? "bg-sky-500" : "bg-muted-foreground";
  return (
    <div className="flex items-center gap-1.5">
      <div className="flex items-center gap-0.5">
        {Array.from({ length: 5 }).map((_, i) => (
          <span
            key={i}
            className={cn(
              "h-1.5 w-1.5 rounded-full",
              i < steps ? dot : "bg-hairline",
            )}
          />
        ))}
      </div>
      <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
        {level.replace("-", " ")}
      </span>
    </div>
  );
}

export function OwnerAvatar({ initials, name }: { initials: string; name?: string }) {
  return (
    <span
      title={name}
      className="grid h-6 w-6 place-items-center rounded-full border border-hairline bg-secondary text-[10px] font-medium text-foreground/80"
    >
      {initials}
    </span>
  );
}

export function RelativeTime({ iso }: { iso: string }) {
  const diff = Date.now() - new Date(iso).getTime();
  const days = Math.floor(diff / 86_400_000);
  const label =
    days < 1 ? "today" : days === 1 ? "yesterday" : days < 30 ? `${days}d ago` : days < 365 ? `${Math.floor(days / 30)}mo ago` : `${Math.floor(days / 365)}y ago`;
  return (
    <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
      {label}
    </span>
  );
}
