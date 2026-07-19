import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface ContextualLoaderProps {
  /** Short context message, e.g. "Extracting evidence…" */
  message: string;
  /** Optional secondary explanation. */
  hint?: string;
  /** Determinate progress 0–100. Omit for indeterminate. */
  progress?: number;
  className?: string;
}

/**
 * A calm, scientific loader that communicates *what* is happening — not a
 * generic spinner. Prefer this over raw `<Loader2 />` anywhere the operation
 * takes more than a few hundred milliseconds.
 */
export function ContextualLoader({ message, hint, progress, className }: ContextualLoaderProps) {
  const determinate = typeof progress === "number";
  const clamped = determinate ? Math.max(0, Math.min(100, progress)) : 0;

  return (
    <div
      className={cn(
        "flex flex-col items-start gap-3 rounded-2xl border border-hairline bg-background/60 p-5",
        className,
      )}
      role="status"
      aria-live="polite"
      aria-busy
    >
      <div className="flex items-center gap-3 text-sm text-foreground/80">
        <Loader2 className="h-4 w-4 animate-spin text-primary" aria-hidden />
        <span className="font-medium">{message}</span>
        {determinate ? (
          <span className="font-mono text-xs text-muted-foreground">
            {Math.round(clamped)}%
          </span>
        ) : null}
      </div>
      {hint ? <p className="text-xs text-muted-foreground">{hint}</p> : null}
      <div className="relative h-1 w-full overflow-hidden rounded-full bg-secondary">
        {determinate ? (
          <div
            className="h-full bg-primary transition-[width] duration-500 ease-out"
            style={{ width: `${clamped}%` }}
          />
        ) : (
          <div className="absolute inset-y-0 -left-1/3 w-1/3 animate-[weip-loader_1.4s_ease-in-out_infinite] rounded-full bg-primary/70" />
        )}
      </div>
    </div>
  );
}
