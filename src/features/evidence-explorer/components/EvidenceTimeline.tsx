import type { EvidenceObject } from "../types";

interface Props {
  items: EvidenceObject[];
  onSelect: (id: string) => void;
  activeId?: string;
}

export function EvidenceTimeline({ items, onSelect, activeId }: Props) {
  const sorted = [...items].sort((a, b) => a.publication.year - b.publication.year);
  if (sorted.length === 0) return null;
  const years = sorted.map((e) => e.publication.year);
  const min = Math.min(...years);
  const max = Math.max(...years);
  const span = max - min || 1;

  return (
    <div className="rounded-xl border border-hairline bg-background/40 p-5">
      <div className="mb-6 flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
        <span>{min}</span>
        <span>{max}</span>
      </div>
      <div className="relative h-16">
        <div className="absolute left-0 right-0 top-1/2 h-px bg-hairline" />
        {sorted.map((e) => {
          const pos = ((e.publication.year - min) / span) * 100;
          const active = e.id === activeId;
          return (
            <button
              key={e.id}
              type="button"
              onClick={() => onSelect(e.id)}
              className="absolute -translate-x-1/2 group"
              style={{ left: `${pos}%`, top: "50%", transform: `translate(-50%, -50%)` }}
              title={`${e.publication.year} · ${e.title}`}
            >
              <span
                className={
                  "block h-3 w-3 rounded-full border transition " +
                  (active
                    ? "border-primary bg-primary"
                    : "border-primary/60 bg-background hover:bg-primary")
                }
              />
              <span className="pointer-events-none absolute left-1/2 top-5 -translate-x-1/2 whitespace-nowrap font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground opacity-0 transition group-hover:opacity-100">
                {e.publication.year}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
