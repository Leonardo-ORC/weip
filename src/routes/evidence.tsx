import { createFileRoute } from "@tanstack/react-router";
import { PageLayout } from "@/components/layout/page-layout";
import { PageHeader } from "@/components/layout/page-header";
import { Section } from "@/components/layout/section";
import {
  ProviderCategory,
  ProviderEmptyState,
  ProviderGrid,
  ProviderSearch,
  useProviderCatalog,
} from "@/features/evidence";

export const Route = createFileRoute("/evidence")({
  head: () => ({
    meta: [
      { title: "Evidence Sources — WEIP" },
      {
        name: "description",
        content:
          "The catalog of scientific evidence providers powering WEIP — literature, clinical trials, drug safety, drug labels and bibliographic knowledge.",
      },
      { property: "og:title", content: "Evidence Sources — WEIP" },
      {
        property: "og:description",
        content:
          "Every scientific source integrated into WEIP, organized by category and status. The infrastructure layer of women's clinical evidence.",
      },
    ],
  }),
  component: EvidencePage,
});

function EvidencePage() {
  const {
    filters,
    setQuery,
    toggleCategory,
    toggleStatus,
    reset,
    filtered,
    grouped,
    hasActiveFilters,
  } = useProviderCatalog();

  return (
    <PageLayout
      header={
        <PageHeader
          eyebrow="Evidence Infrastructure"
          title="Every scientific source, treated as a first-class provider."
          description="WEIP unifies scientific literature, clinical trials, drug safety and regulatory data behind a single provider contract. This catalog is the substrate — future ingestion, extraction and intelligence plug in on top."
        />
      }
    >
      <Section>
        <div className="grid gap-16 lg:grid-cols-[320px_1fr]">
          <aside className="lg:sticky lg:top-28 lg:self-start">
            <ProviderSearch
              query={filters.query}
              onQueryChange={setQuery}
              selectedCategories={filters.categories}
              onToggleCategory={toggleCategory}
              selectedStatuses={filters.statuses}
              onToggleStatus={toggleStatus}
              onReset={reset}
              hasActiveFilters={hasActiveFilters}
            />
          </aside>

          <div className="flex flex-col gap-20">
            {filtered.length === 0 ? (
              <ProviderEmptyState onReset={reset} />
            ) : (
              grouped.map((group) => (
                <ProviderCategory
                  key={group.category}
                  category={group.category}
                  count={group.providers.length}
                >
                  <ProviderGrid providers={group.providers} />
                </ProviderCategory>
              ))
            )}
          </div>
        </div>
      </Section>
    </PageLayout>
  );
}
