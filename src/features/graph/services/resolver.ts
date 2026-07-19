/**
 * RelationshipResolver — canonicalizes labels into stable graph keys and
 * maps biomedical entity kinds / women's health concepts to graph node
 * types. Keeps duplicate concepts merged as a single node.
 */

import type {
  BiomedicalEntityKind,
  WomensHealthConcept,
} from "@/features/extraction/types";
import type { GraphNodeType } from "../types";

const BIOMEDICAL_TO_NODE: Readonly<Record<BiomedicalEntityKind, GraphNodeType>> = {
  disease: "disease",
  condition: "condition",
  hormone: "hormone",
  drug: "drug",
  biomarker: "biomarker",
  gene: "gene",
  protein: "protein",
  "lab-test": "lab-test",
  symptom: "symptom",
  procedure: "procedure",
  "clinical-outcome": "clinical-outcome",
  device: "procedure",
};

export const RelationshipResolver = {
  nodeTypeForBiomedical(kind: BiomedicalEntityKind): GraphNodeType {
    return BIOMEDICAL_TO_NODE[kind];
  },
  nodeTypeForWomensHealth(_concept: WomensHealthConcept): GraphNodeType {
    return "womens-health-concept";
  },
  canonicalizeLabel(label: string): string {
    return label
      .toLowerCase()
      .replace(/[\u2018\u2019\u201C\u201D]/g, "'")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  },
  nodeId(type: GraphNodeType, canonicalKey: string): string {
    return `${type}:${canonicalKey}`;
  },
  edgeId(type: string, sourceId: string, targetId: string): string {
    return `${sourceId}=[${type}]=>${targetId}`;
  },
};

export type IRelationshipResolver = typeof RelationshipResolver;
