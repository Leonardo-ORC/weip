/**
 * PubMedSource — adapts the existing PubMedProvider (kept intact) to the
 * generic ScientificSourceProvider contract without modifying its
 * workflow.
 */

import {
  PubMedProvider,
  type IPubMedProvider,
} from "@/features/pubmed/provider/pubmed-provider";
import type {
  NormalizedRecord,
  ProviderMetadata,
  ScientificSourceProvider,
  SourceHealthReport,
  SourceSearchPage,
  SourceStudyType,
  UnifiedSearchQuery,
} from "../types";
import { classifyStudyType, toProviderError } from "./shared";

const METADATA: ProviderMetadata = {
  id: "pubmed",
  name: "PubMed",
  shortName: "PubMed",
  description: "US National Library of Medicine — biomedical literature.",
  homepage: "https://pubmed.ncbi.nlm.nih.gov/",
  apiReference: "https://www.ncbi.nlm.nih.gov/books/NBK25497/",
  badgeAccent: "indigo",
  capabilities: ["abstracts", "authors", "journals", "mesh-terms"],
};

function pubmedStudyType(types: readonly string[]): SourceStudyType {
  return classifyStudyType(types);
}

function toRecord(
  article: Awaited<ReturnType<IPubMedProvider["fetchArticles"]>>[number],
): NormalizedRecord {
  return {
    source: "pubmed",
    externalId: article.pmid,
    title: article.title,
    abstract: article.abstract ?? null,
    authors: article.authors.map((a) => a.name),
    journal: article.journal.title ?? null,
    publication: article.journal.title ?? null,
    publicationDate: article.publicationDate || null,
    publicationYear: article.publicationYear || null,
    studyType: pubmedStudyType(article.publicationTypes),
    keywords: [...article.meshTerms, ...article.keywords],
    language: article.language || null,
    url: article.url,
    doi: article.doi ?? null,
    status: null,
    citationCount: null,
    providerMetadata: {
      pmid: article.pmid,
      publicationTypes: article.publicationTypes,
      meshTerms: article.meshTerms,
      volume: article.journal.volume,
      issue: article.journal.issue,
      issn: article.journal.issn,
    },
  };
}

export const PubMedSource: ScientificSourceProvider = {
  metadata: METADATA,

  async search(query: UnifiedSearchQuery): Promise<SourceSearchPage> {
    const start = performance.now();
    try {
      const term = [query.term, query.condition, query.drug, query.disease]
        .filter((s): s is string => Boolean(s && s.trim()))
        .join(" ")
        .trim();
      const page = await PubMedProvider.search({
        term,
        author: query.author,
        journal: query.journal,
        yearFrom: query.yearFrom,
        yearTo: query.yearTo,
        page: query.page,
        pageSize: query.pageSize,
        sort: query.sort === "date" ? "pub_date" : "relevance",
      });
      const articles = page.ids.length
        ? await PubMedProvider.fetchArticles(page.ids)
        : [];
      return {
        source: "pubmed",
        total: page.total,
        page: page.page,
        pageSize: page.pageSize,
        records: articles.map(toRecord),
        fetchedAt: new Date().toISOString(),
      };
    } catch (cause) {
      return {
        source: "pubmed",
        total: 0,
        page: query.page,
        pageSize: query.pageSize,
        records: [],
        fetchedAt: new Date().toISOString(),
        error: toProviderError("pubmed", cause),
      };
    } finally {
      void start;
    }
  },

  async fetchById(externalId): Promise<NormalizedRecord | null> {
    const [article] = await PubMedProvider.fetchArticles([externalId]);
    return article ? toRecord(article) : null;
  },

  normalize: (record) => record,

  async healthCheck(): Promise<SourceHealthReport> {
    const start = performance.now();
    try {
      const page = await PubMedProvider.search({
        term: "menopause",
        page: 1,
        pageSize: 1,
        sort: "relevance",
      });
      return {
        source: "pubmed",
        status: page.total >= 0 ? "connected" : "degraded",
        responseTimeMs: Math.round(performance.now() - start),
        checkedAt: new Date().toISOString(),
      };
    } catch (cause) {
      const err = toProviderError("pubmed", cause);
      return {
        source: "pubmed",
        status: "disconnected",
        responseTimeMs: Math.round(performance.now() - start),
        checkedAt: new Date().toISOString(),
        message: err.message,
      };
    }
  },

  providerMetadata: () => METADATA,
};
