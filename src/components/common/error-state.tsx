import type { ReactNode } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ErrorStateProps {
  title?: ReactNode;
  description?: ReactNode;
  hint?: ReactNode;
  onRetry?: () => void;
  retryLabel?: string;
  secondaryAction?: ReactNode;
  className?: string;
}

/**
 * Actionable, non-technical error surface. Always explains what happened
 * and offers a recovery path — never a dead end.
 */
export function ErrorState({
  title = "Something didn't work",
  description = "We couldn't complete this action. It's usually a temporary issue.",
  hint,
  onRetry,
  retryLabel = "Try again",
  secondaryAction,
  className,
}: ErrorStateProps) {
  return (
    <div
      role="alert"
      className={cn(
        "surface-card flex flex-col items-center gap-4 p-12 text-center",
        className,
      )}
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10 text-destructive">
        <AlertTriangle className="h-5 w-5" aria-hidden />
      </div>
      <div className="space-y-2">
        <h3 className="font-display text-xl tracking-tight">{title}</h3>
        <p className="max-w-md text-sm leading-relaxed text-muted-foreground">{description}</p>
        {hint ? (
          <p className="max-w-md font-mono text-xs uppercase tracking-[0.18em] text-muted-foreground/70">
            {hint}
          </p>
        ) : null}
      </div>
      {(onRetry || secondaryAction) && (
        <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
          {onRetry ? (
            <Button onClick={onRetry} size="sm">
              <RefreshCw aria-hidden />
              {retryLabel}
            </Button>
          ) : null}
          {secondaryAction}
        </div>
      )}
    </div>
  );
}
