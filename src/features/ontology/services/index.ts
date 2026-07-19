import {
  CONCEPTS,
  EXTERNAL_STANDARDS,
  RELATIONSHIPS,
  TAXONOMY,
  VOCABULARIES,
} from "../mock";
import type {
  Concept,
  ExternalStandard,
  Relationship,
  RelationshipType,
  TaxonomyNode,
  Vocabulary,
} from "../types";

/* ---- Interface-first service contracts ---- */

export interface IVocabularyService {
  list(): Vocabulary[];
  get(id: string): Vocabulary | undefined;
}

export interface IConceptService {
  list(): Concept[];
  get(id: string): Concept | undefined;
  byVocabulary(id: string): Concept[];
  search(query: string): Concept[];
  recent(limit?: number): Concept[];
}

export interface IRelationshipService {
  list(): Relationship[];
  byType(type: RelationshipType): Relationship[];
  forConcept(conceptId: string): Relationship[];
}

export interface ITaxonomyService {
  roots(): TaxonomyNode[];
  find(nodeId: string): TaxonomyNode | undefined;
}

export interface IOntologyService {
  standards(): ExternalStandard[];
  overview(): {
    concepts: number;
    vocabularies: number;
    relationshipTypes: number;
    externalStandards: number;
    semanticDomains: number;
  };
}

/* ---- Mock-backed implementations ---- */

export const VocabularyService: IVocabularyService = {
  list: () => VOCABULARIES,
  get: (id) => VOCABULARIES.find((v) => v.id === id),
};

export const ConceptService: IConceptService = {
  list: () => CONCEPTS,
  get: (id) => CONCEPTS.find((c) => c.id === id),
  byVocabulary: (id) => CONCEPTS.filter((c) => c.vocabularyId === id),
  search(query) {
    const q = query.trim().toLowerCase();
    if (!q) return CONCEPTS;
    return CONCEPTS.filter((c) => {
      const hay = [
        c.preferredLabel,
        c.description,
        c.category,
        ...c.aliases,
        ...c.synonyms,
      ]
        .join(" ")
        .toLowerCase();
      return hay.includes(q);
    });
  },
  recent(limit = 5) {
    return CONCEPTS.slice(0, limit);
  },
};

export const RelationshipService: IRelationshipService = {
  list: () => RELATIONSHIPS,
  byType: (type) => RELATIONSHIPS.filter((r) => r.type === type),
  forConcept: (conceptId) =>
    RELATIONSHIPS.filter((r) => r.sourceId === conceptId || r.targetId === conceptId),
};

function findNode(nodes: TaxonomyNode[], id: string): TaxonomyNode | undefined {
  for (const n of nodes) {
    if (n.id === id) return n;
    const child = findNode(n.children, id);
    if (child) return child;
  }
  return undefined;
}

export const TaxonomyService: ITaxonomyService = {
  roots: () => TAXONOMY,
  find: (id) => findNode(TAXONOMY, id),
};

export const OntologyService: IOntologyService = {
  standards: () => EXTERNAL_STANDARDS,
  overview: () => ({
    concepts: CONCEPTS.length,
    vocabularies: VOCABULARIES.length,
    relationshipTypes: new Set(RELATIONSHIPS.map((r) => r.type)).size,
    externalStandards: EXTERNAL_STANDARDS.length,
    semanticDomains: TAXONOMY.length,
  }),
};
