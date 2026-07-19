import { createFileRoute } from "@tanstack/react-router";
import { Workflow } from "lucide-react";
import { AppPage } from "@/components/app/app-page";
import {
  IntelligenceMetrics,
  IntelligencePanel,
  useIntelligenceMetrics,
} from "@/features/intelligence";

export const Route = createFileRoute("/app/pipeline")({
  head: () => ({ meta: [{ title: "Pipeline — WEIP" }, { name: "robots", content: "noindex" }] }),
  component: PipelinePage,
});

function PipelinePage() {
  const metrics = useIntelligenceMetrics();
  return (
    <AppPage
      eyebrow="Pipeline"
      title="Processing pipeline"
      subtitle="Ingestion, validation, normalization, enrichment and storage — measured by Research Intelligence quality."
      breadcrumbs={[{ label: "Intelligence", to: "/app/dashboard" }, { label: "Pipeline" }]}
    >
      <div className="flex flex-col gap-8">
        <IntelligenceMetrics metrics={metrics} />

        <IntelligencePanel
          surface="pipeline"
          title="Pipeline intelligence"
          subtitle="Data-quality signals surfaced from extraction, coverage and recommendation success."
          limit={4}
          emptyMessage="Pipeline is healthy — no attention signals right now."
        />

        <section className="rounded-2xl border border-dashed border-hairline bg-background/40 p-6">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Workflow className="h-4 w-4" />
            Live stage-by-stage telemetry will appear here as ingestion jobs run.
          </div>
        </section>
      </div>
    </AppPage>
  );
}
