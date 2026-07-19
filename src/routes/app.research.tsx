import { createFileRoute } from "@tanstack/react-router";
import { AppPage } from "@/components/app/app-page";
import { ResearchWorkspace, useResearchWorkspace } from "@/features/research";

export const Route = createFileRoute("/app/research")({
  head: () => ({
    meta: [
      { title: "Research Workspace — WEIP" },
      {
        name: "description",
        content:
          "Organize scientific investigations, questions, hypotheses and evidence collections.",
      },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: ResearchPage,
});

function ResearchPage() {
  const state = useResearchWorkspace();
  return (
    <AppPage
      breadcrumbs={[{ label: "Workspace", to: "/app/dashboard" }, { label: "Research" }]}
      eyebrow="Research"
      title="Research Workspace"
      subtitle="Your operating system for scientific investigations."
    >
      <ResearchWorkspace state={state} />
    </AppPage>
  );
}
