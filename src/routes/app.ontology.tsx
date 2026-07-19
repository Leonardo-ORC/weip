import { createFileRoute } from "@tanstack/react-router";
import { AppPage } from "@/components/app/app-page";
import { OntologyWorkspace } from "@/features/ontology";
import { IntelligencePanel } from "@/features/intelligence";

export const Route = createFileRoute("/app/ontology")({
  head: () => ({
    meta: [
      { title: "Ontology Workspace — WEIP" },
      {
        name: "description",
        content:
          "Explore vocabularies, taxonomies, concepts and semantic relationships across Women's Hormonal Health.",
      },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: OntologyPage,
});

function OntologyPage() {
  return (
    <AppPage
      breadcrumbs={[{ label: "Intelligence", to: "/app/dashboard" }, { label: "Clinical Knowledge" }]}
      eyebrow="Clinical Knowledge"
      title="Clinical Knowledge Workspace"
      subtitle="Trending concepts, semantic hotspots and emerging women's health areas — layered above the ontology explorer."
    >
      <div className="flex flex-col gap-10">
        <IntelligencePanel
          surface="ontology"
          title="Clinical knowledge intelligence"
          subtitle="Trending concepts, high-confidence relationships and emerging women's health areas."
          limit={6}
        />
        <OntologyWorkspace />
      </div>
    </AppPage>
  );
}
