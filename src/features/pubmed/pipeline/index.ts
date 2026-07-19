/**
 * Evidence Processing Pipeline — reusable orchestration for PubMed ingestion.
 *
 *   Fetch → Validate → Normalize → Transform → Store → Expose
 *
 * Each stage is a pure async function receiving the previous stage's
 * payload plus a mutable state reporter. Stage implementations are
 * decoupled so future providers (Europe PMC, ClinicalTrials.gov) can
 * reuse the same engine.
 */

import type { EvidenceObject } from "@/features/evidence-explorer";
import { EvidenceMapper } from "../mappers/pubmed-to-evidence";
import { PubMedImportStore } from "../store/import-store";
import type {
  PipelineError,
  PipelineRunState,
  PipelineStageId,
  PipelineStageState,
  PubMedArticle,
} from "../types";

export const PIPELINE_STAGES: readonly {
  id: PipelineStageId;
  label: string;
  description: string;
}[] = [
  { id: "fetch", label: "Fetch", description: "Retrieve articles from PubMed E-Utilities." },
  { id: "validate", label: "Validate", description: "Check required metadata and identifiers." },
  { id: "normalize", label: "Normalize", description: "Coerce fields into the internal shape." },
  { id: "transform", label: "Transform", description: "Map to Evidence Objects." },
  { id: "store", label: "Store", description: "Persist to the in-memory evidence store." },
  { id: "expose", label: "Expose", description: "Publish to the Evidence Workspace." },
];

export function createInitialRun(): PipelineRunState {
  return {
    runId: `run-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    status: "idle",
    stages: PIPELINE_STAGES.map((s) => ({
      id: s.id,
      label: s.label,
      description: s.description,
      status: "idle",
    })),
    errors: [],
    startedAt: new Date().toISOString(),
  };
}

type StageRunner<In, Out> = (input: In) => Promise<Out>;

interface StageReport {
  count?: number;
  message?: string;
}

interface PipelineHandlers {
  fetch: StageRunner<void, PubMedArticle[]>;
  onUpdate?: (state: PipelineRunState) => void;
}

async function runStage<In, Out>(
  state: PipelineRunState,
  id: PipelineStageId,
  input: In,
  runner: StageRunner<In, Out>,
  report?: (out: Out) => StageReport,
): Promise<{ state: PipelineRunState; output: Out }> {
  const startedAt = new Date().toISOString();
  const startMark = performance.now();
  const withRunning = updateStage(state, id, { status: "running", startedAt });
  try {
    const output = await runner(input);
    const durationMs = Math.round(performance.now() - startMark);
    const reported = report?.(output) ?? {};
    return {
      state: updateStage(withRunning, id, {
        status: "completed",
        finishedAt: new Date().toISOString(),
        durationMs,
        ...reported,
      }),
      output,
    };
  } catch (cause) {
    const message = cause instanceof Error ? cause.message : "Unknown pipeline failure.";
    const durationMs = Math.round(performance.now() - startMark);
    const kind =
      cause && typeof cause === "object" && "kind" in (cause as object)
        ? ((cause as { kind: PipelineError["kind"] }).kind)
        : "unknown";
    const error: PipelineError = { stage: id, kind, message };
    const next: PipelineRunState = {
      ...updateStage(withRunning, id, {
        status: "failed",
        finishedAt: new Date().toISOString(),
        durationMs,
        message,
      }),
      status: "failed",
      finishedAt: new Date().toISOString(),
      errors: [...withRunning.errors, error],
    };
    throw Object.assign(new Error(message), { pipelineState: next });
  }
}

function updateStage(
  state: PipelineRunState,
  id: PipelineStageId,
  patch: Partial<PipelineStageState>,
): PipelineRunState {
  return {
    ...state,
    stages: state.stages.map((s) => (s.id === id ? { ...s, ...patch } : s)),
  };
}

export interface PipelineExecutionResult {
  readonly state: PipelineRunState;
  readonly articles: readonly PubMedArticle[];
  readonly evidence: readonly EvidenceObject[];
  readonly imported: number;
}

export async function runIngestionPipeline(
  handlers: PipelineHandlers,
): Promise<PipelineExecutionResult> {
  let state: PipelineRunState = { ...createInitialRun(), status: "running" };
  const emit = () => handlers.onUpdate?.(state);
  emit();

  try {
    // Stage 1 — Fetch
    const fetched = await runStage<void, PubMedArticle[]>(
      state,
      "fetch",
      undefined,
      handlers.fetch,
      (out) => ({ count: out.length, message: `${out.length} article${out.length === 1 ? "" : "s"} retrieved.` }),
    );
    state = fetched.state; emit();

    // Stage 2 — Validate
    const validated = await runStage<PubMedArticle[], PubMedArticle[]>(
      state,
      "validate",
      fetched.output,
      async (list) => list.filter((a) => a.pmid && a.title),
      (out) => ({ count: out.length, message: `${out.length} valid record${out.length === 1 ? "" : "s"}.` }),
    );
    state = validated.state; emit();

    // Stage 3 — Normalize
    const normalized = await runStage<PubMedArticle[], PubMedArticle[]>(
      state,
      "normalize",
      validated.output,
      async (list) =>
        list.map((a) => ({
          ...a,
          title: a.title.replace(/\s+/g, " ").trim(),
          publicationYear: a.publicationYear || new Date().getFullYear(),
          language: a.language || "en",
        })),
      (out) => ({ count: out.length }),
    );
    state = normalized.state; emit();

    // Stage 4 — Transform → EvidenceObject
    const transformed = await runStage<PubMedArticle[], EvidenceObject[]>(
      state,
      "transform",
      normalized.output,
      async (list) => list.map((a) => EvidenceMapper.fromPubMed(a)),
      (out) => ({ count: out.length, message: `${out.length} Evidence Object${out.length === 1 ? "" : "s"} built.` }),
    );
    state = transformed.state; emit();

    // Stage 5 — Store
    const stored = await runStage<EvidenceObject[], number>(
      state,
      "store",
      transformed.output,
      async (list) => {
        const payload = list.map((ev, i) => ({
          record: {
            id: ev.id,
            article: normalized.output[i]!,
            importedAt: new Date().toISOString(),
          },
          evidence: ev,
        }));
        return PubMedImportStore.add(payload);
      },
      (out) => ({ count: out, message: `${out} new record${out === 1 ? "" : "s"} stored.` }),
    );
    state = stored.state; emit();

    // Stage 6 — Expose
    const exposed = await runStage<number, number>(
      state,
      "expose",
      stored.output,
      async (count) => count,
      (out) => ({
        count: out,
        message: out > 0 ? "Available in the Evidence Workspace." : "No new records to publish.",
      }),
    );
    state = { ...exposed.state, status: "completed", finishedAt: new Date().toISOString() };
    emit();

    return {
      state,
      articles: normalized.output,
      evidence: transformed.output,
      imported: stored.output,
    };
  } catch (err) {
    const failed = (err as { pipelineState?: PipelineRunState }).pipelineState;
    if (failed) {
      state = failed;
      emit();
    }
    return {
      state,
      articles: [],
      evidence: [],
      imported: 0,
    };
  }
}
