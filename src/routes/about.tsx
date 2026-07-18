import { createFileRoute } from "@tanstack/react-router";
import { PlaceholderPage } from "@/components/layout/placeholder-page";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — WEIP" },
      { name: "description", content: "The team and vision behind WEIP." },
      { property: "og:title", content: "About — WEIP" },
      { property: "og:description", content: "The team and vision behind WEIP." },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <PlaceholderPage
      eyebrow="About"
      title="Building the infrastructure for scientific evidence."
      description="An interdisciplinary team of researchers, clinicians, and engineers."
      body={{
        title: "Team, principles and mission coming soon.",
      }}
    />
  );
}
