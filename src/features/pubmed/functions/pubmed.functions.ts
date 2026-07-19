/**
 * Server functions exposing the PubMed provider to the client.
 * The provider (and any API key) remain server-side only.
 */

import { createServerFn } from "@tanstack/react-start";
import type {
  PubMedArticle,
  PubMedSearchPage,
  PubMedSearchQuery,
  PubMedSortOrder,
} from "../types";

interface SearchInput {
  term: string;
  author?: string;
  journal?: string;
  yearFrom?: number;
  yearTo?: number;
  page?: number;
  pageSize?: number;
  sort?: PubMedSortOrder;
}

function normalizeQuery(input: SearchInput): PubMedSearchQuery {
  const pageSize = Math.min(Math.max(Number(input.pageSize ?? 20), 1), 50);
  const page = Math.max(Number(input.page ?? 1), 1);
  const sort: PubMedSortOrder = input.sort === "pub_date" ? "pub_date" : "relevance";
  return {
    term: String(input.term ?? "").slice(0, 512),
    author: input.author ? String(input.author).slice(0, 200) : undefined,
    journal: input.journal ? String(input.journal).slice(0, 200) : undefined,
    yearFrom: Number.isFinite(input.yearFrom) ? Number(input.yearFrom) : undefined,
    yearTo: Number.isFinite(input.yearTo) ? Number(input.yearTo) : undefined,
    page,
    pageSize,
    sort,
  };
}

export const searchPubMed = createServerFn({ method: "POST" })
  .inputValidator((input: SearchInput) => normalizeQuery(input))
  .handler(async ({ data }): Promise<PubMedSearchPage> => {
    const { PubMedProvider } = await import("../provider/pubmed-provider");
    return PubMedProvider.search(data);
  });

export const fetchPubMedArticles = createServerFn({ method: "POST" })
  .inputValidator((input: { ids: string[]; includeAbstracts?: boolean }) => ({
    ids: Array.isArray(input.ids)
      ? input.ids
          .map((id) => String(id).trim())
          .filter((id) => /^\d{1,12}$/.test(id))
          .slice(0, 50)
      : [],
    includeAbstracts: input.includeAbstracts !== false,
  }))
  .handler(async ({ data }): Promise<PubMedArticle[]> => {
    const { PubMedProvider } = await import("../provider/pubmed-provider");
    return PubMedProvider.fetchArticles(data.ids, {
      includeAbstracts: data.includeAbstracts,
    });
  });
