import { createFileRoute } from "@tanstack/react-router";
import { AppPage } from "@/components/app/app-page";
import { ResearchWorkspace, useResearchWorkspace } from "@/features/research";
import {
  CoverageHeatmap,
  IntelligenceMetrics,
  IntelligencePanel,
  ResearchIntelligenceService,
  useIntelligenceMetrics,
} from "@/features/intelligence";

export const Route = createFileRoute("/app/research")({
  head: () => ({
    meta: [
      { title: "Research — WEIP" },
      {
        name: "description",
        content:
          "AI-assisted scientific reasoning: insights, knowledge gaps, hypotheses and trend analysis over Evidence Objects and the Knowledge Graph.",
      },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: ResearchPage,
});

function ResearchPage() {
  const state = useResearchWorkspace();
  const metrics = useIntelligenceMetrics();

  return (
    <AppPage
      breadcrumbs={[{ label: "Workspace", to: "/app/dashboard" }, { label: "Research" }]}
      eyebrow="Research"
      title="Scientific reasoning"
      subtitle="Insights, gaps, hypotheses and trends — the canonical home for Research Intelligence."
    >
      <div className="flex flex-col gap-10">
        <IntelligenceMetrics metrics={metrics} />

        <IntelligencePanel
          surface="research"
          title="Insights & recommendations"
          subtitle="Explainable signals derived from Evidence Objects and the Knowledge Graph."
          limit={6}
        />

        <CoverageHeatmap coverage={ResearchIntelligenceService.areaCoverage()} />

        <ResearchWorkspace state={state} />
      </div>
    </AppPage>
  );
}
