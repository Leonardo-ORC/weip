import { Radio, Cpu, Database, GitBranch, Sparkles, Gauge } from "lucide-react";
import {
  DEMO_DRUG_SCORE,
  DEMO_EVIDENCE_STATS,
  DEMO_GRAPH_STATS,
  DEMO_INSIGHTS,
  DEMO_PROJECT,
  DEMO_SOURCES,
} from "../dataset";

export function ProjectSummaryPanel() {
  return (
    <div className="flex flex-col gap-6">
      <header className="rounded-2xl border border-hairline bg-background/60 p-6 lg:p-8">
        <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
          Scientific project
        </div>
        <h1 className="font-display mt-2 text-3xl text-foreground md:text-4xl">
          {DEMO_PROJECT.title}
        </h1>
        <p className="mt-3 max-w-2xl text-sm text-muted-foreground">
          {DEMO_PROJECT.question}
        </p>
      </header>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card icon={<Radio className="h-4 w-4" />} eyebrow="Sources" title="12 studies">
          {DEMO_SOURCES.map((s) => (
            <Row key={s.provider} label={s.provider} value={`${s.count} · ${s.label}`} />
          ))}
        </Card>

        <Card icon={<Cpu className="h-4 w-4" />} eyebrow="Extraction" title="Deterministic + AI">
          <Row label="Extractors" value="Biomedical, Study, Women's health" />
          <Row label="Enrichment" value="OpenAI (traceable)" />
        </Card>

        <Card
          icon={<Database className="h-4 w-4" />}
          eyebrow="Evidence"
          title={`${DEMO_EVIDENCE_STATS.objects} Evidence Objects`}
        >
          <Row label="Populations" value={String(DEMO_EVIDENCE_STATS.populations)} />
          <Row label="Interventions" value={String(DEMO_EVIDENCE_STATS.interventions)} />
          <Row label="Outcomes" value={String(DEMO_EVIDENCE_STATS.outcomes)} />
        </Card>

        <Card
          icon={<GitBranch className="h-4 w-4" />}
          eyebrow="Knowledge Graph"
          title={`${DEMO_GRAPH_STATS.nodes} nodes · ${DEMO_GRAPH_STATS.edges} edges`}
        >
          <Row label="Clusters" value={String(DEMO_GRAPH_STATS.clusters)} />
          <Row label="Provenance" value="Fully traceable" />
        </Card>

        <Card
          icon={<Sparkles className="h-4 w-4" />}
          eyebrow="Research Intelligence"
          title={`${DEMO_INSIGHTS.length} insights`}
        >
          {DEMO_INSIGHTS.map((i) => (
            <Row key={i.label} label={i.kind} value={i.label} />
          ))}
        </Card>

        <Card
          icon={<Gauge className="h-4 w-4" />}
          eyebrow="Drug Score"
          title={`${DEMO_DRUG_SCORE.overall}/100 · ${DEMO_DRUG_SCORE.grade}`}
        >
          {DEMO_DRUG_SCORE.breakdown.map((b) => (
            <Row key={b.label} label={b.label} value={String(b.value)} />
          ))}
        </Card>
      </div>
    </div>
  );
}

function Card({
  icon,
  eyebrow,
  title,
  children,
}: {
  icon: React.ReactNode;
  eyebrow: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <article className="rounded-2xl border border-hairline bg-background/60 p-5">
      <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
        <span className="text-primary">{icon}</span>
        {eyebrow}
      </div>
      <h3 className="font-display mt-2 text-base text-foreground">{title}</h3>
      <dl className="mt-3 space-y-1.5 border-t border-hairline pt-3">{children}</dl>
    </article>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-3 text-xs">
      <dt className="font-mono uppercase tracking-[0.18em] text-muted-foreground">
        {label}
      </dt>
      <dd className="truncate text-right text-foreground">{value}</dd>
    </div>
  );
}
