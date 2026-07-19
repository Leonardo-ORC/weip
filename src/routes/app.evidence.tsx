import { createFileRoute } from "@tanstack/react-router";
import { AppPage } from "@/components/app/app-page";
import {
  EvidenceInspector,
  EvidenceWorkspace,
  useEvidenceWorkspace,
} from "@/features/evidence-explorer";
import {
  EvidenceRecommendationList,
  IntelligencePanel,
  ResearchIntelligenceService,
} from "@/features/intelligence";

export const Route = createFileRoute("/app/evidence")({
  head: () => ({
    meta: [
      { title: "Evidence Workspace — WEIP" },
      {
        name: "description",
        content:
          "Search, filter, inspect and compare structured Evidence Objects across women's hormonal health.",
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
      subtitle="Structured scientific evidence, ready for inspection and comparison."
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
      <div className="flex flex-col gap-8">
        <IntelligencePanel
          surface="evidence"
          title="Evidence intelligence"
          subtitle="High-confidence evidence, conflicts and clinical relevance."
          limit={4}
        />
        <EvidenceWorkspace state={state} />
      </div>
    </AppPage>
  );
}

