/**
 * OpenAlexSource — OpenAlex Works API adapter.
 *
 *   GET /works?search=&per-page=&page=&mailto=
 *   GET /works/{id}
 *
 * Server-side only. Reads OPENALEX_BASE_URL and optional OPENALEX_API_KEY.
 */

import type {
  NormalizedRecord,
  ProviderMetadata,
  ScientificSourceProvider,
  SourceHealthReport,
  SourceSearchPage,
  SourceStudyType,
  UnifiedSearchQuery,
} from "../types";
import { classifyHttp, fetchWithTimeout, toProviderError } from "./shared";

const DEFAULT_BASE_URL = "https://api.openalex.org";

const METADATA: ProviderMetadata = {
  id: "openalex",
  name: "OpenAlex",
  shortName: "OpenAlex",
  description: "Open catalog of scholarly works, authors, institutions and concepts.",
  homepage: "https://openalex.org/",
  apiReference: "https://docs.openalex.org/",
  badgeAccent: "amber",
  capabilities: ["works", "authors", "institutions", "concepts", "citations", "open-access"],
};

function baseUrl(): string {
  return (process.env.OPENALEX_BASE_URL || DEFAULT_BASE_URL).replace(/\/$/, "");
}

interface OaAuthorship {
  author?: { display_name?: string; id?: string };
  institutions?: Array<{ display_name?: string; country_code?: string }>;
}
interface OaConcept {
  display_name?: string;
  score?: number;
}
interface OaWork {
  id?: string;
  doi?: string;
  title?: string;
  display_name?: string;
  publication_date?: string;
  publication_year?: number;
  type?: string;
  cited_by_count?: number;
  language?: string;
  authorships?: OaAuthorship[];
  primary_location?: {
    source?: { display_name?: string; issn_l?: string; type?: string };
    landing_page_url?: string;
  };
  best_oa_location?: { landing_page_url?: string };
  open_access?: { is_oa?: boolean; oa_status?: string };
  concepts?: OaConcept[];
  keywords?: Array<{ display_name?: string; keyword?: string }>;
  abstract_inverted_index?: Record<string, number[]>;
}

interface OaSearchResponse {
  results?: OaWork[];
  meta?: { count?: number; page?: number; per_page?: number };
}

function reconstructAbstract(idx: OaWork["abstract_inverted_index"]): string | null {
  if (!idx) return null;
  const positions: Array<[number, string]> = [];
  for (const [word, list] of Object.entries(idx)) {
    for (const p of list) positions.push([p, word]);
  }
  if (!positions.length) return null;
  positions.sort((a, b) => a[0] - b[0]);
  return positions.map(([, w]) => w).join(" ");
}

function mapType(t?: string): SourceStudyType {
  const x = (t ?? "").toLowerCase();
  if (x.includes("review")) return "systematic-review";
  if (x.includes("meta")) return "meta-analysis";
  if (x.includes("preprint")) return "preprint";
  if (x.includes("case-report")) return "case-report";
  if (x.includes("clinical-trial")) return "clinical-trial";
  if (x.includes("article") || x.includes("journal")) return "article";
  return "article";
}

