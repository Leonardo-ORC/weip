import { createFileRoute } from "@tanstack/react-router";
import { Library, FolderPlus } from "lucide-react";
import { AppPage } from "@/components/app/app-page";
import { ResearchIntelligenceService } from "@/features/intelligence";

export const Route = createFileRoute("/app/collections")({
  head: () => ({ meta: [{ title: "Collections — WEIP" }, { name: "robots", content: "noindex" }] }),
  component: CollectionsPage,
});

function CollectionsPage() {
  const collections = ResearchIntelligenceService.context().collections;

  return (
    <AppPage
      eyebrow="Collections"
      title="Organized scientific assets"
      subtitle="Group evidence, publications and trials into shareable sets. Organization only — research lives in Projects."
      breadcrumbs={[{ label: "Workspace", to: "/app/dashboard" }, { label: "Collections" }]}
    >
      {collections.length === 0 ? (
        <EmptyCollections />
      ) : (
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
      )}
    </AppPage>
  );
}

function EmptyCollections() {
  return (
    <section className="rounded-2xl border border-dashed border-hairline bg-background/40 p-10 text-center">
      <FolderPlus className="mx-auto h-6 w-6 text-muted-foreground" />
      <h3 className="font-display mt-3 text-base text-foreground">No collections yet</h3>
      <p className="mx-auto mt-2 max-w-md text-xs text-muted-foreground">
        Collections group Evidence Objects for sharing and reuse. Start by importing records in Scientific
        Sources, then curate them from the Evidence Workspace.
      </p>
    </section>
  );
}
