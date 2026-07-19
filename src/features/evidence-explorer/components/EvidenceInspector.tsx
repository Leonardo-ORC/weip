import { Link } from "@tanstack/react-router";
import {
  AlertTriangle,
  BookMarked,
  Bookmark,
  Download,
  FileText,
  FlaskConical,
  GitCompareArrows,
  Network,
  Share2,
  Users,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  BiomedicalEntitiesPanel,
  EvidenceConfidenceBadge,
  EvidenceExtractionStatus,
  EvidenceMetadataPanel,
  EvidenceTraceabilityPanel,
  StudyPanel,
  ValidationPanel,
  WomensHealthPanel,
} from "@/features/extraction";
import { RelatedConceptsPanel } from "@/features/graph";
import type { EvidenceObject } from "../types";
import {
  ConfidenceIndicator,
  EVIDENCE_TYPE_LABEL,
  EvidenceBadge,
  EvidenceStatusBadge,
  EvidenceTag,
  HORMONAL_LABEL,
  QualityBadge,
} from "./EvidenceBadge";

interface Props {
  evidence?: EvidenceObject;
  bookmarked: boolean;
  comparing: boolean;
  onBookmark: (id: string) => void;
  onCompare: (id: string) => void;
}

export function EvidenceInspector({ evidence, bookmarked, comparing, onBookmark, onCompare }: Props) {
  if (!evidence) {
    return (
      <div className="p-6 text-sm text-muted-foreground">
        Select an evidence object to inspect its structured contents.
      </div>
    );
  }
  return (
    <div className="flex flex-col gap-6 p-5">
      <div>
        <div className="flex flex-wrap items-center gap-2">
          <EvidenceBadge tone="primary">{EVIDENCE_TYPE_LABEL[evidence.type]}</EvidenceBadge>
          <EvidenceBadge tone="outline">{evidence.studyDesign}</EvidenceBadge>
          <EvidenceStatusBadge status={evidence.status} />
        </div>
        <h2 className="font-display mt-3 text-xl leading-tight tracking-tight">{evidence.title}</h2>
        <p className="mt-2 text-sm text-muted-foreground">{evidence.summary}</p>
        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <QualityBadge quality={evidence.quality} />
            <ConfidenceIndicator level={evidence.confidence} />
          </div>
          <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
            {evidence.publication.journal} · {evidence.publication.year}
          </span>
        </div>
        {evidence.extraction ? (
          <div className="mt-4 flex flex-col gap-2">
            <EvidenceConfidenceBadge confidence={evidence.extraction.confidence} />
            <EvidenceExtractionStatus
              metadata={evidence.extraction.metadata}
              validation={evidence.extraction.validation}
            />
          </div>
        ) : null}
      </div>

      <ActionBar
        evidenceId={evidence.id}
        bookmarked={bookmarked}
        comparing={comparing}
        onBookmark={onBookmark}
        onCompare={onCompare}
      />

      <RelatedConceptsPanel evidenceId={evidence.id} />

      {evidence.extraction ? (
        <>
          <BiomedicalEntitiesPanel entities={evidence.extraction.entities} />
          <WomensHealthPanel concepts={evidence.extraction.womensHealth} />
          <StudyPanel study={evidence.extraction.study} />
          <ValidationPanel validation={evidence.extraction.validation} />
          <EvidenceTraceabilityPanel trace={evidence.extraction.traceability} />
          <EvidenceMetadataPanel metadata={evidence.extraction.metadata} />
        </>
      ) : null}

      <Section icon={FileText} title="Overview" eyebrow="Summary">
        <KVList
          items={[
            ["Type", EVIDENCE_TYPE_LABEL[evidence.type]],
            ["Design", evidence.studyDesign],
            ["Drug", evidence.drug ?? "—"],
            ["Condition", evidence.condition],
            ["Hormonal context", HORMONAL_LABEL[evidence.hormonalContext]],
            [
              "Authors",
              evidence.publication.authors.join(", "),
            ],
            ["DOI", evidence.publication.doi ?? "—"],
            ["Citations", evidence.publication.citations?.toString() ?? "—"],
          ]}
        />
      </Section>

      <Section icon={Users} title="Population" eyebrow="Cohort">
        <p className="text-sm text-foreground">{evidence.population.description}</p>
        <KVList
          items={[
            ["Sample size", evidence.population.sampleSize > 0 ? `n=${evidence.population.sampleSize.toLocaleString()}` : "—"],
            ["Age range", evidence.population.ageRange ?? "—"],
            ["Hormonal status", HORMONAL_LABEL[evidence.population.hormonalStatus]],
            ["Countries", evidence.population.countries.join(", ")],
          ]}
        />
        {evidence.population.inclusion?.length ? (
          <SubList label="Inclusion" items={evidence.population.inclusion} />
        ) : null}
        {evidence.population.exclusion?.length ? (
          <SubList label="Exclusion" items={evidence.population.exclusion} />
        ) : null}
      </Section>

      <Section icon={FlaskConical} title="Intervention" eyebrow="PICO">
        <p className="text-sm text-foreground">{evidence.intervention.description}</p>
        <KVList
          items={[
            ["Drug", evidence.intervention.drug ?? "—"],
            ["Dosage", evidence.intervention.dosage ?? "—"],
            ["Route", evidence.intervention.route ?? "—"],
            ["Duration", evidence.intervention.duration ?? "—"],
          ]}
        />
      </Section>

      {evidence.comparator ? (
        <Section icon={GitCompareArrows} title="Comparison" eyebrow="Comparator">
          <p className="text-sm text-foreground">{evidence.comparator.description}</p>
          {evidence.comparator.drug ? (
            <KVList items={[["Drug", evidence.comparator.drug]]} />
          ) : null}
        </Section>
      ) : null}

      <Section icon={FileText} title="Outcomes" eyebrow="Endpoints">
        <ul className="grid gap-2">
          {evidence.outcomes.map((o) => (
            <li key={o.name} className="rounded-lg border border-hairline bg-background/40 p-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-foreground">{o.name}</span>
                <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                  {o.measure}
                </span>
              </div>
              <div className="mt-1 text-sm text-muted-foreground">
                {o.result}
                {o.significance ? <span className="ml-2 text-xs text-teal">{o.significance}</span> : null}
              </div>
            </li>
          ))}
        </ul>
      </Section>

      <Section icon={AlertTriangle} title="Adverse events" eyebrow="Safety">
        {evidence.adverseEvents.length === 0 ? (
          <p className="text-sm text-muted-foreground">No adverse events reported.</p>
        ) : (
          <ul className="grid gap-2">
            {evidence.adverseEvents.map((a) => (
              <li key={a.name} className="flex items-center justify-between rounded-lg border border-hairline bg-background/40 p-3">
                <span className="text-sm text-foreground">{a.name}</span>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                    {a.frequency}
                  </span>
                  <SeverityDot severity={a.severity} />
                </div>
              </li>
            ))}
          </ul>
        )}
      </Section>

      <Section icon={FlaskConical} title="Hormonal information" eyebrow="Endocrine">
        <KVList items={[["Hormonal context", HORMONAL_LABEL[evidence.hormonalContext]]]} />
      </Section>

      <Section icon={Users} title="Pregnancy" eyebrow="Perinatal">
        <p className="text-sm text-muted-foreground">
          {evidence.hormonalContext === "pregnancy"
            ? "This evidence is stratified for pregnancy."
            : "Not primarily focused on pregnancy."}
        </p>
      </Section>

      <Section icon={FlaskConical} title="Menopause" eyebrow="Reproductive stage">
        <p className="text-sm text-muted-foreground">
          {["menopause", "perimenopause", "post-menopause"].includes(evidence.hormonalContext)
            ? "This evidence covers a menopausal population."
            : "Not primarily focused on menopause."}
        </p>
      </Section>

      <Section icon={FileText} title="Study design" eyebrow="Methodology">
        <KVList
          items={[
            ["Design", evidence.studyDesign],
            ["Confidence", evidence.confidence],
            ["Quality grade", evidence.quality],
          ]}
        />
      </Section>

      <Section icon={AlertTriangle} title="Limitations" eyebrow="Caveats">
        {evidence.limitations.length === 0 ? (
          <p className="text-sm text-muted-foreground">No limitations captured.</p>
        ) : (
          <ul className="grid gap-1.5">
            {evidence.limitations.map((l) => (
              <li key={l} className="text-sm text-muted-foreground">
                — {l}
              </li>
            ))}
          </ul>
        )}
      </Section>

      <Section icon={Network} title="Related concepts" eyebrow="Ontology">
        {evidence.ontologyLinks.length === 0 ? (
          <p className="text-sm text-muted-foreground">No ontology links established yet.</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {evidence.ontologyLinks.map((l) => (
              <Link
                key={l.conceptId}
                to="/app/ontology"
                className="inline-flex items-center gap-1.5 rounded-full border border-hairline bg-background/60 px-2.5 py-1 text-xs text-foreground transition hover:border-primary hover:text-primary"
              >
                <Network className="h-3 w-3" />
                <span>{l.label}</span>
                <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                  {l.kind}
                </span>
              </Link>
            ))}
          </div>
        )}
      </Section>

      {evidence.tags.length > 0 ? (
        <div className="flex flex-wrap gap-1.5">
          {evidence.tags.map((t) => (
            <EvidenceTag key={t}>{t}</EvidenceTag>
          ))}
        </div>
      ) : null}
    </div>
  );
}

