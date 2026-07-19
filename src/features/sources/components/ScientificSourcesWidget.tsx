import { Link } from "@tanstack/react-router";
import { ArrowRight, Radio } from "lucide-react";
import { DashboardWidget } from "@/features/dashboard";
import { ProviderBadge } from "./ProviderBadge";
import { ScientificSourceRegistry } from "../registry";
import { useUnifiedImports } from "../hooks/use-unified-imports";
import { useProviderHealth } from "../hooks/use-provider-health";
import type { SourceId } from "../types";

export function ScientificSourcesWidget() {
  const imports = useUnifiedImports();
  const health = useProviderHealth();
  const ids = ScientificSourceRegistry.ids();
  const perSource = imports.totals.perSource;
  const healthById = new Map(health.data?.map((r) => [r.source, r]) ?? []);

  const totals: { id: SourceId; label: string; value: number }[] = [
    { id: "pubmed", label: "PubMed articles", value: perSource.pubmed },
    { id: "clinicaltrials", label: "Clinical trials", value: perSource.clinicaltrials },
    { id: "openalex", label: "OpenAlex works", value: perSource.openalex },
  ];

  return (
    <DashboardWidget
      eyebrow="Scientific sources"
      title="Unified scientific intelligence"
      subtitle="One search across every connected provider — normalized into the Evidence pipeline."
      action={
        <Link
          to="/app/sources"
          className="inline-flex items-center gap-1 rounded-full border border-hairline px-3 py-1 text-xs text-foreground transition hover:bg-secondary"
        >
          Open sources <ArrowRight className="h-3 w-3" />
        </Link>
      }
    >
      <div className="grid gap-5 lg:grid-cols-3">
        <div className="grid grid-cols-3 gap-3 lg:col-span-3">
          {totals.map((t) => (
            <div key={t.id} className="rounded-xl border border-hairline bg-background/40 p-3">
              <div className="mb-1"><ProviderBadge source={t.id} /></div>
              <div className="font-display text-xl tracking-tight">{t.value}</div>
              <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
                {t.label}
              </div>
            </div>
          ))}
        </div>

        <div className="lg:col-span-2">
          <div className="mb-2 font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
            Latest imports
          </div>
          {imports.records.length === 0 ? (
            <div className="rounded-lg border border-dashed border-hairline p-4 text-xs text-muted-foreground">
              No imports yet — run a unified search to populate the Evidence Workspace.
            </div>
          ) : (
            <ul className="grid gap-2">
              {imports.records.slice(0, 5).map((r) => (
                <li
                  key={r.id}
                  className="flex items-center gap-3 rounded-lg border border-hairline bg-background/40 p-2.5"
                >
                  <div className="grid h-7 w-7 place-items-center rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                    <Radio className="h-3.5 w-3.5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-xs font-medium text-foreground">
                      {r.record.title}
                    </div>
                    <div className="mt-0.5 flex items-center gap-2">
                      <ProviderBadge source={r.source} />
                      <span className="truncate font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                        {r.record.journal ?? r.record.externalId}
                      </span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div>
          <div className="mb-2 font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
            Provider health
          </div>
          <ul className="grid gap-1.5">
            {ids.map((id) => {
              const rep = healthById.get(id);
              const status = rep?.status ?? "unknown";
              return (
                <li
                  key={id}
                  className="flex items-center justify-between rounded-md border border-hairline bg-background/40 px-2.5 py-1.5"
                >
                  <div className="flex items-center gap-2">
                    <ProviderBadge source={id} />
                  </div>
                  <span
                    className={
                      "font-mono text-[10px] uppercase tracking-[0.18em] " +
                      (status === "connected"
                        ? "text-emerald-600 dark:text-emerald-400"
                        : status === "degraded"
                          ? "text-amber-600 dark:text-amber-400"
                          : status === "disconnected"
                            ? "text-destructive"
                            : "text-muted-foreground")
                    }
                  >
                    {status}
                  </span>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </DashboardWidget>
  );
}
