import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Briefcase } from "lucide-react";
import { AppPage } from "@/components/app/app-page";
import {
  EvidenceRecommendationList,
  IntelligencePanel,
  ResearchIntelligenceService,
} from "@/features/intelligence";

export const Route = createFileRoute("/app/workspace")({
  head: () => ({ meta: [{ title: "Workspace — WEIP" }, { name: "robots", content: "noindex" }] }),
  component: WorkspacePage,
});

function WorkspacePage() {
  const suggestedProjects = ResearchIntelligenceService.context().projects.slice(0, 4);
  const highConfidence = ResearchIntelligenceService.highConfidenceEvidence().slice(0, 4);
  const trending = ResearchIntelligenceService.trendingConcepts().slice(0, 6);
  const suggestedEvidence = suggestedProjects.length
    ? ResearchIntelligenceService.suggestedEvidenceForProject(suggestedProjects[0].id)
    : [];

  return (
    <AppPage
      eyebrow="Workspace"
      title="Your working surfaces"
      subtitle="Notebooks, saved cohorts and shared collections — augmented by Research Intelligence."
      breadcrumbs={[{ label: "Workspace", to: "/app/dashboard" }, { label: "Overview" }]}
    >
      <div className="flex flex-col gap-8">
        <IntelligencePanel
          surface="workspace"
          title="Suggested next actions"
          subtitle="Prioritised from open questions, project freshness and detected gaps."
          limit={4}
        />

        <section className="grid gap-6 lg:grid-cols-2">
          <SectionCard
            title="Suggested projects"
            eyebrow="Programs"
            action={<QuickLink to="/app/projects">All projects</QuickLink>}
          >
            <ul className="grid gap-2">
              {suggestedProjects.map((p) => (
                <li
                  key={p.id}
                  className="rounded-xl border border-hairline bg-background/60 p-3"
                >
                  <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
                    {p.area} · {p.status}
                  </div>
                  <h4 className="font-display mt-1 text-sm text-foreground">{p.title}</h4>
                  <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{p.description}</p>
                </li>
              ))}
            </ul>
          </SectionCard>

          <SectionCard title="Recommended evidence" eyebrow="Ranked" action={<QuickLink to="/app/evidence">Open workspace</QuickLink>}>
            <EvidenceRecommendationList
              evidence={suggestedEvidence.length ? suggestedEvidence : highConfidence}
              emptyMessage="Add a project to see recommended evidence."
            />
          </SectionCard>

          <SectionCard title="Recommended concepts" eyebrow="Ontology" action={<QuickLink to="/app/ontology">Ontology</QuickLink>}>
            <div className="flex flex-wrap gap-1.5">
              {trending.map((t) => (
                <span
                  key={t.node.id}
                  className="inline-flex items-center gap-1.5 rounded-full border border-hairline bg-background/60 px-2.5 py-1 text-xs text-foreground"
                >
                  {t.node.label}
                  <span className="font-mono text-[10px] text-primary">{Math.round(t.momentum * 100)}%</span>
                </span>
              ))}
              {trending.length === 0 ? (
                <span className="text-xs text-muted-foreground">No trending concepts yet.</span>
              ) : null}
            </div>
          </SectionCard>

          <SectionCard title="Related research areas" eyebrow="Coverage" action={<QuickLink to="/app/research">Research</QuickLink>}>
            <ul className="grid gap-2 text-sm">
              {ResearchIntelligenceService.areaCoverage()
                .filter((a) => a.evidenceCount > 0)
                .slice(0, 5)
                .map((a) => (
                  <li key={a.area} className="flex items-center justify-between rounded-lg border border-hairline bg-background/40 px-3 py-2">
                    <span className="text-foreground">{a.area}</span>
                    <span className="font-mono text-[10px] text-muted-foreground">{a.evidenceCount} evidence · {Math.round(a.coverage * 100)}%</span>
                  </li>
                ))}
            </ul>
          </SectionCard>
        </section>

        <div className="rounded-2xl border border-dashed border-hairline bg-background/40 p-6 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Briefcase className="h-4 w-4" />
            Notebooks, cohorts and shared collections will land here as your workspace grows.
          </div>
        </div>
      </div>
    </AppPage>
  );
}

function SectionCard({
  title,
  eyebrow,
  action,
  children,
}: {
  title: string;
  eyebrow: string;
  action?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-hairline bg-background/60 p-5">
      <header className="mb-3 flex items-end justify-between">
        <div>
          <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">{eyebrow}</div>
          <h3 className="font-display mt-1 text-base text-foreground">{title}</h3>
        </div>
        {action}
      </header>
      {children}
    </section>
  );
}

function QuickLink({ to, children }: { to: string; children: React.ReactNode }) {
  return (
    <Link
      to={to}
      className="inline-flex items-center gap-1 font-mono text-[10px] uppercase tracking-[0.22em] text-primary hover:opacity-80"
    >
      {children} <ArrowRight className="h-3 w-3" />
    </Link>
  );
}
