import { RESEARCH_AREA_LABEL } from "@/features/research/types";
import type { AreaCoverage } from "../types";

export function CoverageHeatmap({ coverage }: { coverage: readonly AreaCoverage[] }) {
  return (
    <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
      {coverage.map((a) => {
        const pct = Math.round(a.coverage * 100);
        return (
          <div key={a.area} className="rounded-xl border border-hairline bg-background/60 p-3">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
                {RESEARCH_AREA_LABEL[a.area]}
              </span>
              <span className="font-mono text-[10px] text-foreground">{pct}%</span>
            </div>
            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-background">
              <div
                className="h-full rounded-full bg-primary"
                style={{ width: `${Math.max(4, pct)}%` }}
              />
            </div>
            <div className="mt-1 font-mono text-[10px] text-muted-foreground">
              {a.evidenceCount} evidence · gap {(a.gap * 100).toFixed(0)}%
            </div>
          </div>
        );
      })}
    </div>
  );
}
