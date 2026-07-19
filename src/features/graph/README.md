# Sprint 12 — Knowledge Graph Migration Report

## Objective
Transform every Evidence Object into a node in a living Knowledge Graph so that
the platform surfaces stop consuming isolated evidence and start consuming a
semantic network. Extension only — no existing architecture was replaced.

## Architecture (extended)

```
Scientific Sources
        ↓
Processing Pipeline
        ↓
Evidence Extraction Engine (deterministic + OpenAI)
        ↓
Evidence Objects
        ↓
Knowledge Graph  ← new
        ↓
Research Intelligence (Sprint 13, ready)
```

## Modules delivered — `src/features/graph/`

| Layer        | Files                                                                                                                                    |
| ------------ | ---------------------------------------------------------------------------------------------------------------------------------------- |
| Contracts    | `types/index.ts` — 17 node types, 14 edge types, provenance, metrics, neighborhood, path, validation                                     |
| Store        | `services/graph-store.ts` — subscribable, incremental upsert, provenance merge, degree recompute                                         |
| Builder      | `services/graph-builder.ts` — Evidence → nodes/edges (incremental, deterministic edge-type inference, ontology-link fallback)            |
| Indexing     | `services/semantic-index.ts` — cached indices per snapshot version                                                                       |
| Traversal    | `services/traversal.ts` — n-depth neighborhood, shortest semantic path                                                                   |
| Query        | `services/query.ts` — typed node/edge queries, related concepts, neighbor evidence                                                       |
| Validation   | `services/validation.ts` — duplicates, orphans, broken/circular edges, missing provenance, confidence drift                              |
| Resolver     | `services/resolver.ts` — canonical labels, node type mapping                                                                             |
| Facade       | `services/knowledge-graph-service.ts` — `KnowledgeGraphService` (ingest, metrics, snapshot, plus namespaced sub-services)                |
| Bridge       | `bridge/evidence-bridge.ts` — auto-subscribes to `ScientificImportStore`, seeds from mock, incremental only (never rebuilds)             |
| Hooks        | `hooks/use-knowledge-graph.ts`, `hooks/use-connected-evidence.ts`                                                                        |
| Components   | `KnowledgeGraphViewer`, `RelationshipInspector`, `RelatedConceptsPanel`, `EntityCluster`, `SemanticPathViewer`, `KnowledgeMetrics`, `KnowledgeCoverageWidget`, `GraphBadges` |

## Semantic guarantees

- **Canonicalization**: every concept is keyed by `type + slug(label)`; duplicates merge automatically.
- **Incremental**: only affected nodes are updated on evidence ingest — no full rebuild.
- **Provenance on every edge**: `evidenceId`, `source`, `extractionVersion`, `extractionMethod`, `aiProviderId`, `aiModel`, `confidence`, `timestamp`, `snippet`. Merged across ingests, capped at 25 entries per edge.
- **Strict typing**: no `any`; readonly contracts throughout.

## Workspace migration matrix

| Surface                | Before                              | After                                                           |
| ---------------------- | ----------------------------------- | --------------------------------------------------------------- |
| Dashboard              | Isolated widgets                    | `KnowledgeCoverageWidget` — live coverage/density/nodes/edges   |
| Evidence Workspace     | Isolated Evidence Objects           | `RelatedConceptsPanel` inside inspector — concepts + neighbors + hubs |
| Knowledge Graph route  | —                                   | `/app/graph` — Viewer + Metrics + Inspector + Clusters + Validation |
| Sidebar navigation     | —                                   | New "Knowledge Graph" entry under Intelligence                  |
| Ontology / Projects / Collections / Clinical Knowledge / Pipeline | Static lists / placeholders | Graph engine exposed via `useKnowledgeGraph`; wiring surfaces already have access — future sprints can bind without structural change. |

## Ready for Sprint 13
The `KnowledgeGraphService` facade exposes `ingest`, `metrics`, `query`,
`traversal`, `validation`, `index`, `snapshot`. Research Intelligence can
plug in as a consumer without touching the store, builder or evidence
pipeline.

## Validation
- `bunx tsgo --noEmit` — passing.
- Bridge is idempotent; multiple mounts do not double-ingest.
- Graph store versioned; SemanticIndex cache invalidates on version bump.
