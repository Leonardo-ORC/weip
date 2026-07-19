import { Layers } from "lucide-react";
import type { ResearchCollection, ResearchProject } from "../types";
import { CollectionStatusBadge, OwnerAvatar, RelativeTime } from "./ResearchBadge";

export function CollectionCard({
  collection,
  projectTitle,
}: {
  collection: ResearchCollection;
  projectTitle?: string;
}) {
  return (
    <article className="flex flex-col rounded-2xl border border-hairline bg-background/60 p-5">
      <div className="mb-3 flex items-center gap-2">
        <div className="grid h-8 w-8 place-items-center rounded-lg bg-secondary text-foreground/80">
          <Layers className="h-4 w-4" />
        </div>
        <div className="min-w-0 flex-1">
          <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
            {projectTitle ?? "Collection"}
          </span>
        </div>
        <CollectionStatusBadge status={collection.status} />
      </div>

      <h4 className="font-display text-base leading-snug tracking-tight text-foreground">
        {collection.name}
      </h4>
      <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
        {collection.description}
      </p>

      <div className="mt-4 flex flex-wrap gap-1.5">
        {collection.tags.map((t) => (
          <span
            key={t}
            className="rounded-full border border-hairline px-2 py-0.5 text-[10px] text-muted-foreground"
          >
            {t}
          </span>
        ))}
      </div>

      <div className="mt-5 flex items-center justify-between border-t border-hairline pt-4">
        <div className="flex items-center gap-2">
          <OwnerAvatar initials={collection.owner.initials} name={collection.owner.name} />
          <RelativeTime iso={collection.updatedAt} />
        </div>
        <div className="text-right">
          <div className="font-display text-base tracking-tight">{collection.evidenceCount}</div>
          <div className="font-mono text-[9px] uppercase tracking-[0.22em] text-muted-foreground">
            Evidence
          </div>
        </div>
      </div>
    </article>
  );
}

export function CollectionGrid({
  collections,
  projects,
}: {
  collections: ResearchCollection[];
  projects: ResearchProject[];
}) {
  if (collections.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-hairline bg-background/40 p-8 text-center text-sm text-muted-foreground">
        No collections match.
      </div>
    );
  }
  return (
    <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
      {collections.map((c) => (
        <CollectionCard
          key={c.id}
          collection={c}
          projectTitle={projects.find((p) => p.id === c.projectId)?.title}
        />
      ))}
    </div>
  );
}
