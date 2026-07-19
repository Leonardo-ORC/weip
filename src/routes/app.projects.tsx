import { createFileRoute, Link } from "@tanstack/react-router";
import { FolderKanban, Plus } from "lucide-react";
import { AppPage } from "@/components/app/app-page";
import { WorkspaceCard, WorkspaceGrid, EmptyWorkspace } from "@/components/app/cards";
import {
  EvidenceRecommendationList,
  IntelligencePanel,
  ProjectRecommendationService,
  ResearchIntelligenceService,
} from "@/features/intelligence";

export const Route = createFileRoute("/app/projects")({
  head: () => ({ meta: [{ title: "Projects — WEIP" }, { name: "robots", content: "noindex" }] }),
  component: ProjectsPage,
});

function ProjectsPage() {
  const ctx = ResearchIntelligenceService.context();
  const featured = ctx.projects[0];
  const suggestedEvidence = featured
    ? ResearchIntelligenceService.suggestedEvidenceForProject(featured.id)
    : [];
  const similar = featured ? ResearchIntelligenceService.similarProjects(featured.id) : [];
  const completeness = featured
    ? ProjectRecommendationService.completeness(featured.id, ctx)
    : 0;

  return (
    <AppPage
      eyebrow="Projects"
      title="Research programs"
      subtitle="Illustrative programs, now augmented with Research Intelligence."
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
        <IntelligencePanel
          surface="projects"
          title="Project intelligence"
          subtitle="Completeness, similar programs and coverage gaps for your research portfolio."
          limit={4}
        />

        {featured ? (
          <section className="rounded-2xl border border-hairline bg-background/60 p-6">
            <header className="mb-5 flex items-end justify-between">
              <div>
                <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
                  Featured project · {Math.round(completeness * 100)}% complete
                </div>
                <h2 className="font-display mt-1 text-lg text-foreground">{featured.title}</h2>
                <p className="mt-1 text-xs text-muted-foreground">{featured.description}</p>
              </div>
            </header>
            <div className="grid gap-6 lg:grid-cols-2">
              <div>
                <div className="mb-2 font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
                  Suggested evidence
                </div>
                <EvidenceRecommendationList evidence={suggestedEvidence} />
              </div>
              <div>
                <div className="mb-2 font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
                  Similar projects
                </div>
                <ul className="grid gap-2">
                  {similar.length === 0 ? (
                    <li className="text-xs text-muted-foreground">No similar projects detected.</li>
                  ) : (
                    similar.map((p) => (
                      <li key={p.id} className="rounded-xl border border-hairline bg-background/40 p-3">
                        <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
                          {p.area} · {p.status}
                        </div>
                        <h4 className="font-display mt-1 text-sm text-foreground">{p.title}</h4>
                      </li>
                    ))
                  )}
                </ul>
              </div>
            </div>
          </section>
        ) : null}

        <WorkspaceGrid>
          <WorkspaceCard tag="Cohort" title="Perimenopause hormonal signals" description="FSH, estradiol and cycle irregularity across international cohorts." progress={62} meta="12 collaborators" />
          <WorkspaceCard tag="Trials" title="Endometriosis clinical landscape" description="Interventional trials, endpoints and eligibility across phases." progress={38} meta="6 collaborators" />
          <WorkspaceCard tag="Safety" title="MHT drug safety index" description="Menopausal hormone therapy adverse event evidence." progress={81} meta="4 collaborators" />
          <WorkspaceCard tag="Discovery" title="PCOS biomarker map" description="Longitudinal biomarker signal review." progress={22} meta="3 collaborators" />
          <WorkspaceCard tag="Regulatory" title="Contraceptive labeling review" description="Structured comparison across regulator submissions." progress={54} meta="5 collaborators" />
        </WorkspaceGrid>

        <EmptyWorkspace icon={FolderKanban} title="Start a new research program" description="Projects group evidence, cohorts, notebooks and collaborators around a hypothesis." />
      </div>
    </AppPage>
  );
}
