/**
 * Evidence Processing Pipeline — provider-agnostic ingestion.
 *
 *   Search → Validate → Normalize → Transform → Store → Expose
 *
 * Providers deliver raw NormalizedRecords via the ScientificSearchService;
 * the pipeline validates, normalises through each provider's own
 * `normalize` hook, transforms into EvidenceObjects and persists to the
 * shared ScientificImportStore for the Evidence Workspace.
 */

import type { EvidenceObject } from "@/features/evidence-explorer";
import {
  ExtractionOrchestrator,
  EvidenceObjectBuilder,
  type EvidenceExtraction,
} from "@/features/extraction";
import { ScientificSourceRegistry } from "../registry";
import { ScientificImportStore } from "../store/import-store";
import type {
  NormalizedRecord,
  PipelineRunState,
  PipelineStageId,
  PipelineStageState,
  SourceId,
  UnifiedSearchResult,
} from "../types";

let runSequence = 0;

export const PIPELINE_STAGES: readonly {
  id: PipelineStageId;
  label: string;
  description: string;
}[] = [
  { id: "search", label: "Search", description: "Query every scientific source in parallel." },
  { id: "validate", label: "Validate", description: "Check required metadata and identifiers." },
  { id: "normalize", label: "Normalize", description: "Coerce fields into the unified shape." },
  { id: "extract", label: "Extract", description: "Run the deterministic extraction engine." },
  { id: "transform", label: "Transform", description: "Assemble canonical Evidence Objects." },
  { id: "store", label: "Store", description: "Persist to the unified in-memory store." },
  { id: "expose", label: "Expose", description: "Publish to the Evidence Workspace." },
];

const ZERO_COUNTS: Record<SourceId, number> = {
  pubmed: 0,
  clinicaltrials: 0,
  openalex: 0,
};

export function createInitialRun(): PipelineRunState {
  runSequence += 1;

  return {
    runId: `run-${runSequence.toString().padStart(4, "0")}`,
    status: "idle",
    stages: PIPELINE_STAGES.map((s) => ({
      id: s.id,
      label: s.label,
      description: s.description,
      status: "idle",
    })),
    errors: [],
    startedAt: new Date().toISOString(),
    perSource: { ...ZERO_COUNTS },
  };
}

function patchStage(
  state: PipelineRunState,
  id: PipelineStageId,
  patch: Partial<PipelineStageState>,
): PipelineRunState {
  return {
    ...state,
    stages: state.stages.map((s) => (s.id === id ? { ...s, ...patch } : s)),
  };
}

type Emit = (next: PipelineRunState) => void;

async function runStage<In, Out>(
  state: PipelineRunState,
  id: PipelineStageId,
  input: In,
  runner: (input: In) => Promise<Out>,
  emit: Emit,
  report?: (out: Out) => { count?: number; message?: string },
): Promise<{ state: PipelineRunState; output: Out }> {
  const startedAt = new Date().toISOString();
  const t0 = performance.now();
  let next = patchStage(state, id, { status: "running", startedAt });
  emit(next);
  try {
    const output = await runner(input);
    const durationMs = Math.round(performance.now() - t0);
    const reported = report?.(output) ?? {};
    next = patchStage(next, id, {
      status: "completed",
      finishedAt: new Date().toISOString(),
      durationMs,
      ...reported,
    });
    emit(next);
    return { state: next, output };
  } catch (cause) {
    const message = cause instanceof Error ? cause.message : "Unknown pipeline failure.";
    next = patchStage(next, id, {
      status: "failed",
      finishedAt: new Date().toISOString(),
      durationMs: Math.round(performance.now() - t0),
      message,
    });
    next = {
      ...next,
      status: "failed",
      finishedAt: new Date().toISOString(),
      errors: [...next.errors, { stage: id, message }],
    };
    throw Object.assign(new Error(message), { pipelineState: next });
  }
}

export interface PipelineExecutionResult {
  readonly state: PipelineRunState;
  readonly result: UnifiedSearchResult | null;
  readonly records: readonly NormalizedRecord[];
  readonly evidence: readonly EvidenceObject[];
  readonly imported: number;
}

