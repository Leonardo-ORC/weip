import type { PipelineStageDefinition } from "../types";

export function formatStagePosition(position: number, total: number): string {
  const pad = String(total).length;
  return `${String(position).padStart(pad, "0")} / ${total}`;
}

export function formatStageIoContract(stage: PipelineStageDefinition): string {
  return `${stage.inputType} → ${stage.outputType}`;
}
