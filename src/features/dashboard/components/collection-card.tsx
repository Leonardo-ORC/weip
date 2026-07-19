import { Link } from "@tanstack/react-router";
import { ArrowUpRight, Library } from "lucide-react";
import { cn } from "@/lib/utils";
import type { CollectionSummary } from "../types";
import { DashboardWidget } from "./widget";
import { EmptyCollections } from "./empty-states";

const STATUS_STYLES: Record<CollectionSummary["status"], string> = {
  curated: "bg-primary/10 text-primary",
  draft: "bg-muted text-muted-foreground",
  shared: "bg-accent/15 text-accent",
};

export function CollectionCard({ collection }: { collection: CollectionSummary }) {
  return (
    <li>
      <Link
        to="/app/collections"
        aria-label={collection.name}
        className="group flex items-center gap-4 rounded-xl border border-hairline bg-background/40 p-4 transition hover:border-border"
      >
        <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-secondary text-foreground/80">
          <Library className="h-4 w-4" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <p className="truncate text-sm font-medium text-foreground">{collection.name}</p>
            <span
              className={cn(
                "shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium capitalize",
                STATUS_STYLES[collection.status],
              )}
            >
              {collection.status}
            </span>
          </div>
          <div className="mt-1 flex items-center gap-3 text-xs text-muted-foreground">
            <span>{collection.items} items</span>
            <span aria-hidden>·</span>
            <span>Updated {collection.updatedAt}</span>
          </div>
        </div>
        <ArrowUpRight className="h-4 w-4 shrink-0 text-muted-foreground transition group-hover:text-foreground" />
      </Link>
    </li>
  );
}

export function CollectionsWidget({ collections }: { collections: CollectionSummary[] }) {
  return (
    <DashboardWidget
      eyebrow="Library"
      title="Collections"
      subtitle="Curated sets of scientific evidence."
      action={
        <Link
          to="/app/collections"
          className="inline-flex items-center gap-1 text-xs font-medium text-foreground transition hover:opacity-80"
        >
          Open <ArrowUpRight className="h-3.5 w-3.5" />
        </Link>
      }
    >
      {collections.length === 0 ? (
        <EmptyCollections />
      ) : (
        <ul className="grid gap-2">
          {collections.map((c) => (
            <CollectionCard key={c.id} collection={c} />
          ))}
        </ul>
      )}
    </DashboardWidget>
  );
}
