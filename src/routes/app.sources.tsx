import { createFileRoute } from "@tanstack/react-router";
import { AppPage } from "@/components/app/app-page";
import { ScientificSourcesWorkspace } from "@/features/sources";

export const Route = createFileRoute("/app/sources")({
  head: () => ({
    meta: [
      { title: "Scientific Sources — WEIP" },
      {
        name: "description",
        content:
          "Unified search across PubMed, ClinicalTrials.gov and OpenAlex, normalized into the Evidence pipeline.",
      },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: SourcesPage,
});

function SourcesPage() {
  return (
    <AppPage
      breadcrumbs={[{ label: "Workspace", to: "/app/dashboard" }, { label: "Sources" }]}
      eyebrow="Live sources"
      title="Scientific Sources"
      subtitle="One search across every connected scientific provider."
    >
      <div data-journey-target="sources">
        <ScientificSourcesWorkspace />
      </div>
    </AppPage>
  );
}
