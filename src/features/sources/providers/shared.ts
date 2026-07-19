import type {
  SourceId,
  SourceProviderError,
  SourceStudyType,
} from "../types";

export const DEFAULT_TIMEOUT_MS = 20_000;

export async function fetchWithTimeout(
  url: string,
  init?: RequestInit,
  timeoutMs = DEFAULT_TIMEOUT_MS,
): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, { ...init, signal: controller.signal });
  } finally {
    clearTimeout(timer);
  }
}

export function classifyStudyType(types: readonly string[]): SourceStudyType {
  const t = types.map((x) => x.toLowerCase());
  if (t.some((x) => x.includes("meta-analysis"))) return "meta-analysis";
  if (t.some((x) => x.includes("systematic review"))) return "systematic-review";
  if (t.some((x) => x.includes("guideline"))) return "guideline";
  if (t.some((x) => x.includes("preprint"))) return "preprint";
  if (t.some((x) => x.includes("case report"))) return "case-report";
  if (t.some((x) => x.includes("clinical trial") || x.includes("randomized")))
    return "clinical-trial";
  if (t.some((x) => x.includes("article") || x.includes("journal"))) return "article";
  return "unknown";
}

export function toProviderError(source: SourceId, cause: unknown): SourceProviderError {
  if (cause instanceof DOMException && cause.name === "AbortError") {
    return { source, kind: "timeout", message: `${source} request timed out.`, retryable: true };
  }
  if (cause instanceof Error) {
    return { source, kind: "network", message: cause.message, retryable: true };
  }
  return { source, kind: "unknown", message: `Unknown ${source} error.`, retryable: false };
}

export function classifyHttp(source: SourceId, status: number): SourceProviderError | null {
  if (status === 429)
    return { source, kind: "rate-limit", message: `${source} rate limit reached.`, retryable: true };
  if (status === 401 || status === 403)
    return { source, kind: "unauthorized", message: `${source} authorization failed.`, retryable: false };
  if (status === 404)
    return { source, kind: "not-found", message: `${source} resource not found.`, retryable: false };
  if (status >= 500)
    return { source, kind: "network", message: `${source} server error (${status}).`, retryable: true };
  if (status >= 400)
    return {
      source,
      kind: "invalid-response",
      message: `${source} rejected the request (${status}).`,
      retryable: false,
    };
  return null;
}
