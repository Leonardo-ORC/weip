/**
 * Shared confidence math used by every intelligence service.
 * Deterministic — no randomness, so results are stable across renders.
 */

import type { EvidenceObject } from "@/features/evidence-explorer/types";
import type { ConfidenceBreakdown } from "../types";

const CONFIDENCE_WEIGHT: Record<EvidenceObject["confidence"], number> = {
  high: 1,
  moderate: 0.75,
  low: 0.45,
  "very-low": 0.2,
};

const QUALITY_WEIGHT: Record<EvidenceObject["quality"], number> = {
  A: 1,
  B: 0.8,
  C: 0.55,
  D: 0.3,
};

export function evidenceStrength(ev: EvidenceObject): number {
  const c = CONFIDENCE_WEIGHT[ev.confidence] ?? 0.4;
  const q = QUALITY_WEIGHT[ev.quality] ?? 0.4;
  return Math.min(1, c * 0.6 + q * 0.4);
}

export function clamp01(n: number): number {
  if (!Number.isFinite(n)) return 0;
  return Math.max(0, Math.min(1, n));
}

export function composeConfidence(input: {
  knowledge: number;
  evidenceCoverage: number;
  graphSupport: number;
  ai?: number;
}): ConfidenceBreakdown {
  const knowledge = clamp01(input.knowledge);
  const evidenceCoverage = clamp01(input.evidenceCoverage);
  const graphSupport = clamp01(input.graphSupport);
  const ai = clamp01(input.ai ?? 0);
  // Deterministic composite always dominates. AI contributes at most 20%.
  const deterministic = knowledge * 0.35 + evidenceCoverage * 0.35 + graphSupport * 0.3;
  const overall = clamp01(deterministic * 0.8 + ai * 0.2 + (ai > 0 ? 0 : deterministic * 0.2));
  return { knowledge, evidenceCoverage, graphSupport, ai, overall };
}
