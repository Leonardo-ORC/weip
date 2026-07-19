import { createFileRoute } from "@tanstack/react-router";
import { AppPage } from "@/components/app/app-page";
import {
  CommandCenter,
  DashboardStack,
  NextAction,
  QuickActions,
  ResearchJourney,
  useDashboardData,
} from "@/features/dashboard";
import {
  IntelligenceMetrics,
  IntelligencePanel,
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

  return (
    <AppPage
      breadcrumbs={[{ label: "Workspace", to: "/app/dashboard" }, { label: "Dashboard" }]}
      eyebrow="Overview"
      title="Research Command Center"
      subtitle="Where you are in the workflow, and what to do next."
    >
      <DashboardStack>
        <CommandCenter />

        <ResearchJourney />

        <NextAction />

        <QuickActions actions={data.quickActions} />

        <IntelligenceMetrics metrics={metrics} />

        <IntelligencePanel
          surface="dashboard"
          title="Signals from your evidence"
          subtitle="Deterministic detectors first — AI only enriches summaries."
        />
      </DashboardStack>
    </AppPage>
  );
}
