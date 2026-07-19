import { GitBranch } from "lucide-react";
import type { TraceabilityMap } from "../types";
import { PanelShell } from "./PanelShell";

export function EvidenceTraceabilityPanel({ trace }: { trace: TraceabilityMap }) {
  return (
    <PanelShell icon={GitBranch} title="Traceability" eyebrow="Provenance">
      {trace.entries.length === 0 ? (
        <p className="text-sm text-muted-foreground">No traceable fields recorded.</p>
      ) : (
        <ul className="grid gap-2">
          {trace.entries.slice(0, 12).map((entry) => (
            <li
              key={`${entry.field}-${entry.source}`}
              className="rounded-lg border border-hairline bg-background/40 p-2.5"
            >
              <div className="flex items-center justify-between text-[11px]">
                <span className="font-medium text-foreground">{entry.field}</span>
                <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                  {entry.source} · {entry.method}
                </span>
              </div>
              {entry.snippet ? (
                <p className="mt-1 line-clamp-2 text-[11px] text-muted-foreground">
                  “{entry.snippet}”
                </p>
              ) : null}
            </li>
          ))}
        </ul>
      )}
    </PanelShell>
  );
}
