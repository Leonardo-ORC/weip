import { Link } from "@tanstack/react-router";
import { ArrowRight, Radio } from "lucide-react";
import { DashboardWidget } from "@/features/dashboard";
import { usePubMedImports } from "../hooks/use-pubmed-imports";

const RECENT_SEARCHES_KEY = "weip.pubmed.recentSearches";

function readRecentSearches(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(RECENT_SEARCHES_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    return Array.isArray(parsed) ? parsed.filter((v): v is string => typeof v === "string") : [];
  } catch {
    return [];
  }
}

export function PubMedLiveWidget() {
  const { records } = usePubMedImports();
  const recent = readRecentSearches().slice(0, 4);

  return (
    <DashboardWidget
      eyebrow="Live source"
      title="PubMed connected"
      subtitle="Real scientific literature streaming into Evidence."
      action={
        <Link
          to="/app/pubmed"
          className="inline-flex items-center gap-1 rounded-full border border-hairline px-3 py-1 text-xs text-foreground transition hover:bg-secondary"
        >
          Open PubMed <ArrowRight className="h-3 w-3" />
        </Link>
      }
    >
      <div className="grid gap-5 lg:grid-cols-3">
        <div className="grid grid-cols-3 gap-3 lg:col-span-3">
          <Stat label="Live" value="PubMed" tone="live" />
          <Stat label="Articles imported" value={String(records.length)} />
          <Stat label="Pipeline" value="6 stages" />
        </div>

        <div className="lg:col-span-2">
          <div className="mb-2 font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
            Latest imports
          </div>
          {records.length === 0 ? (
            <div className="rounded-lg border border-dashed border-hairline p-4 text-xs text-muted-foreground">
              No imports yet — start a search to populate the Evidence Workspace with live articles.
            </div>
          ) : (
            <ul className="grid gap-2">
              {records.slice(0, 4).map((r) => (
                <li
                  key={r.id}
                  className="flex items-center gap-3 rounded-lg border border-hairline bg-background/40 p-2.5"
                >
                  <div className="grid h-7 w-7 place-items-center rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                    <Radio className="h-3.5 w-3.5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-xs font-medium text-foreground">
                      {r.article.title}
                    </div>
                    <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                      PMID {r.article.pmid} · {r.article.journal.title}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div>
          <div className="mb-2 font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
            Recent searches
          </div>
          {recent.length === 0 ? (
            <div className="rounded-lg border border-dashed border-hairline p-3 text-[11px] text-muted-foreground">
              Search history appears here after your first PubMed query.
            </div>
          ) : (
            <ul className="grid gap-1.5">
              {recent.map((q) => (
                <li
                  key={q}
                  className="truncate rounded-md px-2 py-1.5 text-xs text-foreground hover:bg-secondary/60"
                  title={q}
                >
                  {q}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </DashboardWidget>
  );
}

function Stat({ label, value, tone }: { label: string; value: string; tone?: "live" }) {
  return (
    <div className="rounded-xl border border-hairline bg-background/40 p-3">
      <div className="flex items-center gap-1.5">
        {tone === "live" ? (
          <span className="inline-flex h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" aria-hidden />
        ) : null}
        <div className="font-display text-xl tracking-tight">{value}</div>
      </div>
      <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
        {label}
      </div>
    </div>
  );
}

export function persistRecentSearch(term: string): void {
  if (typeof window === "undefined") return;
  const trimmed = term.trim();
  if (!trimmed) return;
  const current = readRecentSearches().filter((t) => t !== trimmed);
  const next = [trimmed, ...current].slice(0, 8);
  try {
    window.localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(next));
  } catch {
    // ignore quota errors
  }
}
