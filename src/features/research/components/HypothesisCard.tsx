import { Lightbulb, MinusCircle, PlusCircle } from "lucide-react";
import type { Hypothesis, ResearchProject } from "../types";
import { ConfidenceIndicator, HypothesisStatusBadge, RelativeTime } from "./ResearchBadge";

export function HypothesisCard({
  hypothesis,
  projectTitle,
}: {
  hypothesis: Hypothesis;
  projectTitle?: string;
}) {
  return (
    <article className="rounded-2xl border border-hairline bg-background/60 p-5">
      <div className="flex items-start gap-3">
        <div className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-secondary text-foreground/80">
          <Lightbulb className="h-4 w-4" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="mb-1 flex items-center gap-2">
            <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
              {projectTitle ?? "Hypothesis"}
            </span>
            <span className="text-muted-foreground/40">·</span>
            <RelativeTime iso={hypothesis.updatedAt} />
          </div>
          <h4 className="font-display text-base leading-snug tracking-tight text-foreground">
            {hypothesis.title}
          </h4>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            {hypothesis.description}
          </p>

          <div className="mt-3 flex flex-wrap items-center gap-3">
            <HypothesisStatusBadge status={hypothesis.status} />
            <ConfidenceIndicator level={hypothesis.confidence} />
          </div>

          <div className="mt-4 grid grid-cols-2 gap-2">
            <div className="flex items-center gap-2 rounded-lg border border-hairline bg-background/40 px-3 py-2">
              <PlusCircle className="h-3.5 w-3.5 text-emerald-500" />
              <div className="flex-1">
                <div className="font-display text-sm">{hypothesis.supporting}</div>
                <div className="font-mono text-[9px] uppercase tracking-[0.22em] text-muted-foreground">
                  Supporting
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 rounded-lg border border-hairline bg-background/40 px-3 py-2">
              <MinusCircle className="h-3.5 w-3.5 text-red-500" />
              <div className="flex-1">
                <div className="font-display text-sm">{hypothesis.contradicting}</div>
                <div className="font-mono text-[9px] uppercase tracking-[0.22em] text-muted-foreground">
                  Contradicting
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}

export function HypothesisList({
  hypotheses,
  projects,
}: {
  hypotheses: Hypothesis[];
  projects: ResearchProject[];
}) {
  if (hypotheses.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-hairline bg-background/40 p-8 text-center text-sm text-muted-foreground">
        No hypotheses match.
      </div>
    );
  }
  return (
    <div className="grid gap-3 lg:grid-cols-2">
      {hypotheses.map((h) => (
        <HypothesisCard
          key={h.id}
          hypothesis={h}
          projectTitle={projects.find((p) => p.id === h.projectId)?.title}
        />
      ))}
    </div>
  );
}
