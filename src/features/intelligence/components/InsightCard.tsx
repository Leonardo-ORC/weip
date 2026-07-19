import type { ReactNode } from "react";
import {
  AlertTriangle,
  Compass,
  Layers,
  Lightbulb,
  Network,
  Sparkles,
  TrendingUp,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type {
  InsightKind,
  InsightSeverity,
  ResearchInsight,
} from "../types";
import type { AiEnrichmentMap } from "../hooks/use-intelligence";

const KIND_ICON: Partial<Record<InsightKind, typeof Sparkles>> = {
  "research-gap": AlertTriangle,
  "coverage-gap": AlertTriangle,
  "research-opportunity": Compass,
  "conflicting-evidence": Zap,
  "high-confidence-evidence": Sparkles,
  "emerging-topic": TrendingUp,
  "trending-concept": TrendingUp,
  "highly-connected-concept": Network,
  "suggested-hypothesis": Lightbulb,
  "suggested-question": Lightbulb,
  "suggested-merge": Layers,
  "suggested-reading": Lightbulb,
  "supporting-evidence": Sparkles,
  "weakly-studied-area": AlertTriangle,
  "rapidly-growing-area": TrendingUp,
  "suggested-collaboration": Compass,
  "suggested-collection": Layers,
  "duplicate-evidence": Layers,
  "concept-overlap": Network,
};

const SEVERITY_STYLE: Record<InsightSeverity, string> = {
  info: "border-hairline bg-background/60 text-foreground",
  signal: "border-primary/25 bg-primary/[0.04] text-foreground",
  opportunity: "border-teal/25 bg-teal/[0.04] text-foreground",
  warning: "border-amber-400/30 bg-amber-50/40 text-foreground dark:bg-amber-500/[0.05]",
};

const SEVERITY_LABEL: Record<InsightSeverity, string> = {
  info: "Insight",
  signal: "Signal",
  opportunity: "Opportunity",
  warning: "Attention",
};

interface Props {
  insight: ResearchInsight;
  enrichment?: AiEnrichmentMap;
  compact?: boolean;
  action?: ReactNode;
}

export function InsightCard({ insight, enrichment, compact, action }: Props) {
  const Icon = KIND_ICON[insight.kind] ?? Sparkles;
  const enriched = enrichment?.byId.get(insight.id);
  const description = enriched?.summary || insight.description;

  return (
    <article
      className={cn(
        "rounded-2xl border p-4 transition",
        SEVERITY_STYLE[insight.severity],
      )}
    >
      <header className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-2.5 min-w-0">
          <span className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-full border border-hairline bg-background">
            <Icon className="h-3.5 w-3.5 text-primary" />
          </span>
          <div className="min-w-0">
            <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
              {SEVERITY_LABEL[insight.severity]} · {insight.kind.replace(/-/g, " ")}
            </div>
            <h3 className="font-display mt-0.5 truncate text-sm text-foreground">{insight.title}</h3>
          </div>
        </div>
        <ConfidencePill overall={insight.confidence.overall} ai={insight.confidence.ai} />
      </header>

      {!compact ? (
        <>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{description}</p>
          {enriched?.action ? (
            <p className="mt-2 rounded-lg border border-dashed border-hairline bg-background/60 px-3 py-2 text-xs text-foreground">
              <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
                Suggested next step
              </span>
              <br />
              {enriched.action}
            </p>
          ) : null}
          <TraceabilityStrip insight={insight} enriched={enriched} />
          {action ? <div className="mt-3">{action}</div> : null}
        </>
      ) : (
        <p className="mt-2 line-clamp-2 text-xs text-muted-foreground">{description}</p>
      )}
    </article>
  );
}

function ConfidencePill({ overall, ai }: { overall: number; ai: number }) {
  const pct = Math.round(overall * 100);
  return (
    <div className="flex shrink-0 flex-col items-end gap-0.5">
      <span className="rounded-full border border-hairline bg-background/80 px-2 py-0.5 font-mono text-[10px] tracking-wider text-foreground">
        {pct}%
      </span>
      {ai > 0 ? (
        <span className="font-mono text-[9px] uppercase tracking-widest text-primary">AI · {(ai * 100).toFixed(0)}%</span>
      ) : (
        <span className="font-mono text-[9px] uppercase tracking-widest text-muted-foreground">deterministic</span>
      )}
    </div>
  );
}

function TraceabilityStrip({
  insight,
  enriched,
}: {
  insight: ResearchInsight;
  enriched?: { model: string | null; generatedAt: string };
}) {
  const parts: string[] = [];
  if (insight.traceability.evidenceIds.length)
    parts.push(`${insight.traceability.evidenceIds.length} evidence`);
  if (insight.traceability.nodeIds.length)
    parts.push(`${insight.traceability.nodeIds.length} graph nodes`);
  if (insight.traceability.projectIds.length)
    parts.push(`${insight.traceability.projectIds.length} projects`);
  if (insight.traceability.collectionIds.length)
    parts.push(`${insight.traceability.collectionIds.length} collections`);
  return (
    <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
      <span>{insight.traceability.reasoningSource}</span>
      {parts.map((p) => (
        <span key={p}>· {p}</span>
      ))}
      {enriched?.model ? <span>· {enriched.model}</span> : null}
    </div>
  );
}
