import { ProviderBadge } from "./ProviderBadge";
import { ScientificSourceRegistry } from "../registry";
import type { SourceId } from "../types";

export function SourceStatistics({
  counts,
}: {
  counts: Readonly<Record<SourceId, number>>;
}) {
  const ids = ScientificSourceRegistry.ids();
  return (
    <div className="grid grid-cols-3 gap-2">
      {ids.map((id) => (
        <div
          key={id}
          className="rounded-xl border border-hairline bg-background/40 p-3"
        >
          <div className="mb-1">
            <ProviderBadge source={id} />
          </div>
          <div className="font-display text-xl tracking-tight">
            {counts[id] ?? 0}
          </div>
          <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
            Imported
          </div>
        </div>
      ))}
    </div>
  );
}
