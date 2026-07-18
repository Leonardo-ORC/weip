import { createFileRoute } from "@tanstack/react-router";
import { PlaceholderPage } from "@/components/layout/placeholder-page";

export const Route = createFileRoute("/platform")({
  head: () => ({
    meta: [
      { title: "Platform — WEIP" },
      {
        name: "description",
        content:
          "The WEIP platform architecture — ingestion, processing, evidence intelligence, and applications.",
      },
      { property: "og:title", content: "Platform — WEIP" },
      {
        property: "og:description",
        content: "The WEIP platform architecture for structured clinical evidence.",
      },
    ],
  }),
  component: PlatformPage,
});

function PlatformPage() {
  return (
    <PlaceholderPage
      eyebrow="Platform"
      title="An operating system for clinical evidence."
      description="Layered architecture that turns fragmented publications into structured, explainable intelligence."
      body={{
        title: "Platform architecture arriving in the next phase.",
        description:
          "Ingestion, normalization, evidence graph, reasoning, and application layers will materialize here as each module ships.",
        items: [
          { title: "Ingestion", description: "Continuous evidence intake pipeline." },
          { title: "Normalization", description: "Structured evidence objects." },
          { title: "Graph", description: "Connected, versioned knowledge." },
          { title: "Reasoning", description: "Explainable inference." },
          { title: "Applications", description: "Modules for researchers." },
          { title: "APIs", description: "Programmatic access." },
        ],
      }}
    />
  );
}
