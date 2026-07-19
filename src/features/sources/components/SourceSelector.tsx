import { cn } from "@/lib/utils";
import { ScientificSourceRegistry } from "../registry";
import type { SourceId } from "../types";

interface SourceSelectorProps {
  selected: readonly SourceId[];
  onChange: (next: SourceId[]) => void;
  className?: string;
}

export function SourceSelector({ selected, onChange, className }: SourceSelectorProps) {
  const providers = ScientificSourceRegistry.metadata();
  const all = providers.map((p) => p.id);
  const isAll = selected.length === all.length;

  const toggle = (id: SourceId) => {
    if (selected.includes(id)) {
      const next = selected.filter((s) => s !== id);
      onChange(next.length === 0 ? all : next);
    } else {
      onChange([...selected, id]);
    }
  };

  return (
    <div className={cn("flex flex-wrap items-center gap-1.5", className)}>
      <button
        type="button"
        onClick={() => onChange(all)}
        className={cn(
          "rounded-full border px-3 py-1 font-mono text-[10px] uppercase tracking-[0.2em] transition",
          isAll
            ? "border-foreground/60 bg-foreground/5 text-foreground"
            : "border-hairline text-muted-foreground hover:text-foreground",
        )}
      >
        All sources
      </button>
      {providers.map((p) => {
        const active = selected.includes(p.id);
        return (
          <button
            key={p.id}
            type="button"
            onClick={() => toggle(p.id)}
            className={cn(
              "rounded-full border px-3 py-1 font-mono text-[10px] uppercase tracking-[0.2em] transition",
              active
                ? "border-foreground/60 bg-foreground/5 text-foreground"
                : "border-hairline text-muted-foreground hover:text-foreground",
            )}
          >
            {p.shortName}
          </button>
        );
      })}
    </div>
  );
}
