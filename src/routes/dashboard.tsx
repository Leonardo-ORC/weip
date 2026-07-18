import { createFileRoute } from "@tanstack/react-router";
import { PlaceholderPage } from "@/components/layout/placeholder-page";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard — WEIP" },
      { name: "description", content: "Your WEIP workspace." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: DashboardPage,
});

function DashboardPage() {
  return (
    <PlaceholderPage
      eyebrow="Dashboard"
      title="Your evidence workspace."
      description="A personalized surface over the WEIP intelligence layer."
      body={{
        title: "Workspace launching alongside authenticated access.",
        description: "Saved queries, cohorts, notebooks, and shared collections.",
      }}
    />
  );
}
