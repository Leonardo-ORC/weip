/**
 * ClinicalTrialsSource — ClinicalTrials.gov v2 API adapter.
 *
 *   GET /api/v2/studies?query.term=&pageSize=&countTotal=true
 *   GET /api/v2/studies/{nctId}
 *
 * Runs server-side only. Configuration is read from
 * `CLINICAL_TRIALS_BASE_URL`.
 */

import type {
  NormalizedRecord,
  ProviderMetadata,
  ScientificSourceProvider,
  SourceHealthReport,
  SourceSearchPage,
  UnifiedSearchQuery,
} from "../types";
import { classifyHttp, fetchWithTimeout, toProviderError } from "./shared";

const DEFAULT_BASE_URL = "https://clinicaltrials.gov/api/v2";

const METADATA: ProviderMetadata = {
  id: "clinicaltrials",
  name: "ClinicalTrials.gov",
  shortName: "CT.gov",
  description: "US NIH registry of interventional and observational studies.",
  homepage: "https://clinicaltrials.gov/",
  apiReference: "https://clinicaltrials.gov/data-api/api",
  badgeAccent: "teal",
  capabilities: ["studies", "interventions", "eligibility", "outcomes", "sponsors"],
};

interface CtStudy {
  protocolSection?: {
    identificationModule?: {
      nctId?: string;
      briefTitle?: string;
      officialTitle?: string;
    };
    statusModule?: {
      overallStatus?: string;
      startDateStruct?: { date?: string };
      completionDateStruct?: { date?: string };
    };
    sponsorCollaboratorsModule?: {
      leadSponsor?: { name?: string };
    };
    descriptionModule?: { briefSummary?: string; detailedDescription?: string };
    conditionsModule?: { conditions?: string[]; keywords?: string[] };
    designModule?: {
      studyType?: string;
      phases?: string[];
      designInfo?: { allocation?: string; interventionModel?: string };
    };
    armsInterventionsModule?: {
      interventions?: Array<{ type?: string; name?: string; description?: string }>;
    };
    eligibilityModule?: {
      sex?: string;
      minimumAge?: string;
      maximumAge?: string;
      healthyVolunteers?: boolean;
      eligibilityCriteria?: string;
    };
    outcomesModule?: {
      primaryOutcomes?: Array<{ measure?: string }>;
      secondaryOutcomes?: Array<{ measure?: string }>;
    };
    contactsLocationsModule?: {
      locations?: Array<{ facility?: string; city?: string; country?: string }>;
    };
  };
}

interface CtSearchResponse {
  studies?: CtStudy[];
  totalCount?: number;
  nextPageToken?: string;
}

function baseUrl(): string {
  return (process.env.CLINICAL_TRIALS_BASE_URL || DEFAULT_BASE_URL).replace(/\/$/, "");
}

function buildQueryTerm(q: UnifiedSearchQuery): string {
  const parts = [q.term, q.disease, q.drug].filter((s): s is string => Boolean(s && s.trim()));
  return parts.join(" ").trim();
}

function normalize(study: CtStudy): NormalizedRecord {
  const p = study.protocolSection ?? {};
  const nctId = p.identificationModule?.nctId ?? "";
  const title =
    p.identificationModule?.briefTitle ||
    p.identificationModule?.officialTitle ||
    "Untitled study";
  const summary = p.descriptionModule?.briefSummary ?? null;
  const startDate = p.statusModule?.startDateStruct?.date ?? null;
  const year = startDate ? Number(startDate.slice(0, 4)) : null;
  const sponsor = p.sponsorCollaboratorsModule?.leadSponsor?.name;
  const conditions = p.conditionsModule?.conditions ?? [];
  const keywords = p.conditionsModule?.keywords ?? [];
  const interventions = p.armsInterventionsModule?.interventions ?? [];
  const primary = p.outcomesModule?.primaryOutcomes ?? [];
  const secondary = p.outcomesModule?.secondaryOutcomes ?? [];
  const locations = p.contactsLocationsModule?.locations ?? [];
  const countries = Array.from(
    new Set(locations.map((l) => l.country).filter((c): c is string => Boolean(c))),
  );

  return {
    source: "clinicaltrials",
    externalId: nctId,
    title,
    abstract: summary,
    authors: sponsor ? [sponsor] : [],
    journal: null,
    publication: sponsor ?? null,
    publicationDate: startDate,
    publicationYear: Number.isFinite(year) ? (year as number) : null,
    studyType: "clinical-trial",
    keywords: [...conditions, ...keywords],
    language: "en",
    url: nctId ? `https://clinicaltrials.gov/study/${nctId}` : null,
    doi: null,
    status: p.statusModule?.overallStatus ?? null,
    citationCount: null,
    providerMetadata: {
      nctId,
      phases: p.designModule?.phases ?? [],
      studyType: p.designModule?.studyType ?? null,
      allocation: p.designModule?.designInfo?.allocation ?? null,
      interventionModel: p.designModule?.designInfo?.interventionModel ?? null,
      sponsor: sponsor ?? null,
      conditions,
      interventions: interventions.map((i) => ({ type: i.type, name: i.name })),
      eligibility: {
        sex: p.eligibilityModule?.sex ?? null,
        minimumAge: p.eligibilityModule?.minimumAge ?? null,
        maximumAge: p.eligibilityModule?.maximumAge ?? null,
        healthyVolunteers: p.eligibilityModule?.healthyVolunteers ?? null,
      },
      primaryOutcomes: primary.map((o) => o.measure).filter(Boolean),
      secondaryOutcomes: secondary.map((o) => o.measure).filter(Boolean),
      countries,
      locationCount: locations.length,
    },
  };
}

