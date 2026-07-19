import { toast } from "sonner";
import type { ResearchWorkspaceState } from "../hooks/use-research-workspace";
import { CollectionGrid } from "./CollectionGrid";
import { HypothesisList } from "./HypothesisCard";
import { ProjectGrid } from "./ProjectGrid";
import { QuestionList } from "./QuestionCard";
import { QuickActionPanel } from "./QuickActionPanel";
import { ResearchNotes } from "./ResearchNotes";
import { ResearchTimeline } from "./ResearchTimeline";
import { WorkspaceFiltersPanel } from "./WorkspaceFilters";
import { WorkspaceOverview } from "./WorkspaceOverview";
import { WorkspaceSearch } from "./WorkspaceSearch";

function SectionHeading({
  eyebrow,
  title,
  count,
}: {
  eyebrow: string;
  title: string;
  count?: number;
}) {
  return (
    <div className="mb-4 flex items-end justify-between">
      <div>
        <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
          {eyebrow}
        </div>
        <h2 className="font-display text-xl tracking-tight text-foreground">{title}</h2>
      </div>
      {typeof count === "number" ? (
        <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
          {count} item{count === 1 ? "" : "s"}
        </span>
      ) : null}
    </div>
  );
}

export function ResearchWorkspace({ state }: { state: ResearchWorkspaceState }) {
  const totalMatches =
    state.projects.length +
    state.questions.length +
    state.hypotheses.length +
    state.collections.length +
    state.notes.length;

  return (
    <div className="flex flex-col gap-10">
      <WorkspaceOverview stats={state.statistics} />

      <section>
        <SectionHeading eyebrow="Actions" title="Quick actions" />
        <QuickActionPanel
          onAction={(a) => toast.info(`${a.label} — placeholder`, { description: a.description })}
        />
      </section>

      <WorkspaceSearch
        query={state.filters.query}
        onQueryChange={state.setQuery}
        count={totalMatches}
      />

      <div className="grid gap-8 lg:grid-cols-[320px_minmax(0,1fr)]">
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <WorkspaceFiltersPanel
            filters={state.filters}
            owners={state.owners}
            activeCount={state.activeFilterCount}
            toggleStatus={state.toggleStatus}
            toggleArea={state.toggleArea}
            togglePriority={state.togglePriority}
            toggleOwner={state.toggleOwner}
            setUpdatedWithin={state.setUpdatedWithin}
            reset={state.resetFilters}
          />
        </aside>

        <div className="flex flex-col gap-10">
          <section>
            <SectionHeading
              eyebrow="Investigations"
              title="Research projects"
              count={state.projects.length}
            />
            <ProjectGrid
              projects={state.projects}
              selectedId={state.selectedProject?.id}
              onSelect={state.selectProject}
            />
          </section>

          <section>
            <SectionHeading
              eyebrow="Inquiry"
              title="Research questions"
              count={state.questions.length}
            />
            <QuestionList questions={state.questions} projects={state.projects} />
          </section>

          <section>
            <SectionHeading
              eyebrow="Reasoning"
              title="Hypotheses"
              count={state.hypotheses.length}
            />
            <HypothesisList hypotheses={state.hypotheses} projects={state.projects} />
          </section>

          <section>
            <SectionHeading
              eyebrow="Curation"
              title="Evidence collections"
              count={state.collections.length}
            />
            <CollectionGrid collections={state.collections} projects={state.projects} />
          </section>

          <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_360px]">
            <section>
              <SectionHeading eyebrow="Activity" title="Recent activity" />
              <ResearchTimeline events={state.timeline.slice(0, 6)} />
            </section>
            <section>
              <SectionHeading eyebrow="Notes" title="Notes preview" count={state.notes.length} />
              <ResearchNotes notes={state.notes.slice(0, 4)} projects={state.projects} />
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
