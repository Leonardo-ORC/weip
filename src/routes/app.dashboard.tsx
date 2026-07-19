import { createFileRoute, Link } from "@tanstack/react-router";
import { Plus, Search } from "lucide-react";
import { AppPage } from "@/components/app/app-page";
import {
  ActivityWidget,
  CollectionsWidget,
  CommandCenter,
  DashboardRow,
  DashboardStack,
  HealthList,
  InsightsPanel,
  NotificationPanel,
  PipelineOverview,
  PlatformStatusGrid,
  ProjectsWidget,
  QuickActions,
  RoadmapWidget,
  useDashboardData,
} from "@/features/dashboard";
import { OntologyReadyWidget } from "@/features/ontology";
import { EvidenceReadyWidget } from "@/features/evidence-explorer";
import { ResearchReadyWidget } from "@/features/research";
import { ScientificSourcesWidget } from "@/features/sources";
import { KnowledgeCoverageWidget } from "@/features/graph";
import {
  CoverageHeatmap,
  EvidenceRecommendationList,
  IntelligenceMetrics,
  IntelligencePanel,
  ResearchIntelligenceService,
  useIntelligenceMetrics,
} from "@/features/intelligence";

export const Route = createFileRoute("/app/dashboard")({
  head: () => ({
    meta: [
      { title: "Research Command Center — WEIP" },
      { name: "description", content: "Your operational hub for scientific evidence." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: DashboardPage,
});

function DashboardPage() {
  const data = useDashboardData();
  const metrics = useIntelligenceMetrics();
  const coverage = ResearchIntelligenceService.areaCoverage();
  const highConfidence = ResearchIntelligenceService.highConfidenceEvidence();

  return (
    <AppPage
      breadcrumbs={[{ label: "Workspace", to: "/app/dashboard" }, { label: "Dashboard" }]}
      eyebrow="Overview"
      title="Research Command Center"
      subtitle="A calm, real-time read of your scientific environment."
    >
      <DashboardStack>
        <CommandCenter
          primaryAction={
            <Link
              to="/app/projects"
              className="inline-flex items-center gap-1.5 rounded-full bg-ink px-4 py-2 text-sm font-medium text-background shadow-soft transition hover:opacity-90"
            >
              <Plus className="h-4 w-4" /> New project
            </Link>
          }
          secondaryAction={
            <Link
              to="/app/evidence"
              className="inline-flex items-center gap-1.5 rounded-full border border-hairline px-4 py-2 text-sm text-foreground transition hover:bg-secondary"
            >
              <Search className="h-4 w-4" /> Browse evidence
            </Link>
          }
        />

        <QuickActions actions={data.quickActions} />

        <IntelligenceMetrics metrics={metrics} />
        <IntelligencePanel
          surface="dashboard"
          title="Research opportunities & signals"
          subtitle="Deterministic detectors first — OpenAI enriches summaries without replacing them."
        />

        <section className="rounded-2xl border border-hairline bg-background/60 p-6">
          <header className="mb-4">
            <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
              Coverage
            </div>
            <h2 className="font-display mt-1 text-lg text-foreground">Research area coverage</h2>
          </header>
          <CoverageHeatmap coverage={coverage} />
        </section>

        <section className="rounded-2xl border border-hairline bg-background/60 p-6">
          <header className="mb-4">
            <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
              Recent discoveries
            </div>
            <h2 className="font-display mt-1 text-lg text-foreground">High-confidence evidence</h2>
          </header>
          <EvidenceRecommendationList evidence={highConfidence} />
        </section>

        <InsightsPanel items={data.insights} />
        <KnowledgeCoverageWidget />
        <ScientificSourcesWidget />
        <OntologyReadyWidget />
        <EvidenceReadyWidget />
        <ResearchReadyWidget />


        <DashboardRow ratio="primary">
          <PlatformStatusGrid modules={data.modules} />
          <ActivityWidget items={data.activity} />
        </DashboardRow>

        <ProjectsWidget projects={data.projects} />

        <DashboardRow ratio="balanced">
          <CollectionsWidget collections={data.collections} />
          <NotificationPanel items={data.notifications} />
        </DashboardRow>

        <PipelineOverview nodes={data.pipeline} />

        <DashboardRow ratio="primary">
          <HealthList checks={data.health} />
          <RoadmapWidget modules={data.roadmap} />
        </DashboardRow>
      </DashboardStack>
    </AppPage>
  );
}
