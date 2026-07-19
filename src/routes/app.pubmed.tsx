import { createFileRoute } from "@tanstack/react-router";
import { AppPage } from "@/components/app/app-page";
import { PubMedWorkspace } from "@/features/pubmed";

export const Route = createFileRoute("/app/pubmed")({
  head: () => ({
    meta: [
      { title: "PubMed — WEIP" },
      {
        name: "description",
        content: "Live PubMed search and ingestion into the WEIP Evidence Workspace.",
      },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: PubMedPage,
});

function PubMedPage() {
  return (
    <AppPage
      breadcrumbs={[{ label: "Workspace", to: "/app/dashboard" }, { label: "PubMed" }]}
      eyebrow="Live source"
      title="PubMed"
      subtitle="Search PubMed and process articles through the Evidence pipeline."
    >
      <PubMedWorkspace />
    </AppPage>
  );
}
