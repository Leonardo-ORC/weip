import { createFileRoute } from "@tanstack/react-router";
import { PlaceholderPage } from "@/components/layout/placeholder-page";

export const Route = createFileRoute("/evidence")({
  head: () => ({
    meta: [
      { title: "Evidence — WEIP" },
      { name: "description", content: "The structured evidence graph powering WEIP." },
      { property: "og:title", content: "Evidence — WEIP" },
      { property: "og:description", content: "The structured evidence graph powering WEIP." },
    ],
  }),
  component: EvidencePage,
});

function EvidencePage() {
  return (
    <PlaceholderPage
      eyebrow="Evidence"
      title="A living knowledge graph of clinical evidence."
      description="Endpoints, cohorts, outcomes and populations as first-class, queryable, versioned objects."
      body={{
        title: "The evidence explorer will surface here.",
        description: "A queryable interface over structured evidence, wired to the underlying graph.",
      }}
    />
  );
}
