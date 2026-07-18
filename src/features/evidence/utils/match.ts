import type { ProviderDefinition } from "../types/provider";

export function normalizeQuery(query: string): string {
  return query.trim().toLowerCase();
}

export function matchesProvider(provider: ProviderDefinition, query: string): boolean {
  const q = normalizeQuery(query);
  if (!q) return true;
  const haystack = [
    provider.name,
    provider.shortName ?? "",
    provider.description,
    provider.id,
    ...(provider.tags ?? []),
    ...provider.supportedContent,
  ]
    .join(" ")
    .toLowerCase();
  return haystack.includes(q);
}
