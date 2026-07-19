import { Link } from "@tanstack/react-router";
import { ArrowRight, Database } from "lucide-react";
import { DashboardWidget } from "@/features/dashboard";
import { EvidenceService } from "../services";
import { EVIDENCE_TYPE_LABEL, EvidenceStatusBadge } from "./EvidenceBadge";

export function EvidenceReadyWidget() {
  const all = EvidenceService.list();
  const overview = EvidenceService.overview();
  const recent = all.slice(0, 4);
  const typeCounts = new Map<string, number>();
  for (const e of all) typeCounts.set(e.studyDesign, (typeCounts.get(e.studyDesign) ?? 0) + 1);

  return (
    <DashboardWidget
      eyebrow="Evidence"
      title="Evidence Ready"
      subtitle="Structured evidence objects are live and explorable."
      action={
        <Link
          to="/app/evidence"
          className="inline-flex items-center gap-1 rounded-full border border-hairline px-3 py-1 text-xs text-foreground transition hover:bg-secondary"
        >
          Open workspace <ArrowRight className="h-3 w-3" />
        </Link>
      }
    >
      <div className="grid gap-5 lg:grid-cols-3">
        <div className="grid grid-cols-3 gap-3 lg:col-span-3">
          <Stat label="Evidence objects" value={overview.total} />
          <Stat label="Clinical trials" value={overview.clinicalTrials} />
          <Stat label="Study types" value={overview.studyTypes} />
        </div>

        <div className="lg:col-span-2">
          <div className="mb-2 font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
            Recent evidence
          </div>
          <ul className="grid gap-2">
            {recent.map((e) => (
              <li
                key={e.id}
                className="flex items-center gap-3 rounded-lg border border-hairline bg-background/40 p-2.5"
              >
                <div className="grid h-7 w-7 place-items-center rounded-md bg-secondary text-foreground/80">
                  <Database className="h-3.5 w-3.5" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-xs font-medium text-foreground">{e.title}</div>
                  <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                    {EVIDENCE_TYPE_LABEL[e.type]} · {e.publication.year}
                  </div>
                </div>
                <EvidenceStatusBadge status={e.status} />
              </li>
            ))}
          </ul>
        </div>

        <div>
          <div className="mb-2 font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
            By study design
          </div>
          <ul className="grid gap-1.5">
            {[...typeCounts.entries()].slice(0, 6).map(([design, count]) => (
              <li
                key={design}
                className="flex items-center justify-between rounded-md px-2 py-1.5 text-xs text-foreground hover:bg-secondary/60"
              >
                <span className="truncate">{design}</span>
                <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                  {count}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </DashboardWidget>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl border border-hairline bg-background/40 p-3">
      <div className="font-display text-2xl tracking-tight">{value}</div>
      <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
        {label}
      </div>
    </div>
  );
}
