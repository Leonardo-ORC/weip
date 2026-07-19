import { cn } from "@/lib/utils";
import { ChevronRight, Lock } from "lucide-react";
import type { ExtractionFlowLayer } from "../models";
import { ValidationBadge } from "./ValidationBadge";

export function ArchitectureDiagram({
  layers,
  className,
}: {
  layers: readonly ExtractionFlowLayer[];
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col gap-6", className)}>
      <ol className="hidden items-stretch gap-3 lg:flex">
        {layers.map((layer, idx) => (
          <li key={layer.id} className="flex flex-1 items-stretch gap-3">
            <LayerCard layer={layer} />
            {idx < layers.length - 1 ? (
              <div className="flex items-center text-muted-foreground/60">
                <ChevronRight className="h-4 w-4" aria-hidden />
              </div>
            ) : null}
          </li>
        ))}
      </ol>

      <ol className="flex flex-col gap-3 lg:hidden">
        {layers.map((layer) => (
          <li key={layer.id}>
            <LayerCard layer={layer} />
          </li>
        ))}
      </ol>
    </div>
  );
}

function LayerCard({ layer }: { layer: ExtractionFlowLayer }) {
  const emphasised = layer.state === "current";
  const locked = layer.state === "locked";

  return (
    <div
      className={cn(
        "surface-card flex h-full flex-1 flex-col gap-3 p-5 transition-all",
        emphasised && "ring-1 ring-primary/40 shadow-elevated",
        locked && "opacity-60",
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
          Layer
        </span>
        {locked ? (
          <Lock className="h-3.5 w-3.5 text-muted-foreground" aria-hidden />
        ) : (
          <ValidationBadge state={layer.state} />
        )}
      </div>
      <h3 className="font-display text-lg leading-tight tracking-tight">
        {layer.name}
      </h3>
      <p className="text-xs leading-relaxed text-muted-foreground">
        {layer.description}
      </p>
    </div>
  );
}
