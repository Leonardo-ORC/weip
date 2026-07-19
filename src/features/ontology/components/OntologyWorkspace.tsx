import { Boxes, Layers, Link2, Network, Sparkles, Waypoints } from "lucide-react";
import { AppPage } from "@/components/app/app-page";
import { DashboardStack, DashboardRow, DashboardWidget } from "@/features/dashboard";
import { useOntologyWorkspace } from "../hooks/use-ontology-workspace";
import { ConceptGrid } from "./ConceptGrid";
import { ConceptInspector } from "./ConceptInspector";
import { MappingCard } from "./MappingCard";
import { OntologyHeader, SemanticMetric } from "./OntologyHeader";
import { OntologySearch } from "./OntologySearch";
import { RelationshipFilterBar, RelationshipGraph } from "./RelationshipGraph";
import { TaxonomyTree } from "./TaxonomyTree";
import { VocabularyGrid } from "./VocabularyGrid";
import type { OntologyMetric } from "../types";

export function OntologyWorkspace() {
  const s = useOntologyWorkspace();

  const metrics: OntologyMetric[] = [
    { id: "m-concepts", label: "Concepts", value: String(s.overview.concepts), hint: "Structured entities", icon: Boxes },
    { id: "m-vocab", label: "Vocabulary groups", value: String(s.overview.vocabularies), hint: "Semantic domains", icon: Layers },
    { id: "m-rel", label: "Relationship types", value: String(s.overview.relationshipTypes), hint: "Predicate classes", icon: Waypoints },
    { id: "m-domains", label: "Semantic domains", value: String(s.overview.semanticDomains), hint: "Top-level branches", icon: Network },
    { id: "m-standards", label: "Future standards", value: String(s.overview.externalStandards), hint: "Interoperability targets", icon: Link2 },
    { id: "m-coverage", label: "Semantic coverage", value: "62%", hint: "Women's hormonal health", icon: Sparkles },
  ];

  return (
    <AppPage
      breadcrumbs={[{ label: "Intelligence", to: "/app/dashboard" }, { label: "Ontology" }]}
      eyebrow="Ontology"
      title="Clinical concept workspace"
      subtitle="Browse vocabularies, taxonomies, relationships and concepts across Women's Hormonal Health."
      meta={<OntologyHeader overview={s.overview} />}
      contextPanel={<ConceptInspector concept={s.selected} onSelectConcept={s.selectConcept} />}
      contextPanelTitle="Inspector"
    >
      <DashboardStack>
        <OntologySearch
          query={s.query}
          onQueryChange={s.setQuery}
          onSubmit={s.commitSearch}
          recent={s.recent}
          resultsCount={s.results.length}
        />

        <section aria-label="Overview metrics">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
            {metrics.map((m) => (
              <SemanticMetric key={m.id} metric={m} />
            ))}
          </div>
        </section>

        <DashboardWidget
          eyebrow="Vocabularies"
          title="Vocabulary explorer"
          subtitle="Structured groups of concepts spanning clinical, biological and therapeutic domains."
        >
          <VocabularyGrid
            vocabularies={s.vocabularies}
            activeId={s.vocabularyFilter}
            onSelect={s.setVocabularyFilter}
          />
        </DashboardWidget>

        <DashboardRow ratio="secondary">
          <DashboardWidget
            eyebrow="Taxonomy"
            title="Taxonomy explorer"
            subtitle="Navigate the parent–child hierarchy of scientific concepts."
          >
            <TaxonomyTree
              roots={s.taxonomy}
              selectedId={s.selected?.id}
              onSelect={s.selectConcept}
            />
          </DashboardWidget>

          <DashboardWidget
            eyebrow="Concepts"
            title="Concept explorer"
            subtitle={
              s.vocabularyFilter
                ? `Filtered by ${s.vocabularies.find((v) => v.id === s.vocabularyFilter)?.name}`
                : "All concepts across the ontology"
            }
          >
            <ConceptGrid
              concepts={s.results}
              activeId={s.selected?.id}
              query={s.query}
              onSelect={s.selectConcept}
            />
          </DashboardWidget>
        </DashboardRow>

        <DashboardWidget
          eyebrow="Relationships"
          title="Relationship explorer"
          subtitle="Semantic predicates connecting concepts across vocabularies."
          action={
            <RelationshipFilterBar
              active={s.relationshipFilter}
              onChange={s.setRelationshipFilter}
            />
          }
        >
          <RelationshipGraph relationships={s.relationships} onSelectConcept={s.selectConcept} />
        </DashboardWidget>

        <DashboardWidget
          eyebrow="External standards"
          title="Interoperability targets"
          subtitle="Future mappings to standard clinical vocabularies."
        >
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {s.standards.map((st) => (
              <MappingCard key={st.id} standard={st} />
            ))}
          </div>
        </DashboardWidget>
      </DashboardStack>
    </AppPage>
  );
}
