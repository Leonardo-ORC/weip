import { Baby } from "lucide-react";
import type { WomensHealthConceptSet } from "../types";
import { PanelShell } from "./PanelShell";

const CONCEPT_LABEL: Record<string, string> = {
  pregnancy: "Pregnancy",
  trimester: "Trimester",
  breastfeeding: "Breastfeeding",
  postpartum: "Postpartum",
  menopause: "Menopause",
  perimenopause: "Perimenopause",
  premenopause: "Premenopause",
  pcos: "PCOS",
  endometriosis: "Endometriosis",
  fertility: "Fertility",
  ivf: "IVF",
  contraception: "Contraception",
  "hormonal-therapy": "Hormonal therapy",
  "menstrual-cycle": "Menstrual cycle",
  gynecologic: "Gynecologic",
  "reproductive-health": "Reproductive health",
};

export function WomensHealthPanel({ concepts }: { concepts: WomensHealthConceptSet }) {
  return (
    <PanelShell icon={Baby} title="Women's health" eyebrow="Concepts">
      {concepts.matches.length === 0 ? (
        <p className="text-sm text-muted-foreground">No women's health concepts detected.</p>
      ) : (
        <>
          {concepts.primary ? (
            <div className="mb-3 text-xs text-muted-foreground">
              Primary concept:{" "}
              <span className="text-foreground">{CONCEPT_LABEL[concepts.primary]}</span>
            </div>
          ) : null}
          <div className="flex flex-wrap gap-1.5">
            {concepts.matches.map((m) => (
              <span
                key={m.concept}
                className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-2.5 py-1 text-[11px] text-primary"
                title={`${Math.round(m.confidence * 100)}% confidence`}
              >
                {CONCEPT_LABEL[m.concept] ?? m.concept}
              </span>
            ))}
          </div>
        </>
      )}
    </PanelShell>
  );
}
