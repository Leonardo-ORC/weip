/**
 * PubMedProvider — low level HTTP access to NCBI E-utilities.
 *
 * Runs exclusively on the server (invoked from server functions) so the
 * API key never reaches the browser. All configuration is read from
 * environment variables.
 *
 * Endpoints:
 *   • esearch.fcgi  — resolve a query into PMID list
 *   • esummary.fcgi — bulk metadata (title, journal, dates, authors)
 *   • efetch.fcgi   — abstract text, MeSH terms, keywords (XML)
 */

import type {
  PubMedArticle,
  PubMedError,
  PubMedSearchPage,
  PubMedSearchQuery,
} from "../types";

const DEFAULT_BASE_URL = "https://eutils.ncbi.nlm.nih.gov/entrez/eutils";
const DEFAULT_TOOL = "weip";
const DEFAULT_TIMEOUT_MS = 15_000;

interface ProviderConfig {
  readonly baseUrl: string;
  readonly apiKey?: string;
  readonly tool: string;
  readonly email?: string;
}

function readConfig(): ProviderConfig {
  return {
    baseUrl: process.env.PUBMED_BASE_URL || DEFAULT_BASE_URL,
    apiKey: process.env.PUBMED_API_KEY || undefined,
    tool: process.env.PUBMED_TOOL_NAME || DEFAULT_TOOL,
    email: process.env.PUBMED_EMAIL || undefined,
  };
}

function buildTerm(q: PubMedSearchQuery): string {
  const parts: string[] = [];
  const base = q.term?.trim();
  if (base) parts.push(base);
  if (q.author?.trim()) parts.push(`${q.author.trim()}[Author]`);
  if (q.journal?.trim()) parts.push(`"${q.journal.trim()}"[Journal]`);
  const from = q.yearFrom;
  const to = q.yearTo;
  if (from || to) {
    const lo = from ?? 1900;
    const hi = to ?? new Date().getFullYear();
    parts.push(`("${lo}"[Date - Publication] : "${hi}"[Date - Publication])`);
  }
  return parts.length ? parts.join(" AND ") : "";
}

function withCommon(cfg: ProviderConfig, params: URLSearchParams): URLSearchParams {
  params.set("tool", cfg.tool);
  if (cfg.email) params.set("email", cfg.email);
  if (cfg.apiKey) params.set("api_key", cfg.apiKey);
  return params;
}

async function fetchWithTimeout(url: string, timeoutMs = DEFAULT_TIMEOUT_MS): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, { signal: controller.signal });
  } finally {
    clearTimeout(timer);
  }
}

function classifyHttp(status: number): PubMedError | null {
  if (status === 429) {
    return { kind: "rate-limit", message: "PubMed rate limit reached.", retryable: true };
  }
  if (status === 404) {
    return { kind: "not-found", message: "PubMed resource not found.", retryable: false };
  }
  if (status >= 500) {
    return { kind: "network", message: `PubMed server error (${status}).`, retryable: true };
  }
  if (status >= 400) {
    return { kind: "invalid-response", message: `PubMed rejected the request (${status}).`, retryable: false };
  }
  return null;
}

function toPubMedError(cause: unknown): PubMedError {
  if (cause instanceof DOMException && cause.name === "AbortError") {
    return { kind: "timeout", message: "PubMed request timed out.", retryable: true };
  }
  if (cause instanceof Error) {
    return { kind: "network", message: cause.message, retryable: true };
  }
  return { kind: "unknown", message: "Unknown PubMed error.", retryable: false };
}

// ─────────────────────────────────────────────────────────────────────────────
// esearch → PMID list + total count
// ─────────────────────────────────────────────────────────────────────────────

interface ESearchResponse {
  esearchresult?: {
    count?: string;
    idlist?: string[];
    querytranslation?: string;
    errorlist?: { phrasesnotfound?: string[] };
  };
}

