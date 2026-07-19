import { AlertTriangle, Inbox, WifiOff } from "lucide-react";

interface ErrorProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
}

export function PubMedErrorState({ title = "Something went wrong", message, onRetry }: ErrorProps) {
  return (
    <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-5 text-sm">
      <div className="flex items-start gap-3">
        <div className="grid h-8 w-8 place-items-center rounded-md bg-destructive/10 text-destructive">
          <AlertTriangle className="h-4 w-4" />
        </div>
        <div className="flex-1">
          <div className="font-display text-sm text-foreground">{title}</div>
          {message ? <p className="mt-1 text-xs text-muted-foreground">{message}</p> : null}
        </div>
        {onRetry ? (
          <button
            type="button"
            onClick={onRetry}
            className="rounded-md border border-hairline bg-background/60 px-3 py-1.5 text-xs text-foreground transition hover:bg-secondary"
          >
            Retry
          </button>
        ) : null}
      </div>
    </div>
  );
}

export function PubMedEmptyState({ title, description }: { title: string; description?: string }) {
  return (
    <div className="grid place-items-center rounded-xl border border-dashed border-hairline bg-background/30 px-6 py-12 text-center">
      <div className="grid h-10 w-10 place-items-center rounded-full bg-secondary text-muted-foreground">
        <Inbox className="h-5 w-5" />
      </div>
      <div className="mt-3 font-display text-base text-foreground">{title}</div>
      {description ? (
        <p className="mt-1 max-w-md text-xs text-muted-foreground">{description}</p>
      ) : null}
    </div>
  );
}

export function PubMedOfflineNote() {
  return (
    <div className="flex items-center gap-2 rounded-md bg-secondary/60 px-3 py-2 text-xs text-muted-foreground">
      <WifiOff className="h-3.5 w-3.5" />
      Live connection issues — retrying automatically.
    </div>
  );
}
