import { cn } from "@/lib/utils";
import type { ExtractionModelDefinition } from "../contracts/extraction-model";
import {
  EXTRACTION_CAPABILITY_LABELS,
  EXTRACTION_MODEL_STATUS_LABELS,
  EXTRACTION_PROVIDER_LABELS,
} from "../models";

const statusTone: Record<string, string> = {
  available: "bg-teal/15 text-foreground border-teal/30",
  planned: "bg-primary/10 text-foreground border-primary/30",
  experimental: "bg-accent/20 text-foreground border-accent/40",
  deprecated: "bg-muted text-muted-foreground border-hairline",
  future: "bg-secondary text-muted-foreground border-hairline",
};

export function ModelCard({
  model,
  className,
}: {
  model: ExtractionModelDefinition;
  className?: string;
}) {
  return (
    <article
      className={cn(
        "surface-card flex h-full flex-col gap-5 p-6 transition-all",
        className,
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex flex-col gap-1">
          <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
            {EXTRACTION_PROVIDER_LABELS[model.provider]}
          </span>
          <h3 className="font-display text-xl tracking-tight">{model.name}</h3>
        </div>
        <span
          className={cn(
            "inline-flex items-center rounded-full border px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.2em]",
            statusTone[model.status] ?? statusTone.future,
          )}
        >
          {EXTRACTION_MODEL_STATUS_LABELS[model.status]}
        </span>
      </div>

      <p className="text-sm leading-relaxed text-muted-foreground">
        {model.description}
      </p>

      <div className="mt-auto flex flex-col gap-3 border-t border-hairline pt-4">
        <div className="flex flex-col gap-1.5">
          <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
            Capabilities
          </span>
          <div className="flex flex-wrap gap-1.5">
            {model.supportedCapabilities.map((cap) => (
              <span
                key={cap}
                className="rounded-full border border-hairline bg-secondary/40 px-2 py-0.5 text-[10px] text-foreground/80"
              >
                {EXTRACTION_CAPABILITY_LABELS[cap]}
              </span>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-0.5">
            <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
              Input
            </span>
            <code className="text-[11px] text-foreground/80">
              {model.supportedInput.join(", ")}
            </code>
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
              Output
            </span>
            <code className="text-[11px] text-foreground/80">
              {model.supportedOutput.join(", ")}
            </code>
          </div>
        </div>
      </div>
    </article>
  );
}
