import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Database,
  FlaskConical,
  Network,
  Workflow,
  Plus,
  Sparkles,
  ArrowUpRight,
  CircleDot,
  CheckCircle2,
  Clock,
  Cpu,
  Layers,
} from "lucide-react";
import { AppPage } from "@/components/app/app-page";
import {
  ActivityCard,
  QuickActionCard,
  StatusCard,
  WorkspaceCard,
  WorkspaceGrid,
} from "@/components/app/cards";

export const Route = createFileRoute("/app/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard — WEIP" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: DashboardPage,
});

function SectionHeading({ title, subtitle, action }: { title: string; subtitle?: string; action?: React.ReactNode }) {
  return (
    <div className="mb-5 flex items-end justify-between gap-4">
      <div>
        <h2 className="font-display text-xl text-foreground">{title}</h2>
        {subtitle ? <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p> : null}
      </div>
      {action}
    </div>
  );
}

function DashboardPage() {
  return (
    <AppPage
      eyebrow="Overview"
      title="Welcome back, Ava."
      subtitle="Your evidence workspace. Placeholder metrics until live data flows in."
      breadcrumbs={[{ label: "Workspace", to: "/app/dashboard" }, { label: "Dashboard" }]}
      primaryAction={
        <Link
          to="/app/projects"
          className="inline-flex items-center gap-1.5 rounded-full bg-ink px-4 py-2 text-sm font-medium text-background shadow-soft transition hover:opacity-90"
        >
          <Plus className="h-4 w-4" /> New project
        </Link>
      }
      secondaryActions={
        <Link
          to="/app/evidence"
          className="inline-flex items-center gap-1.5 rounded-full border border-hairline px-4 py-2 text-sm text-foreground transition hover:bg-secondary"
        >
          Browse evidence
        </Link>
      }
    >
      <div className="space-y-14">
        {/* Quick actions */}
        <section>
          <SectionHeading title="Quick actions" subtitle="Jump into the most-used surfaces." />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            <QuickActionCard icon={Database} title="Browse Evidence" description="Explore the scientific source catalog." to="/app/evidence" hint="8 providers" />
            <QuickActionCard icon={FlaskConical} title="Open Research" description="Investigate hypotheses and cohorts." to="/app/research" hint="Preview" />
            <QuickActionCard icon={Network} title="Explore Ontology" description="Structured clinical concepts." to="/app/ontology" hint="Soon" />
            <QuickActionCard icon={Workflow} title="View Pipelines" description="Ingestion & processing stages." to="/app/pipeline" hint="8 stages" />
            <QuickActionCard icon={Sparkles} title="Create Project" description="Start a new research program." to="/app/projects" />
          </div>
        </section>

        {/* Activity + Status */}
        <section className="grid gap-6 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">
          <div className="rounded-2xl border border-hairline bg-background/60 p-6">
            <SectionHeading
              title="Recent activity"
              subtitle="Foundational milestones across the platform."
              action={
                <button className="text-xs font-medium text-muted-foreground transition hover:text-foreground">
                  View all
                </button>
              }
            />
            <ActivityCard
              items={[
                { title: "Evidence source added", description: "Europe PMC registered in the catalog.", time: "2m", icon: Database, tone: "primary" },
                { title: "Pipeline framework prepared", description: "8 processing stages armed for orchestration.", time: "1h", icon: Workflow },
                { title: "Extraction engine ready", description: "5 model providers, 9 prompt domains available.", time: "3h", icon: Cpu, tone: "accent" },
                { title: "Future ontology reserved", description: "Concept graph slot allocated for next sprint.", time: "Yesterday", icon: Network },
                { title: "Workspace initialized", description: "Application shell provisioned.", time: "2d", icon: CircleDot },
              ]}
            />
          </div>

          <div className="rounded-2xl border border-hairline bg-background/60 p-6">
            <SectionHeading title="System status" subtitle="Illustrative — no live checks." />
            <div className="grid gap-3">
              <StatusCard title="Scientific Sources" description="8 providers registered under a common contract." status="operational" meta="Last checked · just now" />
              <StatusCard title="Processing Framework" description="Stage engine armed. Awaiting execution logic." status="planned" meta="Runtime · pending" />
              <StatusCard title="Extraction Engine" description="Model, prompt, validator, parser contracts ready." status="planned" meta="Runtime · pending" />
              <StatusCard title="Ontology" description="Concept graph slot reserved for next sprint." status="future" />
              <StatusCard title="Knowledge Graph" description="Downstream intelligence layer." status="future" />
              <StatusCard title="Clinical Intelligence" description="Explainable insights and gaps." status="future" />
            </div>
          </div>
        </section>

        {/* Pinned Projects */}
        <section>
          <SectionHeading
            title="Pinned projects"
            subtitle="Illustrative research programs."
            action={
              <Link to="/app/projects" className="inline-flex items-center gap-1 text-xs font-medium text-foreground transition hover:opacity-80">
                Open projects <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
            }
          />
          <WorkspaceGrid>
            <WorkspaceCard
              tag="Cohort"
              title="Perimenopause hormonal signals"
              description="Structured evidence around FSH, estradiol and cycle irregularity across international cohorts."
              progress={62}
              meta="12 collaborators · Updated 3h ago"
              href="/app/projects"
            />
            <WorkspaceCard
              tag="Trials"
              title="Endometriosis clinical landscape"
              description="Live map of interventional trials, endpoints and eligibility across phases."
              progress={38}
              meta="6 collaborators · Updated 1d ago"
              href="/app/projects"
            />
            <WorkspaceCard
              tag="Safety"
              title="MHT drug safety index"
              description="Menopausal hormone therapy — adverse event evidence across regulatory sources."
              progress={81}
              meta="4 collaborators · Updated yesterday"
              href="/app/projects"
            />
          </WorkspaceGrid>
        </section>

        {/* Platform Overview + Future */}
        <section className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-2xl border border-hairline bg-background/60 p-6">
            <SectionHeading title="Platform overview" subtitle="Where WEIP stands today." />
            <ul className="space-y-3">
              {[
                { icon: CheckCircle2, label: "Scientific source catalog", value: "8 providers" },
                { icon: CheckCircle2, label: "Processing framework", value: "8 stages" },
                { icon: CheckCircle2, label: "Extraction engine", value: "5 models · 9 domains" },
                { icon: Clock, label: "Ontology layer", value: "Reserved" },
                { icon: Clock, label: "Knowledge graph", value: "Reserved" },
              ].map((row) => (
                <li key={row.label} className="flex items-center justify-between rounded-xl border border-hairline bg-background/40 px-4 py-3">
                  <div className="flex items-center gap-3">
                    <row.icon className="h-4 w-4 text-primary" />
                    <span className="text-sm text-foreground">{row.label}</span>
                  </div>
                  <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">{row.value}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl border border-hairline bg-background/60 p-6">
            <SectionHeading title="Future modules" subtitle="What ships next." />
            <ul className="grid gap-3 sm:grid-cols-2">
              {[
                { icon: Network, label: "Clinical Ontology", desc: "Hormones, cycles, conditions." },
                { icon: Layers, label: "Knowledge Graph", desc: "Concept-level evidence links." },
                { icon: Sparkles, label: "Intelligence", desc: "Explainable insights & gaps." },
                { icon: Cpu, label: "Research copilots", desc: "Domain-specific assistants." },
              ].map((row) => (
                <li key={row.label} className="rounded-xl border border-hairline bg-background/40 p-4">
                  <div className="flex items-center gap-2">
                    <row.icon className="h-4 w-4 text-primary" />
                    <span className="text-sm font-medium text-foreground">{row.label}</span>
                  </div>
                  <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{row.desc}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </div>
    </AppPage>
  );
}
