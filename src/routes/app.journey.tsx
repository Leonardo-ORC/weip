import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ArrowRight, RotateCcw } from "lucide-react";
import { AppPage } from "@/components/app/app-page";
import { Button } from "@/components/ui/button";
import {
  DrugScorePanel,
  JourneyEntryCard,
  ProjectSummaryPanel,
  getStep,
  journeyStore,
  useJourney,
} from "@/features/journey";

export const Route = createFileRoute("/app/journey")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Guided Research Journey — WEIP" },
      {
        name: "description",
        content:
          "Experience the complete scientific workflow using a curated demonstration dataset.",
      },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: JourneyPage,
});

function JourneyPage() {
  const j = useJourney();
  const navigate = useNavigate();

  // Route as hub: intro / drug-score / summary depending on state
  return (
    <AppPage
      breadcrumbs={[
        { label: "Workspace", to: "/app/dashboard" },
        { label: "Guided Journey" },
      ]}
      eyebrow="Guided Journey"
      title="A scientific project, end to end."
      subtitle="Follow a curated demonstration through every layer of WEIP."
    >
      {!j.active && j.completed.length === 0 ? (
        <JourneyEntryCard variant="dashboard" />
      ) : j.currentStep === "drug-score" ? (
        <div className="flex flex-col gap-6" data-journey-target="drug-score">
          <DrugScorePanel />
          <ContinueRow
            label="Continue to project summary"
            onClick={() => {
              const next = journeyStore.completeCurrent();
              if (next) navigate({ to: getStep(next).route as never });
            }}
          />
        </div>
      ) : j.currentStep === "summary" || j.isComplete ? (
        <div className="flex flex-col gap-6" data-journey-target="summary">
          <ProjectSummaryPanel />
          <div className="flex flex-wrap items-center gap-3">
            <Button
              onClick={() => {
                journeyStore.completeCurrent();
                journeyStore.exit();
              }}
              size="sm"
              className="gap-2"
            >
              Finish and return to platform
              <ArrowRight className="h-3.5 w-3.5" />
            </Button>
            <button
              type="button"
              onClick={() => {
                journeyStore.reset();
                journeyStore.start();
                navigate({ to: getStep("sources").route as never });
              }}
              className="inline-flex items-center gap-1.5 text-xs text-muted-foreground underline-offset-4 transition hover:text-foreground hover:underline"
            >
              <RotateCcw className="h-3 w-3" /> Restart journey
            </button>
          </div>
        </div>
      ) : (
        // Journey active but on another step's route — offer resume
        <JourneyEntryCard variant="dashboard" />
      )}
    </AppPage>
  );
}

function ContinueRow({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <div className="flex justify-end">
      <Button onClick={onClick} size="sm" className="gap-2">
        {label}
        <ArrowRight className="h-3.5 w-3.5" />
      </Button>
    </div>
  );
}
