import { useMemo } from "react";
import {
  getExtractionCatalog,
  getExtractionFlowLayers,
  getExtractionStageOverview,
} from "../services/extraction-overview-service";

export function useExtractionOverview() {
  const layers = useMemo(() => getExtractionFlowLayers(), []);
  const stages = useMemo(() => getExtractionStageOverview(), []);
  const catalog = useMemo(() => getExtractionCatalog(), []);
  return { layers, stages, catalog };
}
