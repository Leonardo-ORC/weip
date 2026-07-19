/**
 * Bridges the ScientificImportStore into the KnowledgeGraph. Every new
 * evidence object ingested by the pipeline is added to the graph
 * incrementally — the graph is never rebuilt from scratch.
 */

import type { EvidenceObject } from "@/features/evidence-explorer";
import { EVIDENCE_OBJECTS } from "@/features/evidence-explorer/mock";
import { ScientificImportStore } from "@/features/sources/store/import-store";
import { KnowledgeGraphBuilder } from "../services/graph-builder";
import { KnowledgeGraphStore } from "../services/graph-store";

let installed = false;
const ingested = new Set<string>();

function ingestList(list: readonly EvidenceObject[]): number {
  let touched = 0;
  for (const ev of list) {
    if (ingested.has(ev.id)) continue;
    KnowledgeGraphBuilder.ingestEvidence(ev);
    ingested.add(ev.id);
    touched += 1;
  }
  return touched;
}

function syncOnce(): void {
  const live = ScientificImportStore.snapshotEvidence();
  const seedNeeded = ingested.size === 0;
  const touched = ingestList(live) + (seedNeeded ? ingestList(EVIDENCE_OBJECTS) : 0);
  if (touched === 0) {
    KnowledgeGraphStore.commit();
  }
}

export function installEvidenceBridge(): void {
  if (installed) return;
  installed = true;
  syncOnce();
  ScientificImportStore.subscribe(() => syncOnce());
}
