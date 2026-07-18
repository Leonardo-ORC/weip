import { useMemo } from "react";
import {
  getPipelineOverview,
  getPlatformLayers,
} from "../services/pipeline-overview-service";

export function usePipelineOverview() {
  const stages = useMemo(() => getPipelineOverview(), []);
  const layers = useMemo(() => getPlatformLayers(), []);
  return { stages, layers };
}
