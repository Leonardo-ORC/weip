import { createFileRoute } from "@tanstack/react-router";
import { PlaceholderPage } from "@/components/layout/placeholder-page";

export const Route = createFileRoute("/developers")({
  head: () => ({
    meta: [
      { title: "Developers — WEIP" },
      { name: "description", content: "APIs, SDKs, and integration surfaces for WEIP." },
      { property: "og:title", content: "Developers — WEIP" },
      { property: "og:description", content: "APIs, SDKs, and integration surfaces for WEIP." },
    ],
  }),
  component: DevelopersPage,
});

function DevelopersPage() {
  return (
    <PlaceholderPage
      eyebrow="Developers"
      title="Programmatic access to structured evidence."
      description="A typed API surface and SDKs for integrating WEIP evidence objects into research workflows."
      body={{
        title: "Developer console arriving with the first API.",
        description: "API reference, keys, quotas, and integration guides.",
      }}
    />
  );
}
