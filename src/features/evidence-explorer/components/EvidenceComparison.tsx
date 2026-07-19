import { X } from "lucide-react";
import type { EvidenceObject } from "../types";
import {
  ConfidenceIndicator,
  EVIDENCE_TYPE_LABEL,
  HORMONAL_LABEL,
  QualityBadge,
} from "./EvidenceBadge";

interface Props {
  items: EvidenceObject[];
  onRemove: (id: string) => void;
  onClear: () => void;
}

const ROWS: Array<[string, (e: EvidenceObject) => React.ReactNode]> = [
  ["Type", (e) => EVIDENCE_TYPE_LABEL[e.type]],
  ["Study design", (e) => e.studyDesign],
  ["Drug", (e) => e.drug ?? "—"],
  ["Condition", (e) => e.condition],
  ["Population", (e) => (e.population.sampleSize ? `n=${e.population.sampleSize.toLocaleString()}` : "—")],
  ["Hormonal", (e) => HORMONAL_LABEL[e.hormonalContext]],
  ["Primary outcome", (e) => e.outcomes[0]?.result ?? "—"],
  ["Adverse events", (e) => (e.adverseEvents.length > 0 ? `${e.adverseEvents.length} reported` : "None")],
  ["Publication", (e) => `${e.publication.journal} · ${e.publication.year}`],
];

export function EvidenceComparison({ items, onRemove, onClear }: Props) {
  if (items.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-hairline bg-background/40 p-6 text-center text-sm text-muted-foreground">
        Select up to three evidence objects to compare side by side.
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-hairline bg-background/40 p-5">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
            Comparison
          </div>
          <div className="font-display text-base tracking-tight">
            {items.length} evidence object{items.length > 1 ? "s" : ""}
          </div>
        </div>
        <button
          type="button"
          onClick={onClear}
          className="rounded-full border border-hairline px-2.5 py-1 text-[11px] text-muted-foreground hover:text-foreground"
        >
          Clear
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[720px] text-sm">
          <thead>
            <tr className="text-left">
              <th className="w-40 pb-3 font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
                Field
              </th>
              {items.map((e) => (
                <th key={e.id} className="min-w-[220px] pb-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <div className="font-display truncate text-sm tracking-tight">
                        {e.title.slice(0, 42)}
                        {e.title.length > 42 ? "…" : ""}
                      </div>
                      <div className="mt-1 flex items-center gap-2">
                        <QualityBadge quality={e.quality} />
                        <ConfidenceIndicator level={e.confidence} />
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => onRemove(e.id)}
                      className="text-muted-foreground hover:text-foreground"
                      aria-label="Remove from comparison"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {ROWS.map(([label, render]) => (
              <tr key={label} className="border-t border-hairline">
                <th className="py-3 pr-3 text-left font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
                  {label}
                </th>
                {items.map((e) => (
                  <td key={e.id} className="py-3 pr-3 align-top text-xs text-foreground">
                    {render(e)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
