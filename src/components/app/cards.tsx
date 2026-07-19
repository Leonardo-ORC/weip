import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { ArrowUpRight, CheckCircle2, CircleDot, Clock, MinusCircle } from "lucide-react";
import { cn } from "@/lib/utils";

/* ── QuickAction ─────────────────────────────────────────── */
interface QuickActionCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  to: string;
  hint?: string;
}
export function QuickActionCard({ icon: Icon, title, description, to, hint }: QuickActionCardProps) {
  return (
    <Link
      to={to as never}
      className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-hairline bg-background/60 p-5 transition hover:border-border hover:bg-background"
    >
      <div className="flex items-start justify-between">
        <div className="grid h-10 w-10 place-items-center rounded-xl bg-primary/10 text-primary">
          <Icon className="h-5 w-5" />
        </div>
        <ArrowUpRight className="h-4 w-4 text-muted-foreground transition group-hover:text-foreground" />
      </div>
      <div className="mt-6">
        <h3 className="font-display text-lg text-foreground">{title}</h3>
        <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{description}</p>
        {hint ? (
          <div className="mt-4 font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
            {hint}
          </div>
        ) : null}
      </div>
    </Link>
  );
}

/* ── Workspace ───────────────────────────────────────────── */
interface WorkspaceCardProps {
  title: string;
  description: string;
  tag?: string;
  progress?: number;
  meta?: string;
  href?: string;
}
export function WorkspaceCard({ title, description, tag, progress, meta, href }: WorkspaceCardProps) {
  const inner = (
    <div className="flex h-full flex-col justify-between rounded-2xl border border-hairline bg-background/60 p-6 transition hover:border-border">
      <div>
        <div className="flex items-center justify-between">
          {tag ? (
            <span className="rounded-full border border-hairline px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
              {tag}
            </span>
          ) : <span />}
          <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
        </div>
        <h3 className="font-display mt-4 text-xl leading-tight text-foreground">{title}</h3>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{description}</p>
      </div>
      <div className="mt-6 space-y-3">
        {typeof progress === "number" ? (
          <div>
            <div className="flex items-center justify-between text-[11px] text-muted-foreground">
              <span>Progress</span>
              <span>{progress}%</span>
            </div>
            <div className="mt-1.5 h-1 overflow-hidden rounded-full bg-secondary">
              <div className="h-full rounded-full bg-primary" style={{ width: `${progress}%` }} />
            </div>
          </div>
        ) : null}
        {meta ? <div className="text-xs text-muted-foreground">{meta}</div> : null}
      </div>
    </div>
  );
  return href ? <Link to={href as never} className="block h-full">{inner}</Link> : inner;
}

export function WorkspaceGrid({ children }: { children: ReactNode }) {
  return <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">{children}</div>;
}

/* ── Activity ────────────────────────────────────────────── */
interface ActivityItem {
  title: string;
  description?: string;
  time: string;
  icon?: LucideIcon;
  tone?: "default" | "primary" | "accent";
}
export function ActivityCard({ items }: { items: ActivityItem[] }) {
  return (
    <ol className="relative space-y-0">
      {items.map((item, i) => {
        const Icon = item.icon ?? CircleDot;
        return (
          <li key={`${item.title}-${i}`} className="relative flex gap-4 pb-6 last:pb-0">
            {i !== items.length - 1 && (
              <span aria-hidden className="absolute left-[19px] top-9 h-full w-px bg-hairline" />
            )}
            <div
              className={cn(
                "grid h-10 w-10 shrink-0 place-items-center rounded-full border border-hairline bg-background",
                item.tone === "primary" && "border-primary/30 bg-primary/5 text-primary",
                item.tone === "accent" && "border-accent/30 bg-accent/5 text-accent",
              )}
            >
              <Icon className="h-4 w-4" />
            </div>
            <div className="min-w-0 flex-1 pt-1">
              <div className="flex items-baseline justify-between gap-2">
                <p className="truncate text-sm font-medium text-foreground">{item.title}</p>
                <span className="shrink-0 font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                  {item.time}
                </span>
              </div>
              {item.description ? (
                <p className="mt-0.5 text-sm leading-relaxed text-muted-foreground">{item.description}</p>
              ) : null}
            </div>
          </li>
        );
      })}
    </ol>
  );
}

/* ── Status ──────────────────────────────────────────────── */
export type SystemStatus = "operational" | "degraded" | "planned" | "future";
const statusMap: Record<SystemStatus, { label: string; dot: string; icon: LucideIcon }> = {
  operational: { label: "Operational", dot: "bg-emerald-500", icon: CheckCircle2 },
  degraded: { label: "Degraded", dot: "bg-amber-500", icon: MinusCircle },
  planned: { label: "Planned", dot: "bg-primary", icon: Clock },
  future: { label: "Future", dot: "bg-muted-foreground/60", icon: Clock },
};

interface StatusCardProps {
  title: string;
  description: string;
  status: SystemStatus;
  meta?: string;
}
export function StatusCard({ title, description, status, meta }: StatusCardProps) {
  const s = statusMap[status];
  return (
    <div className="flex flex-col justify-between rounded-2xl border border-hairline bg-background/60 p-5">
      <div>
        <div className="flex items-center gap-2">
          <span className={cn("h-2 w-2 rounded-full", s.dot)} />
          <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
            {s.label}
          </span>
        </div>
        <h3 className="font-display mt-3 text-lg text-foreground">{title}</h3>
        <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{description}</p>
      </div>
      {meta ? <div className="mt-5 text-xs text-muted-foreground">{meta}</div> : null}
    </div>
  );
}

/* ── Empty workspace ─────────────────────────────────────── */
interface EmptyWorkspaceProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?: ReactNode;
}
export function EmptyWorkspace({ icon: Icon = CircleDot, title, description, action }: EmptyWorkspaceProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-hairline bg-background/40 px-6 py-20 text-center">
      <div className="grid h-14 w-14 place-items-center rounded-2xl bg-secondary text-foreground/70">
        <Icon className="h-6 w-6" />
      </div>
      <h3 className="font-display mt-6 text-2xl text-foreground">{title}</h3>
      {description ? (
        <p className="mt-2 max-w-md text-sm leading-relaxed text-muted-foreground">{description}</p>
      ) : null}
      {action ? <div className="mt-6">{action}</div> : null}
    </div>
  );
}
