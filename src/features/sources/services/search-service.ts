/**
 * ScientificSearchService.
 *
 * Runs a UnifiedSearchQuery across every configured ScientificSourceProvider
 * in parallel, merges the responses into a single unified list and sorts
 * them according to the query.
 */

import { ScientificSourceRegistry } from "../registry";
import type {
  NormalizedRecord,
  SourceId,
  SourceSearchPage,
  UnifiedSearchQuery,
  UnifiedSearchResult,
} from "../types";

function sortRecords(
  sort: UnifiedSearchQuery["sort"],
  records: readonly NormalizedRecord[],
): NormalizedRecord[] {
  const copy = [...records];
  if (sort === "date") {
    copy.sort((a, b) => (b.publicationYear ?? 0) - (a.publicationYear ?? 0));
  } else if (sort === "citations") {
    copy.sort((a, b) => (b.citationCount ?? 0) - (a.citationCount ?? 0));
  }
  // Relevance = provider order preserved via interleave (below).
  return copy;
}

function interleave(pages: readonly SourceSearchPage[]): NormalizedRecord[] {
  const out: NormalizedRecord[] = [];
  const cursors = pages.map(() => 0);
  let done = false;
  while (!done) {
    done = true;
    for (let i = 0; i < pages.length; i++) {
      const page = pages[i]!;
      const cursor = cursors[i]!;
      if (cursor < page.records.length) {
        out.push(page.records[cursor]!);
        cursors[i] = cursor + 1;
        done = false;
      }
    }
  }
  return out;
}

export interface IScientificSearchService {
  search(query: UnifiedSearchQuery): Promise<UnifiedSearchResult>;
  searchSingle(source: SourceId, query: UnifiedSearchQuery): Promise<SourceSearchPage>;
}

export const ScientificSearchService: IScientificSearchService = {
  async search(query) {
    const ids = (query.sources && query.sources.length
      ? query.sources
      : ScientificSourceRegistry.ids()) as readonly SourceId[];
    const providers = ids
      .map((id) => ScientificSourceRegistry.get(id))
      .filter((p): p is NonNullable<typeof p> => Boolean(p));

    const pages = await Promise.all(providers.map((p) => p.search(query)));
    const merged =
      query.sort === "relevance" ? interleave(pages) : sortRecords(query.sort, pages.flatMap((p) => p.records));
    const total = pages.reduce((n, p) => n + p.total, 0);
    return {
      query,
      pages,
      records: merged,
      total,
      fetchedAt: new Date().toISOString(),
    };
  },
  async searchSingle(source, query) {
    const provider = ScientificSourceRegistry.get(source);
    if (!provider) {
      return {
        source,
        total: 0,
        page: query.page,
        pageSize: query.pageSize,
        records: [],
        fetchedAt: new Date().toISOString(),
        error: {
          source,
          kind: "invalid-response",
          message: `Unknown provider: ${source}`,
          retryable: false,
        },
      };
    }
    return provider.search({ ...query, sources: [source] });
  },
};
