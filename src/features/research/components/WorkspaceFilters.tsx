import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import type {
  Priority,
  ResearchArea,
  ResearchOwner,
  ResearchStatus,
  WorkspaceFilters,
} from "../types";
import { PRIORITY_LABEL, RESEARCH_AREA_LABEL, STATUS_LABEL } from "../types";

const STATUSES: ResearchStatus[] = ["active", "planning", "paused", "completed", "archived"];
const PRIORITIES: Priority[] = ["critical", "high", "medium", "low"];
const AREAS: ResearchArea[] = [
  "hormonal-health",
  "menopause",
  "pcos",
  "endometriosis",
  "pregnancy",
  "oncology",
  "cardiometabolic",
  "reproductive-health",
];
const RECENCY: { label: string; days: number | null }[] = [
  { label: "Any time", days: null },
  { label: "24h", days: 1 },
  { label: "7d", days: 7 },
  { label: "30d", days: 30 },
];

interface Props {
  filters: WorkspaceFilters;
  owners: ResearchOwner[];
  activeCount: number;
  toggleStatus: (s: ResearchStatus) => void;
  toggleArea: (a: ResearchArea) => void;
  togglePriority: (p: Priority) => void;
  toggleOwner: (id: string) => void;
  setUpdatedWithin: (days: number | null) => void;
  reset: () => void;
}

export function WorkspaceFiltersPanel({
  filters,
  owners,
  activeCount,
  toggleStatus,
  toggleArea,
  togglePriority,
  toggleOwner,
  setUpdatedWithin,
  reset,
}: Props) {
  return (
    <div className="rounded-2xl border border-hairline bg-background/60 p-5">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
            Filters
          </div>
          <div className="font-display text-base tracking-tight">Refine workspace</div>
        </div>
        {activeCount > 0 ? (
          <button
            type="button"
            onClick={reset}
            className="inline-flex items-center gap-1 rounded-full border border-hairline px-2.5 py-1 text-[10px] uppercase tracking-[0.18em] text-muted-foreground hover:bg-secondary"
          >
            <X className="h-3 w-3" /> reset ({activeCount})
          </button>
        ) : null}
      </div>

      <FilterGroup label="Status">
        {STATUSES.map((s) => (
          <Chip key={s} active={filters.statuses.includes(s)} onClick={() => toggleStatus(s)}>
            {STATUS_LABEL[s]}
          </Chip>
        ))}
      </FilterGroup>

      <FilterGroup label="Research area">
        {AREAS.map((a) => (
          <Chip key={a} active={filters.areas.includes(a)} onClick={() => toggleArea(a)}>
            {RESEARCH_AREA_LABEL[a]}
          </Chip>
        ))}
      </FilterGroup>

      <FilterGroup label="Priority">
        {PRIORITIES.map((p) => (
          <Chip key={p} active={filters.priorities.includes(p)} onClick={() => togglePriority(p)}>
            {PRIORITY_LABEL[p]}
          </Chip>
        ))}
      </FilterGroup>

      <FilterGroup label="Owner">
        {owners.map((o) => (
          <Chip key={o.id} active={filters.owners.includes(o.id)} onClick={() => toggleOwner(o.id)}>
            {o.name}
          </Chip>
        ))}
      </FilterGroup>

      <FilterGroup label="Updated">
        {RECENCY.map((r) => (
          <Chip
            key={r.label}
            active={filters.updatedWithinDays === r.days}
            onClick={() => setUpdatedWithin(r.days)}
          >
            {r.label}
          </Chip>
        ))}
      </FilterGroup>
    </div>
  );
}

function FilterGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="mb-4 last:mb-0">
      <div className="mb-2 font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
        {label}
      </div>
      <div className="flex flex-wrap gap-1.5">{children}</div>
    </div>
  );
}

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
          ? "border-foreground/70 bg-foreground text-background"
          : "border-hairline text-foreground/80 hover:bg-secondary",
      )}
    >
      {children}
    </button>
  );
}
