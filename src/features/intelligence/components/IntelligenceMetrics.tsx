import type { IntelligenceMetricsSummary } from "../types";

const PCT = (v: number) => `${Math.round(v * 100)}%`;

export function IntelligenceMetrics({ metrics }: { metrics: IntelligenceMetricsSummary }) {
  const items: { label: string; value: string; hint?: string }[] = [
    { label: "Intelligence Quality", value: PCT(metrics.intelligenceQuality), hint: "Composite" },
    { label: "Extraction Quality", value: PCT(metrics.extractionQuality) },
    { label: "Knowledge Coverage", value: PCT(metrics.knowledgeCoverage) },
    { label: "Relationship Density", value: PCT(metrics.relationshipDensity) },
    { label: "Evidence Confidence", value: PCT(metrics.evidenceConfidence) },
    { label: "Recommendation Success", value: PCT(metrics.recommendationSuccess) },
    { label: "Knowledge Growth", value: PCT(metrics.knowledgeGrowth) },
    { label: "Insights", value: String(metrics.insights), hint: `${metrics.opportunities} opportunities · ${metrics.gaps} gaps` },
  ];
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {items.map((m) => (
        <div key={m.label} className="rounded-xl border border-hairline bg-background/60 p-4">
          <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
            {m.label}
          </div>
          <div className="font-display mt-1 text-xl tracking-tight text-foreground">{m.value}</div>
          {m.hint ? <div className="mt-1 text-[10px] text-muted-foreground">{m.hint}</div> : null}
        </div>
      ))}
    </div>
  );
}
