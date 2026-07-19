import { useEffect, useMemo, useState } from "react";
import { KnowledgeGraphStore } from "@/features/graph/services/graph-store";
import { installEvidenceBridge } from "@/features/graph/bridge/evidence-bridge";
import { ResearchIntelligenceService } from "../services/intelligence-service";
import type {
  IntelligenceContext,
  IntelligenceMetricsSummary,
  InsightSurface,
  ResearchInsight,
} from "../types";
import { enrichIntelligenceServerFn } from "../functions/openai-intelligence.functions";

function useLiveContext(): IntelligenceContext {
  const [ctx, setCtx] = useState<IntelligenceContext>(() =>
    ResearchIntelligenceService.context(),
  );
  useEffect(() => {
    installEvidenceBridge();
    setCtx(ResearchIntelligenceService.context());
    return KnowledgeGraphStore.subscribe(() => {
      setCtx(ResearchIntelligenceService.context());
    });
  }, []);
  return ctx;
}

export function useIntelligenceContext(): IntelligenceContext {
  return useLiveContext();
}

export function useIntelligenceMetrics(): IntelligenceMetricsSummary {
  const ctx = useLiveContext();
  return useMemo(() => ResearchIntelligenceService.metrics(ctx), [ctx]);
}

export function useIntelligenceInsights(surface?: InsightSurface): readonly ResearchInsight[] {
  const ctx = useLiveContext();
  return useMemo(
    () =>
      surface
        ? ResearchIntelligenceService.forSurface(surface, ctx)
        : ResearchIntelligenceService.allInsights(ctx),
    [ctx, surface],
  );
}

export interface AiEnrichmentMap {
  readonly byId: ReadonlyMap<string, { summary: string; action: string | null; confidence: number; model: string | null; generatedAt: string }>;
  readonly status: "idle" | "loading" | "ready" | "error";
  readonly error: string | null;
}

const EMPTY_ENRICHMENT: AiEnrichmentMap = {
  byId: new Map(),
  status: "idle",
  error: null,
};

/**
 * Optional AI enrichment. Runs deterministically once per insight batch,
 * gracefully degrades to the deterministic descriptions on failure.
 */
export function useAiEnrichedInsights(insights: readonly ResearchInsight[]): AiEnrichmentMap {
  const [state, setState] = useState<AiEnrichmentMap>(EMPTY_ENRICHMENT);
  const key = useMemo(
    () => insights.map((i) => i.id).join("|"),
    [insights],
  );

  useEffect(() => {
    if (insights.length === 0) {
      setState(EMPTY_ENRICHMENT);
      return;
    }
    let cancelled = false;
    setState({ byId: new Map(), status: "loading", error: null });
    enrichIntelligenceServerFn({
      data: {
        items: insights.slice(0, 12).map((i) => ({
          id: i.id,
          kind: i.kind,
          title: i.title,
          description: i.description,
          tags: i.tags,
        })),
      },
    })
      .then((res) => {
        if (cancelled) return;
        if (!res.ok) {
          setState({ byId: new Map(), status: "error", error: res.error ?? "AI enrichment failed" });
          return;
        }
        const map = new Map(
          res.items.map((it) => [
            it.id,
            {
              summary: it.summary,
              action: it.action,
              confidence: it.confidence,
              model: res.model,
              generatedAt: res.generatedAt,
            },
          ]),
        );
        setState({ byId: map, status: "ready", error: null });
      })
      .catch((err) => {
        if (cancelled) return;
        setState({
          byId: new Map(),
          status: "error",
          error: err instanceof Error ? err.message : "AI enrichment failed",
        });
      });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  return state;
}
