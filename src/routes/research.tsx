import { createFileRoute } from "@tanstack/react-router";
import { PlaceholderPage } from "@/components/layout/placeholder-page";

export const Route = createFileRoute("/research")({
  head: () => ({
    meta: [
      { title: "Research — WEIP" },
      { name: "description", content: "Methodology, open science, and research programs at WEIP." },
      { property: "og:title", content: "Research — WEIP" },
      { property: "og:description", content: "Methodology and open science at WEIP." },
    ],
  }),
  component: ResearchPage,
});

function ResearchPage() {
  return (
    <PlaceholderPage
      eyebrow="Research"
      title="Methodology worthy of the questions being asked."
      description="Peer-reviewed rigor, transparent provenance, and open collaboration with the scientific community."
      body={{
        title: "Research programs arriving soon.",
        description: "Public methodology, evidence quality frameworks, and partnership programs.",
      }}
    />
  );
}
