import { useState, type ReactNode } from "react";
import { PanelRight, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface ContextPanelProps {
  title?: string;
  children: ReactNode;
  className?: string;
  defaultOpen?: boolean;
}

export function ContextPanel({ title = "Context", children, className, defaultOpen = false }: ContextPanelProps) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <aside
      aria-label={title}
      className={cn(
        "relative hidden shrink-0 border-l border-hairline bg-background/60 transition-[width] duration-300 lg:block",
        open ? "w-80" : "w-12",
        className,
      )}
    >
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-label={open ? "Collapse context panel" : "Expand context panel"}
        className="absolute right-2 top-4 inline-flex h-8 w-8 items-center justify-center rounded-full border border-hairline bg-background text-muted-foreground transition hover:bg-secondary hover:text-foreground"
      >
        {open ? <X className="h-4 w-4" /> : <PanelRight className="h-4 w-4" />}
      </button>
      {open ? (
        <div className="h-full overflow-auto p-5 pt-14">
          <div className="mb-4 font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
            {title}
          </div>
          <div>{children}</div>
        </div>
      ) : null}
    </aside>
  );
}
