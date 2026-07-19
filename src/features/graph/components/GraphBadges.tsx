import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import type { GraphEdgeType, GraphNodeType } from "../types";

const NODE_TONE: Record<GraphNodeType, string> = {
  evidence: "bg-primary/10 text-primary border-primary/20",
  disease: "bg-rose-500/10 text-rose-700 border-rose-500/20 dark:text-rose-300",
  condition: "bg-amber-500/10 text-amber-700 border-amber-500/20 dark:text-amber-300",
  hormone: "bg-teal-500/10 text-teal-700 border-teal-500/20 dark:text-teal-300",
  drug: "bg-indigo-500/10 text-indigo-700 border-indigo-500/20 dark:text-indigo-300",
  biomarker: "bg-emerald-500/10 text-emerald-700 border-emerald-500/20 dark:text-emerald-300",
  symptom: "bg-orange-500/10 text-orange-700 border-orange-500/20 dark:text-orange-300",
  procedure: "bg-sky-500/10 text-sky-700 border-sky-500/20 dark:text-sky-300",
  "lab-test": "bg-cyan-500/10 text-cyan-700 border-cyan-500/20 dark:text-cyan-300",
  gene: "bg-violet-500/10 text-violet-700 border-violet-500/20 dark:text-violet-300",
  protein: "bg-fuchsia-500/10 text-fuchsia-700 border-fuchsia-500/20 dark:text-fuchsia-300",
  "clinical-outcome": "bg-emerald-500/10 text-emerald-700 border-emerald-500/20 dark:text-emerald-300",
  "womens-health-concept": "bg-pink-500/10 text-pink-700 border-pink-500/20 dark:text-pink-300",
  project: "bg-secondary text-foreground border-hairline",
  collection: "bg-secondary text-foreground border-hairline",
  "research-question": "bg-secondary text-foreground border-hairline",
  hypothesis: "bg-secondary text-foreground border-hairline",
};

export const NODE_TYPE_LABEL: Record<GraphNodeType, string> = {
  evidence: "Evidence",
  disease: "Disease",
  condition: "Condition",
  hormone: "Hormone",
  drug: "Drug",
  biomarker: "Biomarker",
  symptom: "Symptom",
  procedure: "Procedure",
  "lab-test": "Lab test",
  gene: "Gene",
  protein: "Protein",
  "clinical-outcome": "Outcome",
  "womens-health-concept": "Women's health",
  project: "Project",
  collection: "Collection",
  "research-question": "Question",
  hypothesis: "Hypothesis",
};

export function NodeTypeBadge({ type, children }: { type: GraphNodeType; children?: ReactNode }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-medium uppercase tracking-[0.14em]",
        NODE_TONE[type],
      )}
    >
      {children ?? NODE_TYPE_LABEL[type]}
    </span>
  );
}

export function EdgeTypeBadge({ type }: { type: GraphEdgeType }) {
  return (
    <span className="inline-flex items-center rounded-full border border-hairline bg-secondary px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
      {type.replace(/_/g, " ")}
    </span>
  );
}
