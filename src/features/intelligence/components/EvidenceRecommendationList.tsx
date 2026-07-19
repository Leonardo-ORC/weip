import type { EvidenceObject } from "@/features/evidence-explorer/types";

export function EvidenceRecommendationList({
  evidence,
  emptyMessage = "No recommendations yet.",
}: {
  evidence: readonly EvidenceObject[];
  emptyMessage?: string;
}) {
  if (evidence.length === 0) {
    return (
      <p className="rounded-xl border border-dashed border-hairline bg-background/40 p-4 text-sm text-muted-foreground">
        {emptyMessage}
      </p>
    );
  }
  return (
    <ul className="grid gap-2">
      {evidence.map((e) => (
        <li
          key={e.id}
          className="rounded-xl border border-hairline bg-background/60 p-3 transition hover:border-primary/40"
        >
          <div className="flex items-center justify-between gap-3">
            <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
              {e.studyDesign} · {e.publication.year}
            </span>
            <span className="font-mono text-[10px] text-teal">{e.confidence}</span>
          </div>
          <h4 className="font-display mt-1 text-sm leading-snug text-foreground line-clamp-2">
            {e.title}
          </h4>
          <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{e.summary}</p>
        </li>
      ))}
    </ul>
  );
}
