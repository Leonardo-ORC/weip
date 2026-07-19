/**
 * KnowledgeGraphBuilder — turns EvidenceObjects into graph nodes and
 * edges. Incremental: only touches nodes affected by the input evidence.
 * Every edge preserves full provenance (evidence id, source, extraction
 * method, AI provider, confidence, timestamp) so consumers can always
 * answer "why are these two nodes connected?".
 */

import type { EvidenceObject } from "@/features/evidence-explorer";
import type {
  BiomedicalEntity,
  EvidenceExtraction,
  WomensHealthMatch,
} from "@/features/extraction/types";
import type {
  EdgeProvenance,
  GraphEdgeType,
  GraphNode,
  GraphNodeType,
} from "../types";
import { KnowledgeGraphStore } from "./graph-store";
import { RelationshipResolver } from "./resolver";

function nowIso(): string {
  return new Date().toISOString();
}

function evidenceProvenance(
  evidence: EvidenceObject,
  extraction: EvidenceExtraction | undefined,
  confidence: number,
  snippet?: string,
): EdgeProvenance {
  return {
    evidenceId: evidence.id,
    source: extraction?.metadata.aiProviderId ? "extraction" : "extraction",
    extractionVersion: extraction?.metadata.engineVersion ?? null,
    extractionMethod: extraction ? extraction.metadata.strategies[0] ?? "deterministic" : "deterministic",
    aiProviderId: extraction?.metadata.aiProviderId ?? null,
    aiModel: extraction?.metadata.aiModel ?? null,
    confidence,
    timestamp: nowIso(),
    snippet,
  };
}

function conceptNodeFromEntity(entity: BiomedicalEntity): {
  readonly type: GraphNodeType;
  readonly canonicalKey: string;
  readonly id: string;
} {
  const type = RelationshipResolver.nodeTypeForBiomedical(entity.kind);
  const canonicalKey = RelationshipResolver.canonicalizeLabel(entity.label);
  return {
    type,
    canonicalKey,
    id: RelationshipResolver.nodeId(type, canonicalKey),
  };
}

function womensHealthNode(match: WomensHealthMatch): {
  readonly type: GraphNodeType;
  readonly canonicalKey: string;
  readonly id: string;
} {
  const canonicalKey = RelationshipResolver.canonicalizeLabel(match.concept);
  return {
    type: "womens-health-concept",
    canonicalKey,
    id: RelationshipResolver.nodeId("womens-health-concept", canonicalKey),
  };
}

function inferEdgeType(nodeType: GraphNodeType): GraphEdgeType {
  switch (nodeType) {
    case "drug":
      return "USES";
    case "disease":
    case "condition":
      return "OBSERVED_IN";
    case "clinical-outcome":
      return "INDICATES";
    case "biomarker":
    case "lab-test":
      return "MEASURED_BY";
    case "hormone":
    case "gene":
    case "protein":
    case "symptom":
    case "procedure":
      return "MENTIONS";
    case "womens-health-concept":
      return "ASSOCIATED_WITH";
    default:
      return "RELATED_TO";
  }
}

