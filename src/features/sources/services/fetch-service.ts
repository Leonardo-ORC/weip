/**
 * ScientificFetchService — retrieves individual records by (source, id).
 */

import { ScientificSourceRegistry } from "../registry";
import type { NormalizedRecord, SourceId, SourceRecordRef } from "../types";

export interface IScientificFetchService {
  fetch(ref: SourceRecordRef): Promise<NormalizedRecord | null>;
  fetchMany(refs: readonly SourceRecordRef[]): Promise<NormalizedRecord[]>;
}

export const ScientificFetchService: IScientificFetchService = {
  async fetch(ref) {
    const provider = ScientificSourceRegistry.get(ref.source as SourceId);
    if (!provider) return null;
    return provider.fetchById(ref.externalId);
  },
  async fetchMany(refs) {
    const results = await Promise.all(refs.map((r) => this.fetch(r)));
    return results.filter((r): r is NormalizedRecord => Boolean(r));
  },
};
