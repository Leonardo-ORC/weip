/**
 * Subscribable in-memory store for records ingested from any scientific
 * source. Bridges the ingestion pipeline to the Evidence Workspace
 * without coupling the two modules. A backend replacement only needs to
 * keep the same subscribe/snapshot shape.
 */

import type { EvidenceObject } from "@/features/evidence-explorer";
import type { ImportRecord, NormalizedRecord, SourceId } from "../types";

type Listener = () => void;

const listeners = new Set<Listener>();
const records: ImportRecord[] = [];
const evidence: EvidenceObject[] = [];

function emit(): void {
  for (const l of Array.from(listeners)) l();
}

function keyOf(source: SourceId, externalId: string): string {
  return `${source}:${externalId}`;
}

export const ScientificImportStore = {
  subscribe(listener: Listener): () => void {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },
  snapshot(): readonly ImportRecord[] {
    return records;
  },
  snapshotEvidence(): readonly EvidenceObject[] {
    return evidence;
  },
  has(source: SourceId, externalId: string): boolean {
    const id = keyOf(source, externalId);
    return records.some((r) => r.id === id);
  },
  countsBySource(): Readonly<Record<SourceId, number>> {
    const counts: Record<SourceId, number> = {
      pubmed: 0,
      clinicaltrials: 0,
      openalex: 0,
    };
    for (const r of records) counts[r.source]++;
    return counts;
  },
  add(
    items: readonly {
      record: NormalizedRecord;
      evidence: EvidenceObject;
    }[],
  ): number {
    let added = 0;
    for (const { record, evidence: ev } of items) {
      const id = keyOf(record.source, record.externalId);
      if (records.some((r) => r.id === id)) continue;
      records.unshift({
        id,
        source: record.source,
        record,
        importedAt: new Date().toISOString(),
      });
      evidence.unshift(ev);
      added++;
    }
    if (added > 0) emit();
    return added;
  },
  remove(source: SourceId, externalId: string): void {
    const id = keyOf(source, externalId);
    const idx = records.findIndex((r) => r.id === id);
    if (idx === -1) return;
    records.splice(idx, 1);
    const evIdx = evidence.findIndex((e) => e.id === id);
    if (evIdx !== -1) evidence.splice(evIdx, 1);
    emit();
  },
  clear(): void {
    if (records.length === 0) return;
    records.length = 0;
    evidence.length = 0;
    emit();
  },
};

export type IScientificImportStore = typeof ScientificImportStore;
