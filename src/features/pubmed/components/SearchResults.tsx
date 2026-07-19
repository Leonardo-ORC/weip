import { ArrowLeft, ArrowRight } from "lucide-react";
import type { PubMedArticle, PubMedSearchPage } from "../types";
import { ArticlePreview } from "./ArticlePreview";
import { PubMedEmptyState, PubMedErrorState } from "./ErrorStates";
import { PubMedSkeletonList } from "./LoadingStates";

interface Props {
  page: PubMedSearchPage | undefined;
  articles: PubMedArticle[];
  loading: boolean;
  error: unknown;
  selectedIds: string[];
  importedIds: string[];
  onToggleSelect: (id: string) => void;
  onOpen: (id: string) => void;
  onPageChange: (next: number) => void;
  onRetry: () => void;
}

export function SearchResults({
  page,
  articles,
  loading,
  error,
  selectedIds,
  importedIds,
  onToggleSelect,
  onOpen,
  onPageChange,
  onRetry,
}: Props) {
  if (error) {
    return (
      <PubMedErrorState
        title="PubMed request failed"
        message={error instanceof Error ? error.message : "Try again in a moment."}
        onRetry={onRetry}
      />
    );
  }

  if (loading && !articles.length) {
    return <PubMedSkeletonList count={4} />;
  }

  if (!page) {
    return (
      <PubMedEmptyState
        title="Search PubMed"
        description="Enter a keyword, author or journal to retrieve live scientific articles."
      />
    );
  }

  if (!articles.length) {
    return (
      <PubMedEmptyState
        title="No results"
        description="No articles matched this query. Refine keywords or expand the year range."
      />
    );
  }

  const totalPages = Math.max(1, Math.ceil(page.total / page.pageSize));
  const prevDisabled = page.page <= 1 || loading;
  const nextDisabled = page.page >= totalPages || loading;

  return (
    <div className="grid gap-4">
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>
          <strong className="font-display text-sm text-foreground">
            {page.total.toLocaleString()}
          </strong>{" "}
          result{page.total === 1 ? "" : "s"} · page {page.page} of {totalPages}
        </span>
        <span className="font-mono uppercase tracking-[0.18em]">Live · PubMed</span>
      </div>

      <div className="grid gap-3">
        {articles.map((article) => (
          <ArticlePreview
            key={article.id}
            article={article}
            selected={selectedIds.includes(article.pmid)}
            imported={importedIds.includes(article.id)}
            onToggleSelect={() => onToggleSelect(article.pmid)}
            onOpen={() => onOpen(article.pmid)}
          />
        ))}
      </div>

      <div className="flex items-center justify-end gap-2">
        <button
          type="button"
          disabled={prevDisabled}
          onClick={() => onPageChange(page.page - 1)}
          className="inline-flex h-9 items-center gap-1.5 rounded-md border border-hairline px-3 text-xs text-foreground transition hover:bg-secondary disabled:opacity-40"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Previous
        </button>
        <button
          type="button"
          disabled={nextDisabled}
          onClick={() => onPageChange(page.page + 1)}
          className="inline-flex h-9 items-center gap-1.5 rounded-md border border-hairline px-3 text-xs text-foreground transition hover:bg-secondary disabled:opacity-40"
        >
          Next <ArrowRight className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}
