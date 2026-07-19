import type { ReactNode } from "react";
import { Sparkles } from "lucide-react";
import type { InsightSurface, ResearchInsight } from "../types";
import { useAiEnrichedInsights, useIntelligenceInsights } from "../hooks/use-intelligence";
import { InsightCard } from "./InsightCard";

interface Props {
  surface?: InsightSurface;
  title?: string;
  eyebrow?: string;
  subtitle?: string;
  limit?: number;
  insights?: readonly ResearchInsight[];
  compact?: boolean;
  emptyMessage?: string;
  action?: ReactNode;
}

export function IntelligencePanel({
  surface,
  title = "Research Intelligence",
  eyebrow = "Intelligence",
  subtitle = "Explainable insights derived from Evidence Objects and the Knowledge Graph.",
  limit = 6,
  insights,
  compact,
  emptyMessage = "No intelligence signals yet — insights will appear as evidence and relationships grow.",
  action,
}: Props) {
  const detected = useIntelligenceInsights(surface);
  const items = (insights ?? detected).slice(0, limit);
  const enrichment = useAiEnrichedInsights(items);

  return (
    <section className="rounded-2xl border border-hairline bg-background/60 p-6">
      <header className="mb-4 flex items-end justify-between gap-4">
        <div className="min-w-0">
          <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
            <Sparkles className="h-3 w-3 text-primary" />
            {eyebrow}
          </div>
          <h2 className="font-display mt-1 text-lg text-foreground">{title}</h2>
          {subtitle ? <p className="mt-1 text-xs text-muted-foreground">{subtitle}</p> : null}
        </div>
        <div className="flex items-center gap-2">
          <AiEnrichmentBadge status={enrichment.status} />
          {action}
        </div>
      </header>

      {items.length === 0 ? (
        <p className="rounded-xl border border-dashed border-hairline bg-background/40 p-6 text-sm text-muted-foreground">
          {emptyMessage}
        </p>
      ) : (
        <div className="grid gap-3 md:grid-cols-2">
          {items.map((i) => (
            <InsightCard key={i.id} insight={i} enrichment={enrichment} compact={compact} />
          ))}
        </div>
      )}
    </section>
  );
}

function AiEnrichmentBadge({ status }: { status: "idle" | "loading" | "ready" | "error" }) {
  const label =
    status === "loading"
      ? "AI enriching…"
      : status === "ready"
        ? "AI enriched"
        : status === "error"
          ? "Deterministic only"
          : "Deterministic";
  const tone =
    status === "ready"
      ? "border-primary/30 text-primary"
      : status === "loading"
        ? "border-teal/30 text-teal"
        : "border-hairline text-muted-foreground";
  return (
    <span
      className={"rounded-full border bg-background/60 px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.22em] " + tone}
    >
      {label}
    </span>
  );
}
