import type { LucideIcon } from "lucide-react";

export type OntologyStatus = "active" | "draft" | "planned" | "deprecated";

export type RelationshipType =
  | "IS_A"
  | "PART_OF"
  | "TREATS"
  | "CAUSES"
  | "ASSOCIATED_WITH"
  | "MEASURES"
  | "PRODUCED_BY"
  | "DIAGNOSED_BY"
  | "CONTRAINDICATED_WITH"
  | "REGULATES";

export type ExternalStandardId =
  | "SNOMED_CT"
  | "LOINC"
  | "ICD_11"
  | "RxNorm"
  | "MeSH"
  | "UMLS";

export interface Vocabulary {
  id: string;
  name: string;
  description: string;
  category: string;
  conceptCount: number;
  status: OntologyStatus;
  icon: LucideIcon;
}

export interface ConceptRelationship {
  type: RelationshipType;
  targetId: string;
  targetLabel: string;
}

export interface ConceptMapping {
  standard: ExternalStandardId;
  code: string;
  label?: string;
}

export interface Concept {
  id: string;
  preferredLabel: string;
  vocabularyId: string;
  category: string;
  description: string;
  aliases: string[];
  synonyms: string[];
  relationships: ConceptRelationship[];
  mappings: ConceptMapping[];
  status: OntologyStatus;
  parentId?: string;
  childrenIds: string[];
}

export interface Relationship {
  id: string;
  type: RelationshipType;
  sourceId: string;
  sourceLabel: string;
  targetId: string;
  targetLabel: string;
  description: string;
}

export interface TaxonomyNode {
  id: string;
  label: string;
  conceptId?: string;
  vocabularyId?: string;
  children: TaxonomyNode[];
}

export interface ExternalStandard {
  id: ExternalStandardId;
  name: string;
  description: string;
  scope: string;
  mappedCount: number;
  status: OntologyStatus;
  url?: string;
}

export interface OntologyMetric {
  id: string;
  label: string;
  value: string;
  hint?: string;
  icon: LucideIcon;
}
