import { createFileRoute } from "@tanstack/react-router";
import { Library } from "lucide-react";
import { AppPage } from "@/components/app/app-page";
import { IntelligencePanel, ResearchIntelligenceService } from "@/features/intelligence";

export const Route = createFileRoute("/app/collections")({
  head: () => ({ meta: [{ title: "Collections — WEIP" }, { name: "robots", content: "noindex" }] }),
  component: CollectionsPage,
});

function CollectionsPage() {
  const collections = ResearchIntelligenceService.context().collections;

  return (
    <AppPage
      eyebrow="Collections"
      title="Curated evidence"
      subtitle="Shareable sets of publications, trials and labels — now analysed for overlap, gaps and merges."
      breadcrumbs={[{ label: "Workspace", to: "/app/dashboard" }, { label: "Collections" }]}
    >
      <div className="flex flex-col gap-8">
        <IntelligencePanel
          surface="collections"
          title="Collection intelligence"
          subtitle="Duplicate detection, concept overlap, coverage gaps and suggested merges."
          limit={6}
        />

        <section className="rounded-2xl border border-hairline bg-background/60 p-6">
          <header className="mb-4 flex items-center gap-2">
            <Library className="h-4 w-4 text-primary" />
            <div>
              <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
                Curated
              </div>
              <h2 className="font-display text-lg text-foreground">Active collections</h2>
            </div>
          </header>
          <ul className="grid gap-3 md:grid-cols-2">
            {collections.map((c) => (
              <li key={c.id} className="rounded-xl border border-hairline bg-background/40 p-4">
                <div className="flex items-center justify-between">
                  <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
                    {c.status}
                  </div>
                  <div className="font-mono text-[10px] text-foreground">{c.evidenceCount} evidence</div>
                </div>
                <h3 className="font-display mt-1 text-sm text-foreground">{c.name}</h3>
                <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{c.description}</p>
                <div className="mt-2 flex flex-wrap gap-1">
                  {c.tags.slice(0, 4).map((t) => (
                    <span key={t} className="rounded-full border border-hairline bg-background/60 px-2 py-0.5 text-[10px] text-muted-foreground">
                      {t}
                    </span>
                  ))}
                </div>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </AppPage>
  );
}
