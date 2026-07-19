# WEIP — Women's Evidence Intelligence Platform

Scientific infrastructure that turns publications, clinical trials and regulatory evidence into structured **Evidence Objects**, a living **Knowledge Graph** and explainable **Research Intelligence** — starting with women's health, where evidence gaps still affect millions of patients.

---

## What it does

WEIP provides a coherent 5-stage research workflow:

1. **Sources** — Search and ingest records from PubMed, ClinicalTrials.gov and OpenAlex.
2. **Extraction** — Transform raw scientific text into strongly typed, traceable Evidence Objects.
3. **Objects** — Store, validate and inspect evidence with confidence scoring and provenance.
4. **Graph** — Connect entities, conditions, interventions and outcomes into a semantic knowledge graph.
5. **Intelligence** — Generate traceable insights, gap analyses and trend recommendations.

---

## Tech stack

- **Framework:** [TanStack Start](https://tanstack.com/start) v1 + React 19 + Vite 7
- **Styling:** Tailwind CSS v4 + OKLCH design tokens
- **Auth & database:** Supabase (Auth, profiles, role-based access)
- **State & routing:** TanStack Query + TanStack Router (file-based routing)
- **UI primitives:** Radix UI + shadcn/ui conventions
- **Charts:** Recharts
- **AI / LLM extraction:** OpenAI API (server-side, behind `createServerFn`)

---

## Project structure

```
src/
├── components/        # Shared UI primitives (layout, common, app shell, auth)
├── constants/         # Navigation and site metadata
├── features/          # Domain modules (self-contained slices)
│   ├── auth/          # Supabase auth, protected route gate
│   ├── dashboard/     # Research Command Center
│   ├── sources/       # Scientific source providers (PubMed, ClinicalTrials.gov, OpenAlex)
│   ├── pubmed/        # PubMed-specific ingestion pipeline
│   ├── extraction/    # Deterministic + AI extraction engine
│   ├── graph/         # Knowledge Graph services and viewer
│   ├── intelligence/  # Research Intelligence Engine
│   ├── research/      # Research project workspace
│   ├── ontology/      # Clinical ontology workspace
│   ├── journey/       # Guided Research Journey (Metformin in PCOS demo)
│   ├── evidence/      # Legacy evidence scaffolds
│   ├── evidence-explorer/  # Evidence repository workspace
│   ├── applications/  # End-user application modules
│   ├── developer/     # API keys / developer console
│   └── settings/      # User / workspace settings
├── integrations/supabase/  # Supabase clients and middleware
├── lib/               # Design tokens, utilities, shared helpers
├── providers/         # App-level providers (theme, auth, loading, error boundary)
├── routes/            # TanStack file-based routes
└── services/          # Thin client-facing service adapters
```

---

## Quick start

```bash
# Install dependencies
bun install

# Start the dev server
bun dev
```

The app runs at `http://localhost:8080`.

---

## Environment variables

Create or update `.env` with the following keys:

```bash
# Supabase
SUPABASE_PROJECT_ID="..."
SUPABASE_PUBLISHABLE_KEY="..."
SUPABASE_URL="..."
VITE_SUPABASE_PROJECT_ID="..."
VITE_SUPABASE_PUBLISHABLE_KEY="..."
VITE_SUPABASE_URL="..."

# OpenAI API (required for AI extraction and research intelligence)
OPENAI_API_KEY="..."
OPENAI_MODEL="gpt-4o-mini"          # or another supported model
OPENAI_BASE_URL="https://api.openai.com/v1"

# Scientific source providers
PUBMED_BASE_URL="https://eutils.ncbi.nlm.nih.gov/entrez/eutils"
PUBMED_TOOL_NAME="..."
PUBMED_EMAIL="..."
PUBMED_API_KEY="..."
CLINICAL_TRIALS_BASE_URL="https://clinicaltrials.gov/api"
OPENALEX_BASE_URL="https://api.openalex.org"
OPENALEX_API_KEY="..."
```

> Store all secrets via Lovable Secrets or your secure secret manager. Never commit real keys.

---

## OpenAI API usage

WEIP uses the **OpenAI API** for two server-side intelligence layers:

- **Evidence Extraction Engine** (`src/features/extraction/providers/openai.server.ts`)
  - Sends article title, abstract and keywords to an OpenAI chat model with a strict JSON schema.
  - Extracts population, intervention, outcomes, adverse events, study design, biomedical entities and women's health concepts.
  - Returns structured `EvidenceObject` fragments with confidence scores and provenance.

- **Research Intelligence Engine** (`src/features/intelligence/providers/openai-intelligence.server.ts`)
  - Enriches already-detected insights with concise summaries and recommended next actions.
  - Never invents scientific claims; only reasons about structured input already present in the graph.

Both calls are wrapped in `createServerFn`, so the `OPENAI_API_KEY` never reaches the browser. Calls include a timeout, error handling and graceful degradation when the API is unavailable.

---

## Key workspaces

| Route | Purpose |
|-------|---------|
| `/` | Landing page with platform storytelling |
| `/login`, `/register` | Supabase authentication |
| `/app` | Authenticated workspace shell |
| `/app/dashboard` | Research Command Center |
| `/app/sources` | Search and ingest scientific sources |
| `/app/evidence` | Evidence repository and inspector |
| `/app/research` | Research projects and hypotheses |
| `/app/ontology` | Clinical ontology and vocabulary |
| `/app/graph` | Knowledge Graph visualization |
| `/app/journey` | Guided Research Journey (demo) |

---

## Scripts

```bash
bun dev         # Dev server
bun build       # Production build
bun build:dev   # Development build
bun preview     # Preview production build
bun lint        # Run ESLint
bun format      # Run Prettier
```

---

## Notes

- This project is connected to [Lovable](https://lovable.dev). Avoid force-pushing or rewriting published history.
- All domain modules are self-contained; cross-module communication goes through shared primitives or service adapters in `src/services/`.
