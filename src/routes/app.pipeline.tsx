import { createFileRoute } from "@tanstack/react-router";
import { Activity, CheckCircle2, AlertCircle, Clock } from "lucide-react";
import { AppPage } from "@/components/app/app-page";
import { ProviderStatusPanel } from "@/features/sources/components/ProviderStatusPanel";
import { SourceStatistics } from "@/features/sources/components/SourceStatistics";
import { useProviderHealth } from "@/features/sources/hooks/use-provider-health";
import { useUnifiedImports } from "@/features/sources/hooks/use-unified-imports";

export const Route = createFileRoute("/app/pipeline")({
  head: () => ({
    meta: [
      { title: "Pipeline — WEIP" },
      {
        name: "description",
        content: "Technical monitoring: provider execution, validation and processing history.",
      },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: PipelinePage,
});

const STAGES = [
  { id: "search", label: "Search", desc: "Provider search executed" },
  { id: "validate", label: "Validate", desc: "Payload shape and identifiers" },
  { id: "normalize", label: "Normalize", desc: "Provider → NormalizedRecord" },
  { id: "extract", label: "Extract", desc: "Deterministic + AI extraction" },
  { id: "transform", label: "Transform", desc: "Evidence Object build" },
  { id: "store", label: "Store", desc: "Import store commit" },
  { id: "expose", label: "Expose", desc: "Available to workspaces" },
] as const;

function PipelinePage() {
  const health = useProviderHealth();
  const imports = useUnifiedImports();
  const totalImports = imports.totals.total;

  return (
    <AppPage
      eyebrow="Pipeline"
      title="Processing execution"
      subtitle="Technical monitoring for source ingestion — providers, stages, validation and history."
      breadcrumbs={[{ label: "Workspace", to: "/app/dashboard" }, { label: "Pipeline" }]}
    >
      <div className="flex flex-col gap-8">
        {/* Primary — execution telemetry */}
        <section className="grid gap-4 md:grid-cols-3">
          <StatCard icon={CheckCircle2} label="Records imported" value={String(totalImports)} />
          <StatCard
            icon={Activity}
            label="Providers online"
            value={`${(health.data ?? []).filter((r) => r.status === "connected").length}/${health.data?.length ?? 0}`}
          />
          <StatCard
            icon={Clock}
            label="Last import"
            value={imports.totals.last ? new Date(imports.totals.last).toLocaleTimeString() : "—"}
          />
        </section>

        {/* Secondary — stage map */}
        <section className="rounded-2xl border border-hairline bg-background/60 p-6">
          <header className="mb-4">
            <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
              Stages
            </div>
            <h2 className="font-display text-lg text-foreground">Ingestion pipeline</h2>
          </header>
          <ol className="grid gap-2 md:grid-cols-7">
            {STAGES.map((s, i) => (
              <li key={s.id} className="rounded-xl border border-hairline bg-background/40 p-3">
                <div className="font-mono text-[10px] text-muted-foreground">0{i + 1}</div>
                <div className="mt-1 text-sm text-foreground">{s.label}</div>
                <div className="mt-0.5 text-[11px] leading-tight text-muted-foreground">{s.desc}</div>
              </li>
            ))}
          </ol>
        </section>

        {/* Supporting — providers + counts */}
        <section className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
          <ProviderStatusPanel reports={health.data} loading={health.isLoading} />
          <div className="rounded-2xl border border-hairline bg-background/60 p-5">
            <header className="mb-3">
              <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
                By source
              </div>
              <h3 className="font-display text-base text-foreground">Import distribution</h3>
            </header>
            <SourceStatistics counts={imports.totals.perSource} />
          </div>
        </section>

        {totalImports === 0 ? (
          <section className="rounded-2xl border border-dashed border-hairline bg-background/40 p-6 text-center">
            <AlertCircle className="mx-auto h-5 w-5 text-muted-foreground" />
            <p className="mx-auto mt-2 max-w-md text-xs text-muted-foreground">
              Pipeline is idle. Run an import from Scientific Sources to see stage-by-stage execution here.
            </p>
          </section>
        ) : null}
      </div>
    </AppPage>
  );
}

function StatCard({ icon: Icon, label, value }: { icon: typeof Activity; label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-hairline bg-background/60 p-5">
      <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
        <Icon className="h-3.5 w-3.5" /> {label}
      </div>
      <div className="font-display mt-2 text-2xl tracking-tight text-foreground">{value}</div>
    </div>
  );
}
