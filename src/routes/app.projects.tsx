import { createFileRoute, Link } from "@tanstack/react-router";
import { FolderKanban, Plus } from "lucide-react";
import { AppPage } from "@/components/app/app-page";
import { WorkspaceCard, WorkspaceGrid, EmptyWorkspace } from "@/components/app/cards";

export const Route = createFileRoute("/app/projects")({
  head: () => ({ meta: [{ title: "Projects — WEIP" }, { name: "robots", content: "noindex" }] }),
  component: ProjectsPage,
});

function ProjectsPage() {
  return (
    <AppPage
      eyebrow="Projects"
      title="Research programs"
      subtitle="Combine Evidence, Knowledge and Research into reusable scientific workspaces."
      breadcrumbs={[{ label: "Workspace", to: "/app/dashboard" }, { label: "Projects" }]}
      primaryAction={
        <Link
          to="/app/projects"
          className="inline-flex items-center gap-1.5 rounded-full bg-ink px-4 py-2 text-sm font-medium text-background shadow-soft transition hover:opacity-90"
        >
          <Plus className="h-4 w-4" /> New project
        </Link>
      }
    >
      <div className="space-y-10">
        <WorkspaceGrid>
          <WorkspaceCard tag="Cohort" title="Perimenopause hormonal signals" description="FSH, estradiol and cycle irregularity across international cohorts." progress={62} meta="12 collaborators" />
          <WorkspaceCard tag="Trials" title="Endometriosis clinical landscape" description="Interventional trials, endpoints and eligibility across phases." progress={38} meta="6 collaborators" />
          <WorkspaceCard tag="Safety" title="MHT drug safety index" description="Menopausal hormone therapy adverse event evidence." progress={81} meta="4 collaborators" />
          <WorkspaceCard tag="Discovery" title="PCOS biomarker map" description="Longitudinal biomarker signal review." progress={22} meta="3 collaborators" />
          <WorkspaceCard tag="Regulatory" title="Contraceptive labeling review" description="Structured comparison across regulator submissions." progress={54} meta="5 collaborators" />
        </WorkspaceGrid>

        <EmptyWorkspace
          icon={FolderKanban}
          title="Start a new research program"
          description="Projects group Evidence Objects, Knowledge Graph slices and Research insights around a scientific question."
        />
      </div>
    </AppPage>
  );
}
