/**
 * Deterministic text-matching utilities. Case-insensitive, word-boundary
 * aware, purely local — no AI, no network.
 */

export interface TextMatch {
  readonly index: number;
  readonly snippet: string;
}

const SNIPPET_RADIUS = 60;

function escapeRegExp(input: string): string {
  return input.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export function findFirstMatch(
  haystack: string,
  needle: string,
): TextMatch | null {
  if (!haystack || !needle) return null;
  const pattern = new RegExp(`\\b${escapeRegExp(needle)}\\b`, "i");
  const match = pattern.exec(haystack);
  if (!match) return null;
  const from = Math.max(0, match.index - SNIPPET_RADIUS);
  const to = Math.min(haystack.length, match.index + needle.length + SNIPPET_RADIUS);
  const snippet = haystack.slice(from, to).replace(/\s+/g, " ").trim();
  return { index: match.index, snippet };
}

export function includesAny(
  haystack: string,
  needles: readonly string[],
): boolean {
  if (!haystack) return false;
  const lower = haystack.toLowerCase();
  return needles.some((n) => lower.includes(n.toLowerCase()));
}

export function extractFirstNumber(
  text: string,
  patterns: readonly RegExp[],
): { value: number; snippet: string } | null {
  for (const pattern of patterns) {
    const match = pattern.exec(text);
    if (!match) continue;
    const raw = match[1] ?? match[0];
    const value = Number(raw.replace(/[,\s]/g, ""));
    if (!Number.isFinite(value)) continue;
    const from = Math.max(0, match.index - SNIPPET_RADIUS);
    const to = Math.min(text.length, match.index + match[0].length + SNIPPET_RADIUS);
    return { value, snippet: text.slice(from, to).replace(/\s+/g, " ").trim() };
  }
  return null;
}
