import { Dna } from "lucide-react";
import type { BiomedicalEntitySet } from "../types";
import { PanelShell } from "./PanelShell";

const KIND_LABEL: Record<string, string> = {
  disease: "Disease",
  condition: "Condition",
  hormone: "Hormone",
  drug: "Drug",
  biomarker: "Biomarker",
  gene: "Gene",
  protein: "Protein",
  "lab-test": "Lab test",
  symptom: "Symptom",
  procedure: "Procedure",
  "clinical-outcome": "Outcome",
  device: "Device",
};

export function BiomedicalEntitiesPanel({ entities }: { entities: BiomedicalEntitySet }) {
  const items = entities.items;
  return (
    <PanelShell icon={Dna} title="Biomedical entities" eyebrow="Extracted">
      {items.length === 0 ? (
        <p className="text-sm text-muted-foreground">No biomedical entities matched.</p>
      ) : (
        <div className="flex flex-wrap gap-1.5">
          {items.map((item) => (
            <span
              key={`${item.kind}-${item.label}`}
              className="inline-flex items-center gap-1.5 rounded-full border border-hairline bg-background/60 px-2.5 py-1 text-[11px] text-foreground"
              title={`${Math.round(item.confidence * 100)}% confidence`}
            >
              <span className="font-mono text-[9px] uppercase tracking-[0.18em] text-muted-foreground">
                {KIND_LABEL[item.kind] ?? item.kind}
              </span>
              {item.label}
            </span>
          ))}
        </div>
      )}
    </PanelShell>
  );
}
