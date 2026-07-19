import { ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ValidationReport, ValidationSeverity } from "../types";
import { PanelShell } from "./PanelShell";

const SEVERITY_TONE: Record<ValidationSeverity, string> = {
  info: "bg-muted text-muted-foreground",
  warn: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
  error: "bg-destructive/10 text-destructive",
};

export function ValidationPanel({ validation }: { validation: ValidationReport }) {
  return (
    <PanelShell icon={ShieldCheck} title="Validation" eyebrow={`Score ${Math.round(validation.score * 100)}`}>
      {validation.issues.length === 0 ? (
        <p className="text-sm text-muted-foreground">No validation issues detected.</p>
      ) : (
        <ul className="grid gap-1.5">
          {validation.issues.map((issue) => (
            <li key={issue.code} className="flex items-start gap-2 text-xs">
              <span
                className={cn(
                  "mt-0.5 rounded-full px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-[0.16em]",
                  SEVERITY_TONE[issue.severity],
                )}
              >
                {issue.severity}
              </span>
              <span className="min-w-0">
                <span className="text-foreground">{issue.message}</span>
                <span className="ml-1 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                  {issue.code}
                </span>
              </span>
            </li>
          ))}
        </ul>
      )}
    </PanelShell>
  );
}