export const ClinicalTrialsSource: ScientificSourceProvider = {
  metadata: METADATA,

  async search(query: UnifiedSearchQuery): Promise<SourceSearchPage> {
    const term = buildQueryTerm(query);
    if (!term) {
      return {
        source: "clinicaltrials",
        total: 0,
        page: query.page,
        pageSize: query.pageSize,
        records: [],
        fetchedAt: new Date().toISOString(),
      };
    }
    const params = new URLSearchParams({
      "query.term": term,
      pageSize: String(Math.min(query.pageSize, 50)),
      countTotal: "true",
      format: "json",
    });
    if (query.condition) params.set("query.cond", query.condition);
    if (query.drug) params.set("query.intr", query.drug);
    if (query.yearFrom || query.yearTo) {
      const lo = query.yearFrom ?? 1900;
      const hi = query.yearTo ?? new Date().getFullYear();
      params.set("filter.advanced", `AREA[StartDate]RANGE[${lo}-01-01,${hi}-12-31]`);
    }

    const url = `${baseUrl()}/studies?${params.toString()}`;
    try {
      const response = await fetchWithTimeout(url, {
        headers: { accept: "application/json" },
      });
      const httpErr = classifyHttp("clinicaltrials", response.status);
      if (httpErr) throw httpErr;
      const data = (await response.json()) as CtSearchResponse;
      const studies = Array.isArray(data.studies) ? data.studies : [];
      return {
        source: "clinicaltrials",
        total: data.totalCount ?? studies.length,
        page: query.page,
        pageSize: query.pageSize,
        records: studies.map(normalize),
        fetchedAt: new Date().toISOString(),
      };
    } catch (cause) {
      return {
        source: "clinicaltrials",
        total: 0,
        page: query.page,
        pageSize: query.pageSize,
        records: [],
        fetchedAt: new Date().toISOString(),
        error:
          (cause as { source?: string; kind?: string }).source === "clinicaltrials"
            ? (cause as never)
            : toProviderError("clinicaltrials", cause),
      };
    }
  },

  async fetchById(externalId): Promise<NormalizedRecord | null> {
    if (!externalId) return null;
    const url = `${baseUrl()}/studies/${encodeURIComponent(externalId)}?format=json`;
    try {
      const response = await fetchWithTimeout(url, {
        headers: { accept: "application/json" },
      });
      const httpErr = classifyHttp("clinicaltrials", response.status);
      if (httpErr) throw httpErr;
      const data = (await response.json()) as CtStudy;
      return normalize(data);
    } catch {
      return null;
    }
  },

  normalize: (record) => record,

  async healthCheck(): Promise<SourceHealthReport> {
    const start = performance.now();
    try {
      const response = await fetchWithTimeout(
        `${baseUrl()}/studies?query.term=menopause&pageSize=1&countTotal=true&format=json`,
        { headers: { accept: "application/json" } },
        8_000,
      );
      const ok = response.ok;
      return {
        source: "clinicaltrials",
        status: ok ? "connected" : "degraded",
        responseTimeMs: Math.round(performance.now() - start),
        checkedAt: new Date().toISOString(),
        message: ok ? undefined : `HTTP ${response.status}`,
      };
    } catch (cause) {
      return {
        source: "clinicaltrials",
        status: "disconnected",
        responseTimeMs: Math.round(performance.now() - start),
        checkedAt: new Date().toISOString(),
        message: toProviderError("clinicaltrials", cause).message,
      };
    }
  },

  providerMetadata: () => METADATA,
};
