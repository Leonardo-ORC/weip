import { Bookmark, GitCompareArrows, Users2 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { EvidenceObject } from "../types";
import {
  ConfidenceIndicator,
  EVIDENCE_TYPE_LABEL,
  EvidenceBadge,
  EvidenceStatusBadge,
  EvidenceTag,
  HORMONAL_LABEL,
  QualityBadge,
} from "./EvidenceBadge";

interface Props {
  evidence: EvidenceObject;
  active: boolean;
  bookmarked: boolean;
  comparing: boolean;
  onSelect: (id: string) => void;
  onBookmark: (id: string) => void;
  onCompare: (id: string) => void;
}

export function EvidenceCard({
  evidence,
  active,
  bookmarked,
  comparing,
  onSelect,
  onBookmark,
  onCompare,
}: Props) {
  return (
    <article
      onClick={() => onSelect(evidence.id)}
      className={cn(
        "group cursor-pointer rounded-2xl border p-5 transition",
        active
          ? "border-primary bg-primary/5"
          : "border-hairline bg-background/60 hover:border-border",
      )}
    >
      <header className="flex items-start justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <EvidenceBadge tone="primary">{EVIDENCE_TYPE_LABEL[evidence.type]}</EvidenceBadge>
          <EvidenceBadge tone="outline">{evidence.studyDesign}</EvidenceBadge>
          <EvidenceStatusBadge status={evidence.status} />
        </div>
        <QualityBadge quality={evidence.quality} />
      </header>

      <h3 className="font-display mt-3 text-lg leading-tight tracking-tight">{evidence.title}</h3>
      <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{evidence.summary}</p>

      <dl className="mt-4 grid grid-cols-2 gap-3 text-xs">
        <Meta label="Drug" value={evidence.drug ?? "—"} />
        <Meta label="Condition" value={evidence.condition} />
        <Meta label="Hormonal" value={HORMONAL_LABEL[evidence.hormonalContext]} />
        <Meta
          label="Population"
          value={
            evidence.population.sampleSize > 0
              ? `n=${evidence.population.sampleSize.toLocaleString()}`
              : "—"
          }
        />
      </dl>

      <div className="mt-4 flex items-center justify-between border-t border-hairline pt-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
            {evidence.publication.journal} · {evidence.publication.year}
          </span>
          <ConfidenceIndicator level={evidence.confidence} />
        </div>
        <div className="flex items-center gap-1">
          <IconAction
            aria-label={bookmarked ? "Remove bookmark" : "Bookmark"}
            active={bookmarked}
            onClick={(e) => {
              e.stopPropagation();
              onBookmark(evidence.id);
            }}
          >
            <Bookmark className={cn("h-3.5 w-3.5", bookmarked && "fill-current")} />
          </IconAction>
          <IconAction
            aria-label={comparing ? "Remove from comparison" : "Add to comparison"}
            active={comparing}
            onClick={(e) => {
              e.stopPropagation();
              onCompare(evidence.id);
            }}
          >
            <GitCompareArrows className="h-3.5 w-3.5" />
          </IconAction>
        </div>
      </div>

      {evidence.tags.length > 0 ? (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {evidence.tags.slice(0, 4).map((t) => (
            <EvidenceTag key={t}>{t}</EvidenceTag>
          ))}
        </div>
      ) : null}

      <div className="mt-3 flex items-center gap-1 text-[10px] font-mono uppercase tracking-[0.18em] text-muted-foreground">
        <Users2 className="h-3 w-3" />
        {evidence.publication.authors.slice(0, 2).join(", ")}
        {evidence.publication.authors.length > 2 ? ` +${evidence.publication.authors.length - 2}` : ""}
      </div>
    </article>
  );
}

function Meta({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0">
      <dt className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">{label}</dt>
      <dd className="truncate text-foreground">{value}</dd>
    </div>
  );
}

function IconAction({
  active,
  children,
  onClick,
  ...rest
}: {
  active?: boolean;
  children: React.ReactNode;
  onClick: (e: React.MouseEvent) => void;
} & Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "onClick">) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "grid h-7 w-7 place-items-center rounded-md border transition",
        active
          ? "border-primary bg-primary/10 text-primary"
          : "border-hairline text-muted-foreground hover:text-foreground",
      )}
      {...rest}
    >
      {children}
    </button>
  );
}
