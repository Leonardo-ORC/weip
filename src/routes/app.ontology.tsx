import { createFileRoute } from "@tanstack/react-router";
import { OntologyWorkspace } from "@/features/ontology";

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
  component: OntologyWorkspace,
});
