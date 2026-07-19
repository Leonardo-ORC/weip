import { createFileRoute } from "@tanstack/react-router";
import { AppPage } from "@/components/app/app-page";
import {
  EvidenceInspector,
  EvidenceWorkspace,
  useEvidenceWorkspace,
} from "@/features/evidence-explorer";
import {
  EvidenceRecommendationList,
  ResearchIntelligenceService,
} from "@/features/intelligence";

export const Route = createFileRoute("/app/evidence")({
  head: () => ({
    meta: [
      { title: "Evidence Workspace — WEIP" },
      {
        name: "description",
        content:
          "Review, validate, filter and explore structured Evidence Objects — the canonical repository of scientific findings.",
      },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: EvidencePage,
});

function EvidencePage() {
  const state = useEvidenceWorkspace();
  const related = state.selected
    ? ResearchIntelligenceService.relatedEvidence(state.selected)
    : [];

  return (
    <AppPage
      breadcrumbs={[{ label: "Workspace", to: "/app/dashboard" }, { label: "Evidence" }]}
      eyebrow="Evidence"
      title="Evidence Workspace"
      subtitle="The canonical repository of structured scientific findings. Review, validate, filter and compare Evidence Objects."
      contextPanelTitle="Evidence inspector"
      contextPanel={
        <div className="flex flex-col gap-6">
          <EvidenceInspector
            evidence={state.selected}
            bookmarked={state.selected ? state.bookmarks.includes(state.selected.id) : false}
            comparing={state.selected ? state.compareIds.includes(state.selected.id) : false}
            onBookmark={state.toggleBookmark}
            onCompare={state.toggleCompare}
          />
          {state.selected ? (
            <div className="px-5 pb-6">
              <div className="mb-2 font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
                Related evidence
              </div>
              <EvidenceRecommendationList
                evidence={related}
                emptyMessage="No related evidence detected."
              />
            </div>
          ) : null}
        </div>
      }
    >
      <div data-journey-target="evidence">
        <EvidenceWorkspace state={state} />
      </div>
    </AppPage>
  );
}
