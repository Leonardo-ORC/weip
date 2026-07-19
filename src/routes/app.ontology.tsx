import { createFileRoute } from "@tanstack/react-router";
import { AppPage } from "@/components/app/app-page";
import { OntologyWorkspace } from "@/features/ontology";

export const Route = createFileRoute("/app/ontology")({
  head: () => ({
    meta: [
      { title: "Ontology — WEIP" },
      {
        name: "description",
        content:
          "Controlled vocabularies, taxonomies and semantic definitions for Women's Hormonal Health.",
      },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: OntologyPage,
});

function OntologyPage() {
  return (
    <AppPage
      breadcrumbs={[{ label: "Workspace", to: "/app/dashboard" }, { label: "Ontology" }]}
      eyebrow="Ontology"
      title="Controlled vocabularies"
      subtitle="Manage taxonomies, concepts and semantic definitions used across the platform."
    >
      <OntologyWorkspace />
    </AppPage>
  );
}
