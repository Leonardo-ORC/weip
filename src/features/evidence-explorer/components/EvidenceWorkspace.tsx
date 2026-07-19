import { BookMarked, Database, FlaskConical, Globe2, ShieldAlert, Sparkles } from "lucide-react";
import type { EvidenceMetric } from "../types";
import type { EvidenceWorkspaceState } from "../hooks/use-evidence-workspace";
import { EvidenceComparison } from "./EvidenceComparison";
import { EvidenceFilters } from "./EvidenceFilters";
import { EvidenceGrid } from "./EvidenceGrid";
import { EvidenceHeader, EvidenceMetricCard } from "./EvidenceHeader";
import { EvidenceSearch } from "./EvidenceSearch";
import { EvidenceTimeline } from "./EvidenceTimeline";

export function EvidenceWorkspace({ state }: { state: EvidenceWorkspaceState }) {

  const metrics: EvidenceMetric[] = [
    { id: "m1", label: "Evidence objects", value: String(state.overview.total), hint: "Structured records", icon: Database },
    { id: "m2", label: "Clinical trials", value: String(state.overview.clinicalTrials), hint: "Interventional studies", icon: FlaskConical },
    { id: "m3", label: "Publications", value: String(state.overview.publications), hint: "Reviews & guidelines", icon: BookMarked },
    { id: "m4", label: "Study types", value: String(state.overview.studyTypes), hint: "Design coverage", icon: Sparkles },
    { id: "m5", label: "Countries", value: String(state.overview.countries), hint: "Population geography", icon: Globe2 },
    { id: "m6", label: "Drug labels", value: String(state.overview.drugLabels), hint: "Regulatory records", icon: ShieldAlert },
  ];

  return (
    <div className="flex flex-col gap-8">
      <EvidenceHeader overview={state.overview} />

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {metrics.map((m) => (
          <EvidenceMetricCard key={m.id} metric={m} />
        ))}
      </div>

      <EvidenceSearch
        query={state.filters.query}
        onQueryChange={state.setQuery}
        resultsCount={state.filtered.length}
      />

      <div className="grid gap-6 lg:grid-cols-[320px_minmax(0,1fr)]">
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <EvidenceFilters
            filters={state.filters}
            facets={state.facets}
            toggleType={state.toggleType}
            toggleDesign={state.toggleDesign}
            toggleContext={state.toggleContext}
            toggleCountry={state.toggleCountry}
            toggleJournal={state.toggleJournal}
            toggleDrug={state.toggleDrug}
            toggleCondition={state.toggleCondition}
            toggleConfidence={state.toggleConfidence}
            toggleQuality={state.toggleQuality}
            setYearRange={state.setYearRange}
            setAdverseEvents={state.setAdverseEvents}
            resetFilters={state.resetFilters}
            activeFilterCount={state.activeFilterCount}
          />
        </aside>

        <div className="flex flex-col gap-6">
          <section>
            <div className="mb-3 flex items-center justify-between">
              <div>
                <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
                  Publication timeline
                </div>
                <div className="font-display text-base tracking-tight">Chronology</div>
              </div>
            </div>
            <EvidenceTimeline
              items={state.filtered}
              activeId={state.selected?.id}
              onSelect={state.selectEvidence}
            />
          </section>

          <section>
            <div className="mb-3 flex items-center justify-between">
              <div>
                <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
                  Evidence grid
                </div>
                <div className="font-display text-base tracking-tight">
                  {state.filtered.length} evidence object{state.filtered.length === 1 ? "" : "s"}
                </div>
              </div>
            </div>
            <EvidenceGrid
              items={state.filtered}
              activeId={state.selected?.id}
              bookmarks={state.bookmarks}
              compareIds={state.compareIds}
              onSelect={state.selectEvidence}
              onBookmark={state.toggleBookmark}
              onCompare={state.toggleCompare}
              onReset={state.resetFilters}
            />
          </section>

          {state.compareItems.length > 0 ? (
            <section>
              <EvidenceComparison
                items={state.compareItems}
                onRemove={state.toggleCompare}
                onClear={state.clearCompare}
              />
            </section>
          ) : null}
        </div>
      </div>
    </div>
  );
}