export async function providerSearch(query: PubMedSearchQuery): Promise<PubMedSearchPage> {
  const cfg = readConfig();
  const term = buildTerm(query);
  if (!term) {
    return {
      ids: [],
      total: 0,
      page: query.page,
      pageSize: query.pageSize,
      sort: query.sort,
      query,
      fetchedAt: new Date().toISOString(),
    };
  }

  const retstart = Math.max(0, (query.page - 1) * query.pageSize);
  const params = withCommon(
    cfg,
    new URLSearchParams({
      db: "pubmed",
      term,
      retmode: "json",
      retmax: String(query.pageSize),
      retstart: String(retstart),
      sort: query.sort === "pub_date" ? "pub+date" : "relevance",
    }),
  );

  const url = `${cfg.baseUrl}/esearch.fcgi?${params.toString()}`;
  let response: Response;
  try {
    response = await fetchWithTimeout(url);
  } catch (cause) {
    throw toPubMedError(cause);
  }

  const httpErr = classifyHttp(response.status);
  if (httpErr) throw httpErr;

  let data: ESearchResponse;
  try {
    data = (await response.json()) as ESearchResponse;
  } catch (cause) {
    throw toPubMedError(cause);
  }

  const result = data.esearchresult;
  const ids = Array.isArray(result?.idlist) ? result!.idlist.filter(Boolean) : [];
  const total = Number(result?.count ?? 0) || 0;

  return {
    ids,
    total,
    page: query.page,
    pageSize: query.pageSize,
    sort: query.sort,
    query,
    translatedTerm: result?.querytranslation,
    fetchedAt: new Date().toISOString(),
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// esummary → metadata (used as a lightweight primary source)
// ─────────────────────────────────────────────────────────────────────────────

interface ESummaryEntry {
  uid?: string;
  title?: string;
  authors?: Array<{ name?: string }>;
  fulljournalname?: string;
  source?: string;
  issn?: string;
  volume?: string;
  issue?: string;
  pubdate?: string;
  epubdate?: string;
  sortpubdate?: string;
  lang?: string[];
  pubtype?: string[];
  articleids?: Array<{ idtype?: string; value?: string }>;
}

interface ESummaryResponse {
  result?: Record<string, ESummaryEntry | string[]> & { uids?: string[] };
}

async function providerSummary(ids: readonly string[]): Promise<Map<string, ESummaryEntry>> {
  const out = new Map<string, ESummaryEntry>();
  if (!ids.length) return out;

  const cfg = readConfig();
  const params = withCommon(
    cfg,
    new URLSearchParams({ db: "pubmed", id: ids.join(","), retmode: "json" }),
  );
  const url = `${cfg.baseUrl}/esummary.fcgi?${params.toString()}`;

  let response: Response;
  try {
    response = await fetchWithTimeout(url);
  } catch (cause) {
    throw toPubMedError(cause);
  }
  const httpErr = classifyHttp(response.status);
  if (httpErr) throw httpErr;

  let data: ESummaryResponse;
  try {
    data = (await response.json()) as ESummaryResponse;
  } catch (cause) {
    throw toPubMedError(cause);
  }

  const bag = data.result ?? {};
  for (const id of ids) {
    const entry = bag[id];
    if (entry && typeof entry === "object" && !Array.isArray(entry)) {
      out.set(id, entry as ESummaryEntry);
    }
  }
  return out;
}

// ─────────────────────────────────────────────────────────────────────────────
// efetch → abstract text + MeSH terms + keywords (XML)
// ─────────────────────────────────────────────────────────────────────────────

interface EfetchExtras {
  abstract?: string;
  meshTerms: string[];
  keywords: string[];
}

function decodeEntities(text: string): string {
  return text
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&#(\d+);/g, (_, n: string) => String.fromCharCode(Number(n)))
    .replace(/&amp;/g, "&");
}

function stripTags(xml: string): string {
  return decodeEntities(xml.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim());
}

function extractExtras(xml: string, pmid: string): EfetchExtras {
  // Isolate the <PubmedArticle> block for this PMID for safer regex scoping.
  const articleBlockRegex = new RegExp(
    `<PubmedArticle>[\\s\\S]*?<PMID[^>]*>${pmid}</PMID>[\\s\\S]*?</PubmedArticle>`,
  );
  const block = xml.match(articleBlockRegex)?.[0] ?? xml;

  const abstractParts: string[] = [];
  const absRegex = /<AbstractText[^>]*>([\s\S]*?)<\/AbstractText>/g;
  let m: RegExpExecArray | null;
  while ((m = absRegex.exec(block)) !== null) {
    const chunk = stripTags(m[1] ?? "");
    if (chunk) abstractParts.push(chunk);
  }
  const abstract = abstractParts.join("\n\n").trim() || undefined;

  const meshTerms: string[] = [];
  const meshRegex = /<DescriptorName[^>]*>([\s\S]*?)<\/DescriptorName>/g;
  while ((m = meshRegex.exec(block)) !== null) {
    const t = stripTags(m[1] ?? "");
    if (t) meshTerms.push(t);
  }

  const keywords: string[] = [];
  const kwRegex = /<Keyword[^>]*>([\s\S]*?)<\/Keyword>/g;
  while ((m = kwRegex.exec(block)) !== null) {
    const t = stripTags(m[1] ?? "");
    if (t) keywords.push(t);
  }

  return { abstract, meshTerms, keywords };
}

async function providerFetchExtras(ids: readonly string[]): Promise<Map<string, EfetchExtras>> {
  const out = new Map<string, EfetchExtras>();
  if (!ids.length) return out;

  const cfg = readConfig();
  const params = withCommon(
    cfg,
    new URLSearchParams({
      db: "pubmed",
      id: ids.join(","),
      retmode: "xml",
      rettype: "abstract",
    }),
  );
  const url = `${cfg.baseUrl}/efetch.fcgi?${params.toString()}`;

  let response: Response;
  try {
    response = await fetchWithTimeout(url);
  } catch (cause) {
    throw toPubMedError(cause);
  }
  const httpErr = classifyHttp(response.status);
  if (httpErr) throw httpErr;

  let xml: string;
  try {
    xml = await response.text();
  } catch (cause) {
    throw toPubMedError(cause);
  }

  for (const id of ids) {
    out.set(id, extractExtras(xml, id));
  }
  return out;
}

// ─────────────────────────────────────────────────────────────────────────────
// Assemble raw PubMedArticle records (no evidence normalization here)
// ─────────────────────────────────────────────────────────────────────────────

function parseYear(entry: ESummaryEntry): number {
  const raw = entry.sortpubdate || entry.pubdate || entry.epubdate || "";
  const y = Number((raw.match(/(\d{4})/) ?? [])[1]);
  return Number.isFinite(y) ? y : 0;
}

function buildArticle(
  pmid: string,
  entry: ESummaryEntry,
  extras: EfetchExtras | undefined,
): PubMedArticle {
  const doi = entry.articleids?.find((a) => a.idtype === "doi")?.value;
  const authors = (entry.authors ?? [])
    .map((a) => (a?.name ?? "").trim())
    .filter(Boolean)
    .map((name) => ({ name }));

  const journalTitle = entry.fulljournalname || entry.source || "Unknown journal";
  const pubtypes = Array.isArray(entry.pubtype) ? entry.pubtype.filter(Boolean) : [];
  const language = Array.isArray(entry.lang) && entry.lang.length ? entry.lang[0]! : "en";
  const publicationDate = entry.sortpubdate || entry.pubdate || entry.epubdate || "";

  return {
    id: `pubmed-${pmid}`,
    pmid,
    doi,
    title: (entry.title ?? "Untitled").replace(/\s+/g, " ").trim(),
    abstract: extras?.abstract,
    authors,
    journal: {
      title: journalTitle,
      issn: entry.issn,
      volume: entry.volume,
      issue: entry.issue,
    },
    publicationDate,
    publicationYear: parseYear(entry),
    keywords: extras?.keywords ?? [],
    meshTerms: extras?.meshTerms ?? [],
    language,
    articleType: pubtypes[0] ?? "Journal Article",
    publicationTypes: pubtypes,
    url: `https://pubmed.ncbi.nlm.nih.gov/${pmid}/`,
    source: "pubmed",
    fetchedAt: new Date().toISOString(),
  };
}

export async function providerFetchArticles(
  ids: readonly string[],
  options: { includeAbstracts?: boolean } = {},
): Promise<PubMedArticle[]> {
  if (!ids.length) return [];
  const unique = Array.from(new Set(ids.map((id) => id.trim()).filter(Boolean)));

  const [summaries, extras] = await Promise.all([
    providerSummary(unique),
    options.includeAbstracts === false
      ? Promise.resolve(new Map<string, EfetchExtras>())
      : providerFetchExtras(unique).catch(() => new Map<string, EfetchExtras>()),
  ]);

  const articles: PubMedArticle[] = [];
  for (const id of unique) {
    const entry = summaries.get(id);
    if (!entry) continue;
    articles.push(buildArticle(id, entry, extras.get(id)));
  }
  return articles;
}

export const PubMedProvider = {
  search: providerSearch,
  fetchArticles: providerFetchArticles,
};

export type IPubMedProvider = typeof PubMedProvider;
