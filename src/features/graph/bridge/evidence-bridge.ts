/**
 * Bridges the ScientificImportStore into the KnowledgeGraph. Every new
 * evidence object ingested by the pipeline is added to the graph
 * incrementally — the graph is never rebuilt from scratch.
 */

import { ScientificImportStore } from "@/features/sources/store/import-store";
import { KnowledgeGraphBuilder } from "../services/graph-builder";
import { KnowledgeGraphStore } from "../services/graph-store";

let installed = false;
const ingested = new Set<string>();

function syncOnce(): void {
  const evidence = ScientificImportStore.snapshotEvidence();
  let touched = 0;
  for (const ev of evidence) {
    if (ingested.has(ev.id)) continue;
    KnowledgeGraphBuilder.ingestEvidence(ev);
    ingested.add(ev.id);
    touched += 1;
  }
  if (touched === 0) {
    // still emit initial snapshot so listeners see empty state
    KnowledgeGraphStore.commit();
  }
}

export function installEvidenceBridge(): void {
  if (installed) return;
  installed = true;
  syncOnce();
  ScientificImportStore.subscribe(() => syncOnce());
}
