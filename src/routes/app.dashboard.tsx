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
        <InsightsPanel items={data.insights} />
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