function extractExternalId(id?: string): string {
  if (!id) return "";
  return id.replace(/^https?:\/\/openalex\.org\//i, "");
}

function normalize(work: OaWork): NormalizedRecord {
  const externalId = extractExternalId(work.id);
  const title = work.title || work.display_name || "Untitled work";
  const authors = (work.authorships ?? [])
    .map((a) => a.author?.display_name)
    .filter((n): n is string => Boolean(n));
  const journal = work.primary_location?.source?.display_name ?? null;
  const url =
    work.primary_location?.landing_page_url ||
    work.best_oa_location?.landing_page_url ||
    (work.id ?? null);
  const keywords = [
    ...(work.keywords ?? [])
      .map((k) => k.display_name ?? k.keyword)
      .filter((k): k is string => Boolean(k)),
    ...(work.concepts ?? [])
      .filter((c) => (c.score ?? 0) >= 0.3)
      .map((c) => c.display_name)
      .filter((c): c is string => Boolean(c))
      .slice(0, 6),
  ];

  return {
    source: "openalex",
    externalId,
    title,
    abstract: reconstructAbstract(work.abstract_inverted_index),
    authors,
    journal,
    publication: journal,
    publicationDate: work.publication_date ?? null,
    publicationYear: work.publication_year ?? null,
    studyType: mapType(work.type),
    keywords,
    language: work.language ?? null,
    url,
    doi: work.doi ? work.doi.replace(/^https?:\/\/doi\.org\//i, "") : null,
    status: work.open_access?.oa_status ?? null,
    citationCount: work.cited_by_count ?? null,
    providerMetadata: {
      openalexId: externalId,
      type: work.type ?? null,
      openAccess: work.open_access ?? null,
      institutions: Array.from(
        new Set(
          (work.authorships ?? [])
            .flatMap((a) => a.institutions ?? [])
            .map((i) => i.display_name)
            .filter((n): n is string => Boolean(n)),
        ),
      ),
      concepts: (work.concepts ?? []).slice(0, 8).map((c) => ({
        name: c.display_name,
        score: c.score,
      })),
    },
  };
}

function buildFilter(query: UnifiedSearchQuery): string | null {
  const parts: string[] = [];
  if (query.yearFrom) parts.push(`from_publication_date:${query.yearFrom}-01-01`);
  if (query.yearTo) parts.push(`to_publication_date:${query.yearTo}-12-31`);
  if (query.author) parts.push(`author.display_name.search:${query.author}`);
  return parts.length ? parts.join(",") : null;
}

function withAuth(params: URLSearchParams): URLSearchParams {
  const mail = process.env.PUBMED_EMAIL;
  if (mail) params.set("mailto", mail);
  const key = process.env.OPENALEX_API_KEY;
  if (key) params.set("api_key", key);
  return params;
}

function buildSearch(q: UnifiedSearchQuery): string {
  return [q.term, q.condition, q.drug, q.disease, q.journal]
    .filter((s): s is string => Boolean(s && s.trim()))
    .join(" ")
    .trim();
}

export const OpenAlexSource: ScientificSourceProvider = {
  metadata: METADATA,

  async search(query: UnifiedSearchQuery): Promise<SourceSearchPage> {
    const search = buildSearch(query);
    if (!search) {
      return {
        source: "openalex",
        total: 0,
        page: query.page,
        pageSize: query.pageSize,
        records: [],
        fetchedAt: new Date().toISOString(),
      };
    }
    const params = withAuth(
      new URLSearchParams({
        search,
        "per-page": String(Math.min(query.pageSize, 50)),
        page: String(query.page),
      }),
    );
    if (query.sort === "citations") params.set("sort", "cited_by_count:desc");
    else if (query.sort === "date") params.set("sort", "publication_date:desc");
    else params.set("sort", "relevance_score:desc");
    const filter = buildFilter(query);
    if (filter) params.set("filter", filter);

    const url = `${baseUrl()}/works?${params.toString()}`;
    try {
      const response = await fetchWithTimeout(url, {
        headers: { accept: "application/json" },
      });
      const httpErr = classifyHttp("openalex", response.status);
      if (httpErr) throw httpErr;
      const data = (await response.json()) as OaSearchResponse;
      const results = Array.isArray(data.results) ? data.results : [];
      return {
        source: "openalex",
        total: data.meta?.count ?? results.length,
        page: query.page,
        pageSize: query.pageSize,
        records: results.map(normalize),
        fetchedAt: new Date().toISOString(),
      };
    } catch (cause) {
      return {
        source: "openalex",
        total: 0,
        page: query.page,
        pageSize: query.pageSize,
        records: [],
        fetchedAt: new Date().toISOString(),
        error:
          (cause as { source?: string }).source === "openalex"
            ? (cause as never)
            : toProviderError("openalex", cause),
      };
    }
  },

  async fetchById(externalId): Promise<NormalizedRecord | null> {
    if (!externalId) return null;
    const params = withAuth(new URLSearchParams());
    const qs = params.toString();
    const url = `${baseUrl()}/works/${encodeURIComponent(externalId)}${qs ? `?${qs}` : ""}`;
    try {
      const response = await fetchWithTimeout(url, {
        headers: { accept: "application/json" },
      });
      const httpErr = classifyHttp("openalex", response.status);
      if (httpErr) throw httpErr;
      const data = (await response.json()) as OaWork;
      return normalize(data);
    } catch {
      return null;
    }
  },

  normalize: (record) => record,

  async healthCheck(): Promise<SourceHealthReport> {
    const start = performance.now();
    try {
      const params = withAuth(new URLSearchParams({ search: "menopause", "per-page": "1" }));
      const response = await fetchWithTimeout(
        `${baseUrl()}/works?${params.toString()}`,
        { headers: { accept: "application/json" } },
        8_000,
      );
      const ok = response.ok;
      return {
        source: "openalex",
        status: ok ? "connected" : "degraded",
        responseTimeMs: Math.round(performance.now() - start),
        checkedAt: new Date().toISOString(),
        message: ok ? undefined : `HTTP ${response.status}`,
      };
    } catch (cause) {
      return {
        source: "openalex",
        status: "disconnected",
        responseTimeMs: Math.round(performance.now() - start),
        checkedAt: new Date().toISOString(),
        message: toProviderError("openalex", cause).message,
      };
    }
  },

  providerMetadata: () => METADATA,
};
