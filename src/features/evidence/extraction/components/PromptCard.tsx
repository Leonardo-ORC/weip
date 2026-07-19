import { cn } from "@/lib/utils";
import type { PromptDomainDefinition } from "../contracts/prompt";

export function PromptCard({
  domain,
  className,
}: {
  domain: PromptDomainDefinition;
  className?: string;
}) {
  const count = domain.prompts.length;

  return (
    <article
      className={cn(
        "surface-card flex h-full flex-col gap-4 p-6 transition-all",
        className,
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex flex-col gap-1">
          <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
            Prompt domain
          </span>
          <h3 className="font-display text-xl tracking-tight">{domain.name}</h3>
        </div>
        <span className="rounded-full border border-hairline bg-secondary/40 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
          {count === 0 ? "Reserved" : `${count} prompts`}
        </span>
      </div>
      <p className="text-sm leading-relaxed text-muted-foreground">
        {domain.description}
      </p>
    </article>
  );
}
