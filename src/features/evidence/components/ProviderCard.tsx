import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Tag } from "@/components/common/tag";
import {
  PROVIDER_CATEGORY_LABELS,
  SUPPORTED_CONTENT_LABELS,
} from "../models/provider";
import type { ProviderDefinition } from "../types/provider";
import { ProviderBadge } from "./ProviderBadge";
import { ProviderStatus } from "./ProviderStatus";

export function ProviderCard({
  provider,
  className,
}: {
  provider: ProviderDefinition;
  className?: string;
}) {
  const hasDocs = Boolean(provider.documentation.homepage || provider.documentation.apiReference);
  const primaryDoc = provider.documentation.apiReference ?? provider.documentation.homepage;

  return (
    <article
      className={cn(
        "surface-card group relative flex h-full flex-col gap-6 p-8 transition-all duration-500 hover:-translate-y-0.5 hover:shadow-elevated",
        className,
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex flex-col gap-2">
          <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
            {PROVIDER_CATEGORY_LABELS[provider.category]}
          </span>
          <h3 className="font-display text-2xl tracking-tight">{provider.name}</h3>
        </div>
        <ProviderBadge status={provider.status} />
      </div>

      <p className="text-sm leading-relaxed text-muted-foreground">{provider.description}</p>

      <dl className="grid grid-cols-2 gap-x-6 gap-y-4 border-t border-hairline pt-6 text-sm">
        {provider.coverage?.documents ? (
          <div>
            <dt className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
              Coverage
            </dt>
            <dd className="mt-1 text-foreground">{provider.coverage.documents}</dd>
          </div>
        ) : null}
        {provider.coverage?.startYear ? (
          <div>
            <dt className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
              Since
            </dt>
            <dd className="mt-1 text-foreground">{provider.coverage.startYear}</dd>
          </div>
        ) : null}
        <div>
          <dt className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
            Refresh
          </dt>
          <dd className="mt-1 capitalize text-foreground">{provider.refreshStrategy}</dd>
        </div>
        <div>
          <dt className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
            Access
          </dt>
          <dd className="mt-1 capitalize text-foreground">{provider.availability}</dd>
        </div>
      </dl>

      <div className="flex flex-col gap-2">
        <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
          Supported content
        </span>
        <div className="flex flex-wrap gap-1.5">
          {provider.supportedContent.map((content) => (
            <Tag key={content} variant="outline">
              {SUPPORTED_CONTENT_LABELS[content]}
            </Tag>
          ))}
        </div>
      </div>

      {provider.futureCapabilities?.length ? (
        <div className="flex flex-col gap-3 rounded-lg border border-dashed border-hairline bg-secondary/30 p-4">
          <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
            Future connector
          </span>
          <ul className="space-y-2">
            {provider.futureCapabilities.map((cap) => (
              <li key={cap.title} className="text-sm">
                <span className="font-medium text-foreground">{cap.title}.</span>{" "}
                <span className="text-muted-foreground">{cap.description}</span>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      <div className="mt-auto flex items-center justify-between border-t border-hairline pt-6">
        <ProviderStatus status={provider.status} />
        {hasDocs && primaryDoc ? (
          <a
            href={primaryDoc}
            target="_blank"
            rel="noreferrer noopener"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-foreground transition-colors hover:text-primary"
          >
            Documentation
            <ArrowUpRight className="h-3.5 w-3.5" aria-hidden />
          </a>
        ) : (
          <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
            Docs pending
          </span>
        )}
      </div>
    </article>
  );
}
