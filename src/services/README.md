# services/

Client-facing service adapters that call server functions or external APIs.
Future modules register their service objects here (e.g. `evidenceService`,
`ontologyService`). Keep this layer thin — server logic belongs in
`src/**/*.functions.ts` or `src/**/*.server.ts`.
