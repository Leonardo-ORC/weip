import type { ReactNode } from "react";
import { Loader2, Inbox, AlertTriangle, WifiOff, Wrench, ShieldOff } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export type AppStateKind = "loading" | "empty" | "error" | "offline" | "maintenance" | "unauthorized";

const kinds: Record<AppStateKind, { icon: LucideIcon; title: string; description: string; spin?: boolean }> = {
  loading: { icon: Loader2, title: "Loading", description: "Preparing your workspace.", spin: true },
  empty: { icon: Inbox, title: "Nothing here yet", description: "This surface will populate as evidence flows in." },
  error: { icon: AlertTriangle, title: "Something went wrong", description: "Try again in a moment." },
  offline: { icon: WifiOff, title: "You're offline", description: "Reconnect to sync your workspace." },
  maintenance: { icon: Wrench, title: "Scheduled maintenance", description: "We'll be back shortly." },
  unauthorized: { icon: ShieldOff, title: "Access required", description: "Request access to view this surface." },
};

interface AppStateProps {
  kind: AppStateKind;
  title?: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}

export function AppState({ kind, title, description, action, className }: AppStateProps) {
  const preset = kinds[kind];
  const Icon = preset.icon;
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center rounded-3xl border border-dashed border-hairline bg-background/40 px-6 py-24 text-center",
        className,
      )}
    >
      <div className="grid h-14 w-14 place-items-center rounded-2xl bg-secondary text-foreground/70">
        <Icon className={cn("h-6 w-6", preset.spin && "animate-spin")} />
      </div>
      <h3 className="font-display mt-6 text-2xl text-foreground">{title ?? preset.title}</h3>
      <p className="mt-2 max-w-md text-sm leading-relaxed text-muted-foreground">
        {description ?? preset.description}
      </p>
      {action ? <div className="mt-6">{action}</div> : null}
    </div>
  );
}
