import { FlaskConical } from "lucide-react";
import type { ExtractedField, StudyAttributes } from "../types";
import { PanelShell } from "./PanelShell";

function display(f: ExtractedField<string | null>): string {
  if (f.method === "not-extracted" || !f.value) return "—";
  return f.value;
}

function displayNumber(f: ExtractedField<number | null>): string {
  if (f.method === "not-extracted" || f.value == null) return "—";
  return `n=${f.value.toLocaleString()}`;
}

function displayList(f: ExtractedField<readonly string[]>): string {
  if (f.method === "not-extracted" || f.value.length === 0) return "—";
  return f.value.join(" · ");
}

export function StudyPanel({ study }: { study: StudyAttributes }) {
  const rows: readonly [string, string][] = [
    ["Population", display(study.population)],
    ["Sample size", displayNumber(study.sampleSize)],
    ["Intervention", display(study.intervention)],
    ["Comparator", display(study.comparator)],
    ["Primary outcome", display(study.primaryOutcome)],
    ["Secondary outcomes", displayList(study.secondaryOutcomes)],
    ["Adverse events", displayList(study.adverseEvents)],
    ["Eligibility", display(study.eligibility)],
    ["Phase", display(study.studyPhase)],
    ["Design", display(study.studyDesign)],
    ["Follow-up", display(study.followUp)],
    ["Evidence level", display(study.evidenceLevel)],
    ["Countries", displayList(study.countries)],
    ["Institution", display(study.institution)],
    ["Funding", display(study.funding)],
  ];
  return (
    <PanelShell icon={FlaskConical} title="Study" eyebrow="Attributes">
      <dl className="grid gap-2 sm:grid-cols-2">
        {rows.map(([k, v]) => (
          <div key={k} className="min-w-0">
            <dt className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
              {k}
            </dt>
            <dd className="truncate text-xs text-foreground" title={v}>
              {v}
            </dd>
          </div>
        ))}
      </dl>
    </PanelShell>
  );
}
