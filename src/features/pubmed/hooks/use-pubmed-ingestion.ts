import { useCallback, useMemo, useState } from "react";
import { EvidenceProcessingService } from "../services";
import { createInitialRun } from "../pipeline";
import type { PipelineRunState } from "../types";

export function usePubMedIngestion() {
  const [state, setState] = useState<PipelineRunState>(() => createInitialRun());
  const [pending, setPending] = useState(false);
  const [lastImported, setLastImported] = useState(0);

  const ingest = useCallback(async (ids: readonly string[]) => {
    if (!ids.length) return;
    setPending(true);
    setLastImported(0);
    const initial = createInitialRun();
    setState(initial);
    try {
      const result = await EvidenceProcessingService.ingestFromIds(ids, (s) => setState(s));
      setState(result.state);
      setLastImported(result.imported);
      return result;
    } finally {
      setPending(false);
    }
  }, []);

  const reset = useCallback(() => {
    setState(createInitialRun());
    setLastImported(0);
  }, []);

  const summary = useMemo(() => {
    const failed = state.stages.find((s) => s.status === "failed");
    return {
      isRunning: state.status === "running",
      isCompleted: state.status === "completed",
      isFailed: state.status === "failed",
      failedStage: failed?.id,
      firstError: state.errors[0]?.message,
    };
  }, [state]);

  return { state, pending, ingest, reset, lastImported, summary };
}
