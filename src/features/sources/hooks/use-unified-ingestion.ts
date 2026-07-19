import { useCallback, useState } from "react";
import { feedback } from "@/lib/feedback";
import { UnifiedSearchClient } from "../services";
import { createInitialRun, runIngestionPipeline } from "../pipeline";
import type {
  PipelineRunState,
  SourceId,
  UnifiedSearchQuery,
} from "../types";

export function useUnifiedIngestion() {
  const [state, setState] = useState<PipelineRunState>(() => createInitialRun());
  const [pending, setPending] = useState(false);
  const [lastImported, setLastImported] = useState(0);
  const [lastPerSource, setLastPerSource] = useState<Record<SourceId, number>>({
    pubmed: 0,
    clinicaltrials: 0,
    openalex: 0,
  });

  const ingest = useCallback(async (query: UnifiedSearchQuery) => {
    if (!query.term.trim()) return null;
    setPending(true);
    setLastImported(0);
    setState(createInitialRun());
    const toastId = feedback.loading("Ingesting evidence…", "Searching scientific sources.");
    try {
      const result = await runIngestionPipeline({
        onUpdate: (s) => setState(s),
        search: () => UnifiedSearchClient.search(query),
      });
      setState(result.state);
      setLastImported(result.imported);
      setLastPerSource(result.state.perSource);
      feedback.dismiss(toastId);
      feedback.success(
        `${result.imported} evidence record${result.imported === 1 ? "" : "s"} ingested`,
        "Records are now available in the Evidence workspace.",
      );
      return result;
    } catch (err) {
      feedback.dismiss(toastId);
      feedback.error(
        "Ingestion failed",
        "We couldn't finish ingesting these records. This is usually a temporary connectivity issue.",
      );
      throw err;
    } finally {
      setPending(false);
    }
  }, []);

  const reset = useCallback(() => {
    setState(createInitialRun());
    setLastImported(0);
  }, []);

  return { state, pending, ingest, reset, lastImported, lastPerSource };
}
