import { useCallback, useMemo, useState } from "react";
import {
  ConceptService,
  OntologyService,
  RelationshipService,
  TaxonomyService,
  VocabularyService,
} from "../services";
import type { RelationshipType } from "../types";

const RECENT_LIMIT = 6;

export function useOntologyWorkspace() {
  const vocabularies = useMemo(() => VocabularyService.list(), []);
  const concepts = useMemo(() => ConceptService.list(), []);
  const relationships = useMemo(() => RelationshipService.list(), []);
  const taxonomy = useMemo(() => TaxonomyService.roots(), []);
  const standards = useMemo(() => OntologyService.standards(), []);
  const overview = useMemo(() => OntologyService.overview(), []);

  const [query, setQuery] = useState("");
  const [vocabularyFilter, setVocabularyFilter] = useState<string | null>(null);
  const [relationshipFilter, setRelationshipFilter] = useState<RelationshipType | null>(null);
  const [selectedId, setSelectedId] = useState<string>(concepts[0]?.id ?? "");
  const [recent, setRecent] = useState<string[]>([]);

  const results = useMemo(() => {
    let list = query.trim() ? ConceptService.search(query) : concepts;
    if (vocabularyFilter) list = list.filter((c) => c.vocabularyId === vocabularyFilter);
    return list;
  }, [query, vocabularyFilter, concepts]);

  const filteredRelationships = useMemo(
    () => (relationshipFilter ? relationships.filter((r) => r.type === relationshipFilter) : relationships),
    [relationships, relationshipFilter],
  );

  const selected = useMemo(
    () => concepts.find((c) => c.id === selectedId) ?? concepts[0],
    [concepts, selectedId],
  );

  const commitSearch = useCallback((q: string) => {
    const term = q.trim();
    if (!term) return;
    setRecent((prev) => [term, ...prev.filter((p) => p !== term)].slice(0, RECENT_LIMIT));
  }, []);

  const selectConcept = useCallback((id: string) => {
    setSelectedId(id);
  }, []);

  return {
    vocabularies,
    concepts,
    relationships: filteredRelationships,
    allRelationships: relationships,
    taxonomy,
    standards,
    overview,
    query,
    setQuery,
    commitSearch,
    recent,
    results,
    vocabularyFilter,
    setVocabularyFilter,
    relationshipFilter,
    setRelationshipFilter,
    selected,
    selectConcept,
  };
}

export type OntologyWorkspaceState = ReturnType<typeof useOntologyWorkspace>;
