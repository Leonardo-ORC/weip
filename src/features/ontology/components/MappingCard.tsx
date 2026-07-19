import { ExternalLink } from "lucide-react";
import type { ExternalStandard } from "../types";
import { OntologyStatusBadge } from "./OntologyHeader";

export function MappingCard({ standard }: { standard: ExternalStandard }) {
  return (
    <article className="flex h-full flex-col rounded-2xl border border-hairline bg-background/60 p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
            {standard.scope}
          </span>
          <h3 className="font-display mt-1 text-lg tracking-tight text-foreground">
            {standard.name}
          </h3>
        </div>
        <OntologyStatusBadge status={standard.status} />
      </div>
      <p className="mt-3 flex-1 text-xs text-muted-foreground">{standard.description}</p>
      <div className="mt-4 flex items-center justify-between border-t border-hairline pt-3">
        <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
          {standard.mappedCount.toLocaleString()} planned
        </span>
        {standard.url ? (
          <a
            href={standard.url}
            target="_blank"
            rel="noreferrer noopener"
            className="inline-flex items-center gap-1 text-[11px] text-muted-foreground hover:text-foreground"
          >
            Reference <ExternalLink className="h-3 w-3" />
          </a>
        ) : null}
      </div>
    </article>
  );
}
