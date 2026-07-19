import { cn } from "@/lib/utils";
import { ScientificSourceRegistry } from "../registry";
import type { SourceHealthReport, SourceId } from "../types";

const DOT: Record<SourceHealthReport["status"], string> = {
  connected: "bg-emerald-500",
  degraded: "bg-amber-500",
  disconnected: "bg-destructive",
  unknown: "bg-muted-foreground/50",
};

export function ProviderHealthIndicator({
  source,
  report,
}: {
  source: SourceId;
  report?: SourceHealthReport;
}) {
  const meta = ScientificSourceRegistry.metadataFor(source);
  const status = report?.status ?? "unknown";
  return (
    <div className="flex items-center justify-between rounded-lg border border-hairline bg-background/50 p-3">
      <div className="min-w-0">
        <div className="flex items-center gap-2">
          <span className={cn("inline-block h-1.5 w-1.5 rounded-full", DOT[status])} aria-hidden />
          <div className="font-display text-sm tracking-tight text-foreground">
            {meta?.name ?? source}
          </div>
        </div>
        <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
          {status}
          {typeof report?.responseTimeMs === "number" ? ` · ${report.responseTimeMs}ms` : ""}
        </div>
      </div>
      {report?.checkedAt ? (
        <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
          {new Date(report.checkedAt).toLocaleTimeString()}
        </div>
      ) : null}
    </div>
  );
}

export function ProviderStatusPanel({
  reports,
  loading,
}: {
  reports?: readonly SourceHealthReport[];
  loading?: boolean;
}) {
  const ids = ScientificSourceRegistry.ids();
  const byId = new Map(reports?.map((r) => [r.source, r]) ?? []);
  return (
    <section className="rounded-2xl border border-hairline bg-background/60 p-5">
      <header className="mb-4">
        <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
          Provider health
        </div>
        <h3 className="font-display mt-1 text-base tracking-tight">Connection status</h3>
      </header>
      <div className="grid gap-2">
        {ids.map((id) => (
          <ProviderHealthIndicator key={id} source={id} report={byId.get(id)} />
        ))}
        {loading && !reports ? (
          <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
            Checking…
          </div>
        ) : null}
      </div>
    </section>
  );
}
