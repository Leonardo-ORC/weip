/**
 * GraphValidationService — surfaces structural and provenance issues.
 */

import type {
  GraphValidationIssue,
  GraphValidationReport,
} from "../types";
import { KnowledgeGraphStore } from "./graph-store";

export const GraphValidationService = {
  validate(): GraphValidationReport {
    const snap = KnowledgeGraphStore.snapshot();
    const issues: GraphValidationIssue[] = [];
    const seenKey = new Map<string, string>();
    for (const node of snap.nodes) {
      const key = `${node.type}:${node.canonicalKey}`;
      const existing = seenKey.get(key);
      if (existing && existing !== node.id) {
        issues.push({
          code: "duplicate-node",
          severity: "warn",
          message: `Duplicate node key "${key}" — ${existing} and ${node.id}`,
          nodeId: node.id,
        });
      } else {
        seenKey.set(key, node.id);
      }
      if (node.type !== "evidence" && node.degree === 0) {
        issues.push({
          code: "orphan-node",
          severity: "info",
          message: `Orphan node ${node.label}`,
          nodeId: node.id,
        });
      }
    }
    const nodeIds = new Set(snap.nodes.map((n) => n.id));
    for (const edge of snap.edges) {
      if (!nodeIds.has(edge.sourceId) || !nodeIds.has(edge.targetId)) {
        issues.push({
          code: "broken-edge",
          severity: "error",
          message: `Broken edge ${edge.id}`,
          edgeId: edge.id,
        });
      }
      if (edge.sourceId === edge.targetId) {
        issues.push({
          code: "circular-edge",
          severity: "warn",
          message: `Circular edge on ${edge.sourceId}`,
          edgeId: edge.id,
        });
      }
      if (edge.provenance.length === 0) {
        issues.push({
          code: "missing-provenance",
          severity: "error",
          message: `Edge ${edge.id} has no provenance`,
          edgeId: edge.id,
        });
      }
      const maxProvConfidence = edge.provenance.reduce((m, p) => Math.max(m, p.confidence), 0);
      if (edge.confidence > maxProvConfidence + 0.01) {
        issues.push({
          code: "confidence-inconsistent",
          severity: "info",
          message: `Edge confidence exceeds provenance evidence on ${edge.id}`,
          edgeId: edge.id,
        });
      }
    }
    const errorCount = issues.filter((i) => i.severity === "error").length;
    const warnCount = issues.filter((i) => i.severity === "warn").length;
    const score = Math.max(0, 1 - errorCount * 0.15 - warnCount * 0.05);
    return {
      issues,
      score,
      passed: errorCount === 0,
      checkedAt: new Date().toISOString(),
    };
  },
};

export type IGraphValidationService = typeof GraphValidationService;