function Section({
  icon: Icon,
  title,
  eyebrow,
  children,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  eyebrow: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-xl border border-hairline bg-background/40 p-4">
      <header className="mb-3 flex items-center gap-2">
        <Icon className="h-3.5 w-3.5 text-muted-foreground" />
        <div>
          <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
            {eyebrow}
          </div>
          <div className="font-display text-sm tracking-tight">{title}</div>
        </div>
      </header>
      <div className="space-y-3">{children}</div>
    </section>
  );
}

function KVList({ items }: { items: Array<[string, string]> }) {
  return (
    <dl className="grid gap-2 sm:grid-cols-2">
      {items.map(([k, v]) => (
        <div key={k} className="min-w-0">
          <dt className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">{k}</dt>
          <dd className="truncate text-xs text-foreground">{v}</dd>
        </div>
      ))}
    </dl>
  );
}

function SubList({ label, items }: { label: string; items: string[] }) {
  return (
    <div>
      <div className="mb-1 font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
        {label}
      </div>
      <ul className="grid gap-1">
        {items.map((i) => (
          <li key={i} className="text-xs text-muted-foreground">— {i}</li>
        ))}
      </ul>
    </div>
  );
}

function SeverityDot({ severity }: { severity: "mild" | "moderate" | "severe" }) {
  const tone = {
    mild: "bg-teal",
    moderate: "bg-accent",
    severe: "bg-destructive",
  }[severity];
  return <span className={cn("h-1.5 w-1.5 rounded-full", tone)} title={severity} />;
}

