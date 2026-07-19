/**
 * Barrel — client-safe service entry point. Server-only implementations
 * (search/fetch/health) call server functions so provider modules stay
 * out of the client bundle.
 */

import {
  fetchSourceRecords,
  providersHealth,
  searchSingleSource,
  unifiedSearch,
} from "../functions/sources.functions";
import type {
  NormalizedRecord,
  SourceHealthReport,
  SourceId,
  SourceRecordRef,
  SourceSearchPage,
  UnifiedSearchQuery,
  UnifiedSearchResult,
} from "../types";

export interface IUnifiedSearchClient {
  search(query: UnifiedSearchQuery): Promise<UnifiedSearchResult>;
  searchSingle(source: SourceId, query: UnifiedSearchQuery): Promise<SourceSearchPage>;
}

export interface IUnifiedFetchClient {
  fetchMany(refs: readonly SourceRecordRef[]): Promise<NormalizedRecord[]>;
}

export interface IUnifiedHealthClient {
  checkAll(): Promise<SourceHealthReport[]>;
}

export const UnifiedSearchClient: IUnifiedSearchClient = {
  search: (query) => unifiedSearch({ data: { ...query, sources: query.sources ? [...query.sources] : undefined } }),
  searchSingle: (source, query) =>
    searchSingleSource({ data: { ...query, sources: query.sources ? [...query.sources] : undefined, source } }),
};

export const UnifiedFetchClient: IUnifiedFetchClient = {
  fetchMany: (refs) => fetchSourceRecords({ data: { refs: [...refs] } }),
};

export const UnifiedHealthClient: IUnifiedHealthClient = {
  checkAll: () => providersHealth(),
};

export { ProviderManager } from "./provider-manager";
