# features/

Domain modules. Each folder is a self-contained slice with its own
`components/`, `hooks/`, `types/`, and `utils/`. Modules never reach into
each other's internals — cross-module communication happens through
`src/services/` or shared primitives in `src/components/`.

Active scaffolds:

- `evidence/` — evidence ingestion and normalization surface
- `ontology/` — clinical ontology and vocabulary layer
- `graph/` — knowledge graph traversal and visualization
- `intelligence/` — reasoning, ranking, explainability
- `research/` — researcher workflow surfaces
- `applications/` — end-user application modules
- `developer/` — API keys, docs, developer console
- `dashboard/` — authenticated home
- `settings/` — user, workspace, integrations