export interface IngestionHandlers {
  search: () => Promise<UnifiedSearchResult>;
  onUpdate?: (state: PipelineRunState) => void;
}

export async function runIngestionPipeline(
  handlers: IngestionHandlers,
): Promise<PipelineExecutionResult> {
  let state: PipelineRunState = { ...createInitialRun(), status: "running" };
  const emit: Emit = (next) => {
    state = next;
    handlers.onUpdate?.(state);
  };
  emit(state);

  try {
    const search = await runStage<void, UnifiedSearchResult>(
      state,
      "search",
      undefined,
      handlers.search,
      emit,
      (out) => {
        const parts = out.pages.map(
          (p) => `${ScientificSourceRegistry.metadataFor(p.source)?.shortName ?? p.source}: ${p.records.length}`,
        );
        return {
          count: out.records.length,
          message: parts.join(" · ") || "No records returned.",
        };
      },
    );
    state = search.state;

    const validated = await runStage<UnifiedSearchResult, NormalizedRecord[]>(
      state,
      "validate",
      search.output,
      async (r) => r.records.filter((rec) => rec.externalId && rec.title),
      emit,
      (out) => ({ count: out.length, message: `${out.length} valid record${out.length === 1 ? "" : "s"}.` }),
    );
    state = validated.state;

    const normalized = await runStage<NormalizedRecord[], NormalizedRecord[]>(
      state,
      "normalize",
      validated.output,
      async (list) =>
        list.map((rec) => {
          const provider = ScientificSourceRegistry.get(rec.source);
          return provider ? provider.normalize(rec) : rec;
        }),
      emit,
      (out) => ({ count: out.length }),
    );
    state = normalized.state;

    const extracted = await runStage<NormalizedRecord[], EvidenceExtraction[]>(
      state,
      "extract",
      normalized.output,
      async (list) =>
        Promise.all(
          list.map((rec) =>
            ExtractionOrchestrator.extract(rec, { aiProviderId: "openai" }),
          ),
        ),
      emit,
      (out) => {
        const ok = out.filter((e) => e.validation.passed).length;
        return {
          count: out.length,
          message: `${ok}/${out.length} extractions passed validation.`,
        };
      },
    );
    state = extracted.state;

    const transformed = await runStage<NormalizedRecord[], EvidenceObject[]>(
      state,
      "transform",
      normalized.output,
      async (list) =>
        list.map((rec, i) => EvidenceObjectBuilder.build(rec, extracted.output[i]!)),
      emit,
      (out) => ({
        count: out.length,
        message: `${out.length} Evidence Object${out.length === 1 ? "" : "s"} built.`,
      }),
    );
    state = transformed.state;

    const stored = await runStage<EvidenceObject[], { imported: number; perSource: Record<SourceId, number> }>(
      state,
      "store",
      transformed.output,
      async (list) => {
        const items = normalized.output.map((rec, i) => ({
          record: rec,
          evidence: list[i]!,
        }));
        const imported = ScientificImportStore.add(items);
        const perSource: Record<SourceId, number> = { ...ZERO_COUNTS };
        for (const item of items) perSource[item.record.source]++;
        return { imported, perSource };
      },
      emit,
      (out) => ({
        count: out.imported,
        message: `${out.imported} new record${out.imported === 1 ? "" : "s"} stored.`,
      }),
    );
    state = { ...stored.state, perSource: stored.output.perSource };

    const exposed = await runStage<number, number>(
      state,
      "expose",
      stored.output.imported,
      async (n) => n,
      emit,
      (out) => ({
        count: out,
        message: out > 0 ? "Available in the Evidence Workspace." : "No new records to publish.",
      }),
    );
    state = { ...exposed.state, status: "completed", finishedAt: new Date().toISOString() };
    emit(state);

    return {
      state,
      result: search.output,
      records: normalized.output,
      evidence: transformed.output,
      imported: stored.output.imported,
    };
  } catch (err) {
    const failed = (err as { pipelineState?: PipelineRunState }).pipelineState;
    if (failed) {
      state = failed;
      handlers.onUpdate?.(state);
    }
    return {
      state,
      result: null,
      records: [],
      evidence: [],
      imported: 0,
    };
  }
}
