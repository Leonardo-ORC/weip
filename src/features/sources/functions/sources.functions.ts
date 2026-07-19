/**
 * Server functions exposing scientific source providers to the client.
 * Providers stay server-side; env-based configuration never reaches the
 * browser bundle.
 */

import { createServerFn } from "@tanstack/react-start";
import type {
  NormalizedRecord,
  SourceHealthReport,
  SourceId,
  SourceSearchPage,
  UnifiedSearchQuery,
  UnifiedSearchResult,
} from "../types";

const ALL_SOURCES: SourceId[] = ["pubmed", "clinicaltrials", "openalex"];

interface UnifiedSearchInput {
  term?: string;
  author?: string;
  journal?: string;
  condition?: string;
  drug?: string;
  disease?: string;
  yearFrom?: number;
  yearTo?: number;
  sources?: SourceId[];
  page?: number;
  pageSize?: number;
  sort?: UnifiedSearchQuery["sort"];
}

function normalizeQuery(input: UnifiedSearchInput): UnifiedSearchQuery {
  const validSources = new Set<SourceId>(ALL_SOURCES);
  const sources = (input.sources ?? ALL_SOURCES).filter((s): s is SourceId =>
    validSources.has(s as SourceId),
  );
  return {
    term: String(input.term ?? "").slice(0, 512).trim(),
    author: input.author ? String(input.author).slice(0, 200) : undefined,
    journal: input.journal ? String(input.journal).slice(0, 200) : undefined,
    condition: input.condition ? String(input.condition).slice(0, 200) : undefined,
    drug: input.drug ? String(input.drug).slice(0, 200) : undefined,
    disease: input.disease ? String(input.disease).slice(0, 200) : undefined,
    yearFrom: Number.isFinite(input.yearFrom) ? Number(input.yearFrom) : undefined,
    yearTo: Number.isFinite(input.yearTo) ? Number(input.yearTo) : undefined,
    sources: sources.length ? sources : ALL_SOURCES,
    page: Math.max(1, Number(input.page ?? 1)),
    pageSize: Math.min(50, Math.max(1, Number(input.pageSize ?? 15))),
    sort: input.sort === "date" || input.sort === "citations" ? input.sort : "relevance",
  };
}

export const unifiedSearch = createServerFn({ method: "POST" })
  .inputValidator((input: UnifiedSearchInput) => normalizeQuery(input))
  .handler(async ({ data }): Promise<UnifiedSearchResult> => {
    const { ScientificSearchService } = await import("../services/search-service");
    return ScientificSearchService.search(data);
  });

export const searchSingleSource = createServerFn({ method: "POST" })
  .inputValidator((input: UnifiedSearchInput & { source: SourceId }) => ({
    query: normalizeQuery(input),
    source: input.source,
  }))
  .handler(async ({ data }): Promise<SourceSearchPage> => {
    const { ScientificSearchService } = await import("../services/search-service");
    return ScientificSearchService.searchSingle(data.source, data.query);
  });

export const fetchSourceRecords = createServerFn({ method: "POST" })
  .inputValidator(
    (input: { refs: { source: SourceId; externalId: string }[] }) => ({
      refs: Array.isArray(input.refs)
        ? input.refs
            .filter(
              (r) =>
                r &&
                typeof r.source === "string" &&
                typeof r.externalId === "string" &&
                r.externalId.trim().length > 0,
            )
            .slice(0, 50)
        : [],
    }),
  )
  .handler(async ({ data }): Promise<NormalizedRecord[]> => {
    const { ScientificFetchService } = await import("../services/fetch-service");
    return ScientificFetchService.fetchMany(data.refs);
  });

export const providersHealth = createServerFn({ method: "GET" }).handler(
  async (): Promise<SourceHealthReport[]> => {
    const { ProviderHealthService } = await import("../services/health-service");
    return ProviderHealthService.checkAll();
  },
);
