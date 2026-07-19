/**
 * Subscribable in-memory store for PubMed-imported Evidence Objects.
 * Bridges the ingestion flow to the Evidence Workspace without coupling
 * the two modules. A backend replacement only needs to keep the same
 * subscribe/snapshot shape.
 */

import type { EvidenceObject } from "@/features/evidence-explorer";
import type { PubMedImportRecord } from "../types";

type Listener = () => void;

const listeners = new Set<Listener>();
const records: PubMedImportRecord[] = [];
const evidence: EvidenceObject[] = [];

function emit(): void {
  for (const l of Array.from(listeners)) l();
}

export const PubMedImportStore = {
  subscribe(listener: Listener): () => void {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },
  snapshot(): readonly PubMedImportRecord[] {
    return records;
  },
  snapshotEvidence(): readonly EvidenceObject[] {
    return evidence;
  },
  has(id: string): boolean {
    return records.some((r) => r.id === id);
  },
  add(items: readonly { record: PubMedImportRecord; evidence: EvidenceObject }[]): number {
    let added = 0;
    for (const { record, evidence: ev } of items) {
      if (records.some((r) => r.id === record.id)) continue;
      records.unshift(record);
      evidence.unshift(ev);
      added++;
    }
    if (added > 0) emit();
    return added;
  },
  remove(id: string): void {
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

export type IPubMedImportStore = typeof PubMedImportStore;