function ActionBar({
  evidenceId,
  bookmarked,
  comparing,
  onBookmark,
  onCompare,
}: {
  evidenceId: string;
  bookmarked: boolean;
  comparing: boolean;
  onBookmark: (id: string) => void;
  onCompare: (id: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-1.5">
      <ActionButton onClick={() => onBookmark(evidenceId)} active={bookmarked}>
        <Bookmark className={cn("h-3.5 w-3.5", bookmarked && "fill-current")} />
        {bookmarked ? "Bookmarked" : "Bookmark"}
      </ActionButton>
      <ActionButton onClick={() => onCompare(evidenceId)} active={comparing}>
        <GitCompareArrows className="h-3.5 w-3.5" /> {comparing ? "In compare" : "Compare"}
      </ActionButton>
      <ActionButton onClick={() => {}}>
        <BookMarked className="h-3.5 w-3.5" /> Save
      </ActionButton>
      <ActionButton onClick={() => {}}>
        <Share2 className="h-3.5 w-3.5" /> Share
      </ActionButton>
      <ActionButton onClick={() => {}}>
        <Download className="h-3.5 w-3.5" /> Export
      </ActionButton>
    </div>
  );
}

function ActionButton({
  children,
  onClick,
  active,
}: {
  children: React.ReactNode;
  onClick: () => void;
  active?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] transition",
        active
          ? "border-primary bg-primary/10 text-primary"
          : "border-hairline text-muted-foreground hover:text-foreground",
      )}
    >
      {children}
    </button>
  );
}
