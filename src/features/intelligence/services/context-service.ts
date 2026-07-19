/**
 * IntelligenceContextService — assembles the read-only context that every
 * intelligence service consumes. No mutation, no side effects.
 */

import type { EvidenceObject } from "@/features/evidence-explorer/types";
import { EVIDENCE_OBJECTS } from "@/features/evidence-explorer/mock";
import { KnowledgeGraphStore } from "@/features/graph/services/graph-store";
import { installEvidenceBridge } from "@/features/graph/bridge/evidence-bridge";
import {
  COLLECTIONS as MOCK_COLLECTIONS,
  HYPOTHESES,
  PROJECTS,
  QUESTIONS,
} from "@/features/research/mock";
import { ScientificImportStore } from "@/features/sources/store/import-store";
import type { IntelligenceContext } from "../types";

export const IntelligenceContextService = {
  build(): IntelligenceContext {
    installEvidenceBridge();
    const live = ScientificImportStore.snapshotEvidence();
    const evidence: EvidenceObject[] = [
      ...EVIDENCE_OBJECTS,
      ...live.filter((l) => !EVIDENCE_OBJECTS.some((e) => e.id === l.id)),
    ];
    const graph = KnowledgeGraphStore.snapshot();
    return {
      evidence,
      projects: PROJECTS,
      questions: QUESTIONS,
      hypotheses: HYPOTHESES,
      collections: MOCK_COLLECTIONS,
      graphNodes: graph.nodes,
      graphEdges: graph.edges,
    };
  },
};
