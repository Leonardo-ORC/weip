import { createFileRoute } from "@tanstack/react-router";
import { PlaceholderPage } from "@/components/layout/placeholder-page";

export const Route = createFileRoute("/applications")({
  head: () => ({
    meta: [
      { title: "Applications — WEIP" },
      { name: "description", content: "Applications built on the WEIP intelligence layer." },
      { property: "og:title", content: "Applications — WEIP" },
      { property: "og:description", content: "Applications built on the WEIP intelligence layer." },
    ],
  }),
  component: ApplicationsPage,
});

function ApplicationsPage() {
  return (
    <PlaceholderPage
      eyebrow="Applications"
      title="Modules for researchers, physicians, and institutions."
      description="Purpose-built surfaces that translate structured evidence into decisions."
      body={{
        title: "Application modules coming online in future phases.",
        items: [
          { title: "Hormone Intelligence", description: "Endocrine evidence, unified." },
          { title: "Drug Intelligence", description: "Compound-level evidence graph." },
          { title: "Research Copilot", description: "An expert companion for scientific reasoning." },
        ],
      }}
    />
  );
}
