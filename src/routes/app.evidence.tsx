import { createFileRoute } from "@tanstack/react-router";
import { AppPage } from "@/components/app/app-page";
import {
  EvidenceInspector,
  EvidenceWorkspace,
  useEvidenceWorkspace,
} from "@/features/evidence-explorer";

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
  return (
    <AppPage
      breadcrumbs={[{ label: "Workspace", to: "/app/dashboard" }, { label: "Evidence" }]}
      eyebrow="Evidence"
      title="Evidence Workspace"
      subtitle="Structured scientific evidence, ready for inspection and comparison."
      contextPanelTitle="Evidence inspector"
      contextPanel={
        <EvidenceInspector
          evidence={state.selected}
          bookmarked={state.selected ? state.bookmarks.includes(state.selected.id) : false}
          comparing={state.selected ? state.compareIds.includes(state.selected.id) : false}
          onBookmark={state.toggleBookmark}
          onCompare={state.toggleCompare}
        />
      }
    >
      <EvidenceWorkspace />
    </AppPage>
  );
}
