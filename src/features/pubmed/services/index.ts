/**
 * Interface-first service layer for PubMed. Consumers depend on these
 * contracts, not on the transport. Server functions are the current
 * implementation; a REST or MCP backend can replace them transparently.
 */

import {
  fetchPubMedArticles,
  searchPubMed,
} from "../functions/pubmed.functions";
import { createMemoryCache } from "../cache";
import { EvidenceMapper } from "../mappers/pubmed-to-evidence";
import { runIngestionPipeline } from "../pipeline";
import { PubMedImportStore } from "../store/import-store";
import type {
  PipelineExecutionResult,
} from "../pipeline";
import type {
  PubMedArticle,
  PubMedSearchPage,
  PubMedSearchQuery,
} from "../types";

export interface IPubMedSearchService {
  search(query: PubMedSearchQuery): Promise<PubMedSearchPage>;
}

export interface IPubMedFetchService {
  fetchArticles(ids: readonly string[]): Promise<PubMedArticle[]>;
  fetchArticle(id: string): Promise<PubMedArticle | undefined>;
  invalidate(): void;
}

export interface IEvidenceProcessingService {
  ingestFromIds(
    ids: readonly string[],
    onUpdate?: (result: PipelineExecutionResult["state"]) => void,
  ): Promise<PipelineExecutionResult>;
}

export interface IEvidenceNormalizer {
  normalize(article: PubMedArticle): PubMedArticle;
}

const searchCache = createMemoryCache<PubMedSearchPage>(2 * 60_000);
const articleCache = createMemoryCache<PubMedArticle>(10 * 60_000);

function searchKey(q: PubMedSearchQuery): string {
  return JSON.stringify([
    q.term,
    q.author ?? "",
    q.journal ?? "",
    q.yearFrom ?? "",
    q.yearTo ?? "",
    q.page,
    q.pageSize,
    q.sort,
  ]);
}

export const PubMedSearchService: IPubMedSearchService = {
  async search(query) {
    const key = searchKey(query);
    const cached = searchCache.get(key);
    if (cached) return cached;
    const page = await searchPubMed({ data: query });
    searchCache.set(key, page);
    return page;
  },
};

export const PubMedFetchService: IPubMedFetchService = {
  async fetchArticles(ids) {
    const missing: string[] = [];
    const known: PubMedArticle[] = [];
    for (const id of ids) {
      const cached = articleCache.get(id);
      if (cached) known.push(cached);
      else missing.push(id);
    }
    if (missing.length) {
      const fetched = await fetchPubMedArticles({ data: { ids: missing } });
      for (const article of fetched) {
        articleCache.set(article.pmid, article);
        known.push(article);
      }
    }
    // Preserve the requested ordering.
    const map = new Map(known.map((a) => [a.pmid, a] as const));
    return ids.map((id) => map.get(id)).filter((a): a is PubMedArticle => Boolean(a));
  },
  async fetchArticle(id) {
    const [article] = await this.fetchArticles([id]);
    return article;
  },
  invalidate() {
    articleCache.clear();
    searchCache.clear();
  },
};

export const EvidenceNormalizer: IEvidenceNormalizer = {
  normalize(article) {
    return {
      ...article,
      title: article.title.replace(/\s+/g, " ").trim(),
      publicationYear: article.publicationYear || new Date().getFullYear(),
      language: article.language || "en",
    };
  },
};

export const EvidenceProcessingService: IEvidenceProcessingService = {
  async ingestFromIds(ids, onUpdate) {
    return runIngestionPipeline({
      onUpdate,
      fetch: async () => PubMedFetchService.fetchArticles(ids),
    });
  },
};

export const CacheService = {
  invalidateAll(): void {
    searchCache.clear();
    articleCache.clear();
  },
  invalidateSearch(): void {
    searchCache.clear();
  },
  invalidateArticles(): void {
    articleCache.clear();
  },
};

export { EvidenceMapper, PubMedImportStore };
