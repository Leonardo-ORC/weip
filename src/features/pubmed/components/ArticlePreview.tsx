import { BookOpen, CheckCircle2, ExternalLink, Plus, Users } from "lucide-react";
import { cn } from "@/lib/utils";
import type { PubMedArticle } from "../types";

interface Props {
  article: PubMedArticle;
  selected: boolean;
  imported: boolean;
  onToggleSelect: () => void;
  onOpen: () => void;
}

export function ArticlePreview({ article, selected, imported, onToggleSelect, onOpen }: Props) {
  const authors = article.authors.slice(0, 4).map((a) => a.name).join(", ");
  const extra = article.authors.length > 4 ? ` +${article.authors.length - 4}` : "";
  const summary = article.abstract
    ? article.abstract.length > 260
      ? `${article.abstract.slice(0, 257)}…`
      : article.abstract
    : "Abstract not available in PubMed metadata.";

  return (
    <article
      className={cn(
        "group grid gap-3 rounded-xl border p-4 transition",
        selected
          ? "border-ink/40 bg-secondary/40"
          : "border-hairline bg-background/40 hover:border-ink/30",
      )}
    >
      <header className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
            {article.articleType} · PMID {article.pmid}
            {article.publicationYear ? ` · ${article.publicationYear}` : ""}
          </div>
          <button
            type="button"
            onClick={onOpen}
            className="mt-1 text-left font-display text-base leading-snug tracking-tight text-foreground transition hover:text-ink"
          >
            {article.title}
          </button>
        </div>
        <div className="flex shrink-0 items-center gap-1.5">
          <a
            href={article.url}
            target="_blank"
            rel="noreferrer"
            className="grid h-8 w-8 place-items-center rounded-md border border-hairline text-muted-foreground transition hover:bg-secondary hover:text-foreground"
            aria-label="Open on PubMed"
          >
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
          <button
            type="button"
            onClick={onToggleSelect}
            disabled={imported}
            aria-pressed={selected}
            className={cn(
              "inline-flex h-8 items-center gap-1 rounded-md border px-3 text-xs transition",
              imported
                ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                : selected
                  ? "border-ink/40 bg-ink text-background"
                  : "border-hairline text-foreground hover:bg-secondary",
            )}
          >
            {imported ? (
              <>
                <CheckCircle2 className="h-3.5 w-3.5" /> Imported
              </>
            ) : selected ? (
              "Selected"
            ) : (
              <>
                <Plus className="h-3.5 w-3.5" /> Select
              </>
            )}
          </button>
        </div>
      </header>

      <p className="text-xs leading-relaxed text-muted-foreground">{summary}</p>

      <footer className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-muted-foreground">
        <span className="inline-flex items-center gap-1">
          <BookOpen className="h-3 w-3" /> {article.journal.title}
        </span>
        <span className="inline-flex items-center gap-1">
          <Users className="h-3 w-3" /> {authors || "Unknown authors"}
          {extra}
        </span>
        {article.meshTerms.slice(0, 3).map((m) => (
          <span
            key={m}
            className="rounded-full border border-hairline bg-background/50 px-2 py-0.5 text-[10px] uppercase tracking-[0.18em]"
          >
            {m}
          </span>
        ))}
      </footer>
    </article>
  );
}
