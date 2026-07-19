import type { ReactNode } from "react";
import { CalendarDays } from "lucide-react";
import { useAuth } from "@/features/auth";

interface CommandCenterProps {
  primaryAction?: ReactNode;
  secondaryAction?: ReactNode;
}

function formatToday() {
  return new Intl.DateTimeFormat(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date());
}

function greeting() {
  const h = new Date().getHours();
  if (h < 5) return "Still up";
  if (h < 12) return "Good morning";
  if (h < 18) return "Good afternoon";
  return "Good evening";
}

export function CommandCenter({ primaryAction, secondaryAction }: CommandCenterProps) {
  const { profile, user } = useAuth();
  const firstName = profile?.fullName?.split(" ")[0] || user?.email?.split("@")[0] || "researcher";
  const today = formatToday();

  return (
    <section
      aria-label="Welcome"
      className="relative overflow-hidden rounded-3xl border border-hairline bg-gradient-to-br from-background/80 via-background/60 to-secondary/40 p-6 lg:p-8"
    >
      <div className="pointer-events-none absolute inset-0 opacity-[0.06] grid-pattern" aria-hidden />
      <div className="relative grid grid-cols-1 items-end gap-6 lg:grid-cols-[minmax(0,1fr)_auto]">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2 font-mono text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
            <CalendarDays className="h-3.5 w-3.5" />
            <span>{today}</span>
          </div>
          <h1 className="font-display mt-3 text-3xl leading-tight text-foreground lg:text-4xl">
            {greeting()}, {firstName}.
          </h1>
        </div>
        <div className="flex flex-wrap items-center gap-2 lg:justify-end">
          {secondaryAction}
          {primaryAction}
        </div>
      </div>
    </section>
  );
}
