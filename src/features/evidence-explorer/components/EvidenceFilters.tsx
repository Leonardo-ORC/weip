import { RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";
import type { EvidenceWorkspaceState } from "../hooks/use-evidence-workspace";
import {
  CONFIDENCE_LEVELS,
  EVIDENCE_TYPE_LABEL,
  EVIDENCE_TYPES,
  HORMONAL_CONTEXTS,
  HORMONAL_LABEL,
  QUALITY_LEVELS,
  STUDY_DESIGNS,
} from "./EvidenceBadge";

type Props = Pick<
  EvidenceWorkspaceState,
  | "filters"
  | "facets"
  | "toggleType"
  | "toggleDesign"
  | "toggleContext"
  | "toggleCountry"
  | "toggleJournal"
  | "toggleDrug"
  | "toggleCondition"
  | "toggleConfidence"
  | "toggleQuality"
  | "setYearRange"
  | "setAdverseEvents"
  | "resetFilters"
  | "activeFilterCount"
>;

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-full border px-2.5 py-1 text-[11px] transition",
        active
          ? "border-primary bg-primary text-primary-foreground"
          : "border-hairline text-muted-foreground hover:border-border hover:text-foreground",
      )}
    >
      {children}
    </button>
  );
}

function Group({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="mb-2 font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
        {label}
      </div>
      <div className="flex flex-wrap gap-1.5">{children}</div>
    </div>
  );
}

export function EvidenceFilters(props: Props) {
  const {
    filters,
    facets,
    toggleType,
    toggleDesign,
    toggleContext,
    toggleCountry,
    toggleJournal,
    toggleDrug,
    toggleCondition,
    toggleConfidence,
    toggleQuality,
    setYearRange,
    setAdverseEvents,
    resetFilters,
    activeFilterCount,
  } = props;

  const [yMin, yMax] = facets.yearRange;
  const currentYears = filters.years ?? facets.yearRange;

  return (
    <div className="rounded-2xl border border-hairline bg-background/60 p-5">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
            Advanced filters
          </div>
          <div className="font-display mt-0.5 text-base tracking-tight">
            {activeFilterCount > 0 ? `${activeFilterCount} active` : "No filters applied"}
          </div>
        </div>
        {activeFilterCount > 0 ? (
          <button
            type="button"
            onClick={resetFilters}
            className="inline-flex items-center gap-1 rounded-full border border-hairline px-2.5 py-1 text-[11px] text-muted-foreground hover:text-foreground"
          >
            <RotateCcw className="h-3 w-3" /> Reset
          </button>
        ) : null}
      </div>

      <div className="grid gap-5">
        <Group label="Evidence type">
          {EVIDENCE_TYPES.map((t) => (
            <Chip key={t} active={filters.types.includes(t)} onClick={() => toggleType(t)}>
              {EVIDENCE_TYPE_LABEL[t]}
            </Chip>
          ))}
        </Group>

        <Group label="Study design">
          {STUDY_DESIGNS.map((d) => (
            <Chip key={d} active={filters.designs.includes(d)} onClick={() => toggleDesign(d)}>
              {d}
            </Chip>
          ))}
        </Group>

        <Group label="Hormonal status">
          {HORMONAL_CONTEXTS.map((c) => (
            <Chip key={c} active={filters.hormonalContexts.includes(c)} onClick={() => toggleContext(c)}>
              {HORMONAL_LABEL[c]}
            </Chip>
          ))}
        </Group>

        <div>
          <div className="mb-2 font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
            Publication year · {currentYears[0]} – {currentYears[1]}
          </div>
          <div className="flex items-center gap-2">
            <input
              type="range"
              min={yMin}
              max={yMax}
              value={currentYears[0]}
              onChange={(e) => setYearRange([Number(e.target.value), currentYears[1]])}
              className="w-full accent-primary"
            />
            <input
              type="range"
              min={yMin}
              max={yMax}
              value={currentYears[1]}
              onChange={(e) => setYearRange([currentYears[0], Number(e.target.value)])}
              className="w-full accent-primary"
            />
          </div>
        </div>

        <Group label="Confidence">
          {CONFIDENCE_LEVELS.map((c) => (
            <Chip key={c} active={filters.confidences.includes(c)} onClick={() => toggleConfidence(c)}>
              {c.replace("-", " ")}
            </Chip>
          ))}
        </Group>

        <Group label="Evidence quality">
          {QUALITY_LEVELS.map((q) => (
            <Chip key={q} active={filters.qualities.includes(q)} onClick={() => toggleQuality(q)}>
              Grade {q}
            </Chip>
          ))}
        </Group>

        <Group label="Adverse events">
          <Chip active={filters.hasAdverseEvents === true} onClick={() => setAdverseEvents(filters.hasAdverseEvents === true ? null : true)}>
            Reported
          </Chip>
          <Chip active={filters.hasAdverseEvents === false} onClick={() => setAdverseEvents(filters.hasAdverseEvents === false ? null : false)}>
            None
          </Chip>
        </Group>

        <Group label="Drug">
          {facets.drugs.map((d) => (
            <Chip key={d} active={filters.drugs.includes(d)} onClick={() => toggleDrug(d)}>
              {d}
            </Chip>
          ))}
        </Group>

        <Group label="Condition">
          {facets.conditions.map((c) => (
            <Chip key={c} active={filters.conditions.includes(c)} onClick={() => toggleCondition(c)}>
              {c}
            </Chip>
          ))}
        </Group>

        <Group label="Country">
          {facets.countries.map((c) => (
            <Chip key={c} active={filters.countries.includes(c)} onClick={() => toggleCountry(c)}>
              {c}
            </Chip>
          ))}
        </Group>

        <Group label="Journal">
          {facets.journals.map((j) => (
            <Chip key={j} active={filters.journals.includes(j)} onClick={() => toggleJournal(j)}>
              {j}
            </Chip>
          ))}
        </Group>
      </div>
    </div>
  );
}
