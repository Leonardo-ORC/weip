import type { ExtractionStageDefinition } from "../models";

export function formatExtractionStagePosition(position: number, total: number): string {
  const pad = String(total).length;
  return `${String(position).padStart(pad, "0")} / ${total}`;
}

export function formatExtractionStageContract(stage: ExtractionStageDefinition): string {
  return `${stage.inputType} → ${stage.outputType}`;
}
