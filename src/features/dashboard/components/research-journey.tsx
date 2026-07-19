import { Link } from "@tanstack/react-router";
import { Check, ArrowRight, Radio, Cpu, Database, GitBranch, Sparkles, FolderKanban } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type StageState = "complete" | "current" | "next" | "upcoming";

interface Stage {
  id: string;
  label: string;
  to: string;
  icon: LucideIcon;
  state: StageState;
}

const STAGES: Stage[] = [
  { id: "sources", label: "Scientific Sources", to: "/app/sources", icon: Radio, state: "complete" },
  { id: "extraction", label: "Extraction", to: "/app/pipeline", icon: Cpu, state: "complete" },
  { id: "evidence", label: "Evidence Objects", to: "/app/evidence", icon: Database, state: "current" },
  { id: "graph", label: "Knowledge Graph", to: "/app/graph", icon: GitBranch, state: "next" },
  { id: "intelligence", label: "Research Intelligence", to: "/app/research", icon: Sparkles, state: "upcoming" },
  { id: "projects", label: "Projects", to: "/app/projects", icon: FolderKanban, state: "upcoming" },
];

function stageStyles(state: StageState) {
  switch (state) {
    case "complete":
      return {
        dot: "bg-foreground text-background border-foreground",
        label: "text-foreground",
        badge: "Completed",
      };
    case "current":
      return {
        dot: "bg-primary text-primary-foreground border-primary ring-4 ring-primary/15",
        label: "text-foreground font-medium",
        badge: "You are here",
      };
    case "next":
      return {
        dot: "bg-background text-foreground border-foreground",
        label: "text-foreground",
        badge: "Next step",
      };
    default:
      return {
        dot: "bg-background text-muted-foreground border-hairline",
        label: "text-muted-foreground",
        badge: "",
      };
  }
}

export function ResearchJourney() {
  return (
    <section
      aria-label="Research Journey"
      className="rounded-2xl border border-hairline bg-background/60 p-6 lg:p-7"
    >
      <header className="mb-6 flex items-end justify-between gap-4">
        <div>
          <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
            Research journey
          </div>
          <h2 className="font-display mt-1 text-lg text-foreground">Where you are in the workflow</h2>
        </div>
        <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
          Sources → Projects
        </span>
      </header>

      {/* Desktop: horizontal rail */}
      <ol className="hidden md:grid" style={{ gridTemplateColumns: `repeat(${STAGES.length}, minmax(0, 1fr))` }}>
        {STAGES.map((s, i) => {
          const styles = stageStyles(s.state);
          const Icon = s.icon;
          return (
            <li key={s.id} className="relative flex flex-col items-center text-center">
              {i < STAGES.length - 1 ? (
                <span
                  aria-hidden
                  className={cn(
                    "absolute left-1/2 top-5 h-px w-full",
                    s.state === "complete" ? "bg-foreground/70" : "bg-hairline",
                  )}
                />
              ) : null}
              <Link
                to={s.to as never}
                className={cn(
                  "relative z-10 grid h-10 w-10 place-items-center rounded-full border transition",
                  styles.dot,
                )}
                aria-label={s.label}
              >
                {s.state === "complete" ? <Check className="h-4 w-4" /> : <Icon className="h-4 w-4" />}
              </Link>
              <div className={cn("mt-3 px-2 text-xs leading-tight", styles.label)}>{s.label}</div>
              {styles.badge ? (
                <div className="mt-1 font-mono text-[9px] uppercase tracking-[0.18em] text-muted-foreground">
                  {styles.badge}
                </div>
              ) : null}
            </li>
          );
        })}
      </ol>

      {/* Mobile: vertical list */}
      <ol className="md:hidden space-y-3">
        {STAGES.map((s) => {
          const styles = stageStyles(s.state);
          const Icon = s.icon;
          return (
            <li key={s.id}>
              <Link
                to={s.to as never}
                className="flex items-center gap-3 rounded-lg border border-hairline p-3 transition hover:bg-secondary"
              >
                <span className={cn("grid h-8 w-8 place-items-center rounded-full border", styles.dot)}>
                  {s.state === "complete" ? <Check className="h-4 w-4" /> : <Icon className="h-4 w-4" />}
                </span>
                <div className="min-w-0 flex-1">
                  <div className={cn("truncate text-sm", styles.label)}>{s.label}</div>
                  {styles.badge ? (
                    <div className="font-mono text-[9px] uppercase tracking-[0.18em] text-muted-foreground">
                      {styles.badge}
                    </div>
                  ) : null}
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground" />
              </Link>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