export const KnowledgeGraphBuilder = {
  /**
   * Ingest a single EvidenceObject into the graph. Existing nodes and
   * edges are merged; only affected nodes are updated.
   */
  ingestEvidence(evidence: EvidenceObject): GraphNode {
    const extraction = evidence.extraction;
    const evidenceNodeId = RelationshipResolver.nodeId("evidence", evidence.id);
    const evidenceNode = KnowledgeGraphStore.upsertNode({
      id: evidenceNodeId,
      type: "evidence",
      label: evidence.title,
      canonicalKey: evidence.id,
      evidenceId: evidence.id,
      confidence: extraction?.confidence.overall ?? 0.6,
      meta: {
        evidenceRef: evidence.id,
        summary: evidence.summary,
      },
    });

    // Base condition/drug from evidence header
    if (evidence.condition) {
      const key = RelationshipResolver.canonicalizeLabel(evidence.condition);
      const id = RelationshipResolver.nodeId("condition", key);
      KnowledgeGraphStore.upsertNode({
        id,
        type: "condition",
        label: evidence.condition,
        canonicalKey: key,
        evidenceId: evidence.id,
        confidence: 0.75,
      });
      const provenance = evidenceProvenance(evidence, extraction, 0.75);
      KnowledgeGraphStore.upsertEdge({
        id: RelationshipResolver.edgeId("OBSERVED_IN", evidenceNodeId, id),
        type: "OBSERVED_IN",
        sourceId: evidenceNodeId,
        targetId: id,
        confidence: 0.75,
        provenance,
      });
    }
    if (evidence.drug) {
      const key = RelationshipResolver.canonicalizeLabel(evidence.drug);
      const id = RelationshipResolver.nodeId("drug", key);
      KnowledgeGraphStore.upsertNode({
        id,
        type: "drug",
        label: evidence.drug,
        canonicalKey: key,
        evidenceId: evidence.id,
        confidence: 0.75,
      });
      const provenance = evidenceProvenance(evidence, extraction, 0.75);
      KnowledgeGraphStore.upsertEdge({
        id: RelationshipResolver.edgeId("USES", evidenceNodeId, id),
        type: "USES",
        sourceId: evidenceNodeId,
        targetId: id,
        confidence: 0.75,
        provenance,
      });
    }

    // Biomedical entities from extraction
    if (extraction) {
      for (const entity of extraction.entities.items) {
        const target = conceptNodeFromEntity(entity);
        KnowledgeGraphStore.upsertNode({
          id: target.id,
          type: target.type,
          label: entity.label,
          canonicalKey: target.canonicalKey,
          evidenceId: evidence.id,
          confidence: entity.confidence,
          meta: { biomedicalKind: entity.kind },
        });
        const edgeType = inferEdgeType(target.type);
        const provenance = evidenceProvenance(
          evidence,
          extraction,
          entity.confidence,
          entity.provenance[0]?.snippet,
        );
        KnowledgeGraphStore.upsertEdge({
          id: RelationshipResolver.edgeId(edgeType, evidenceNodeId, target.id),
          type: edgeType,
          sourceId: evidenceNodeId,
          targetId: target.id,
          confidence: entity.confidence,
          provenance,
        });
      }
      for (const match of extraction.womensHealth.matches) {
        const target = womensHealthNode(match);
        KnowledgeGraphStore.upsertNode({
          id: target.id,
          type: "womens-health-concept",
          label: match.concept,
          canonicalKey: target.canonicalKey,
          evidenceId: evidence.id,
          confidence: match.confidence,
          meta: { womensHealthConcept: match.concept },
        });
        const provenance = evidenceProvenance(evidence, extraction, match.confidence);
        KnowledgeGraphStore.upsertEdge({
          id: RelationshipResolver.edgeId("ASSOCIATED_WITH", evidenceNodeId, target.id),
          type: "ASSOCIATED_WITH",
          sourceId: evidenceNodeId,
          targetId: target.id,
          confidence: match.confidence,
          provenance,
        });
      }
    }

    // Ontology links (already present on legacy fixtures)
    for (const link of evidence.ontologyLinks) {
      const nodeType: GraphNodeType =
        link.kind === "hormone"
          ? "hormone"
          : link.kind === "drug"
            ? "drug"
            : link.kind === "condition"
              ? "condition"
              : link.kind === "biomarker"
                ? "biomarker"
                : "clinical-outcome";
      const key = RelationshipResolver.canonicalizeLabel(link.label);
      const targetId = RelationshipResolver.nodeId(nodeType, key);
      KnowledgeGraphStore.upsertNode({
        id: targetId,
        type: nodeType,
        label: link.label,
        canonicalKey: key,
        evidenceId: evidence.id,
        confidence: 0.7,
      });
      const edgeType = inferEdgeType(nodeType);
      KnowledgeGraphStore.upsertEdge({
        id: RelationshipResolver.edgeId(edgeType, evidenceNodeId, targetId),
        type: edgeType,
        sourceId: evidenceNodeId,
        targetId,
        confidence: 0.7,
        provenance: evidenceProvenance(evidence, extraction, 0.7),
      });
    }

    KnowledgeGraphStore.commit();
    return evidenceNode;
  },

  ingestMany(items: readonly EvidenceObject[]): number {
    let touched = 0;
    for (const ev of items) {
      this.ingestEvidence(ev);
      touched += 1;
    }
    return touched;
  },
};

export type IKnowledgeGraphBuilder = typeof KnowledgeGraphBuilder;
