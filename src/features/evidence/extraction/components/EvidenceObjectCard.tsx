import { cn } from "@/lib/utils";
import { EVIDENCE_OBJECT_SCHEMA_VERSION } from "../models/evidence-object";

const FIELDS: readonly { key: string; description: string }[] = [
  { key: "identifier", description: "Stable, citable id" },
  { key: "source", description: "Provider + external id + license" },
  { key: "citation", description: "Bibliographic pointer (DOI / PMID / NCT)" },
  { key: "publication", description: "Title, journal, year, authors" },
  { key: "study", description: "Design, phase, duration, blinding" },
  { key: "population", description: "Sex, age, inclusion / exclusion" },
  { key: "condition", description: "Disease + coded ontology terms" },
  { key: "intervention", description: "Drug, device, dosage, route" },
  { key: "comparison", description: "Placebo, active, standard of care" },
  { key: "outcomes", description: "Primary + secondary endpoints" },
  { key: "adverseEvents", description: "Terms, grades, MedDRA codes" },
  { key: "hormonalStatus", description: "Endogenous / therapy exposure" },
  { key: "pregnancyStatus", description: "Pregnant, postpartum, lactating" },
  { key: "menopauseStatus", description: "Pre / peri / post / surgical" },
  { key: "ageRange", description: "Min, max, mean, unit" },
  { key: "sampleSize", description: "Enrolled participants" },
  { key: "country", description: "Study geography" },
  { key: "studyDesign", description: "Canonical design taxonomy" },
  { key: "effectSize", description: "Measure, value, CI, p-value" },
  { key: "confidence", description: "Very-low → very-high" },
  { key: "limitations", description: "Reported constraints" },
  { key: "qualityIndicators", description: "GRADE, RoB 2, Newcastle-Ottawa" },
  { key: "metadata", description: "Extraction lineage + schema version" },
];

export function EvidenceObjectCard({ className }: { className?: string }) {
  return (
    <article
      className={cn(
        "surface-card flex flex-col gap-6 p-8",
        className,
      )}
    >
      <header className="flex flex-col gap-2">
        <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
          Central entity · schema {EVIDENCE_OBJECT_SCHEMA_VERSION}
        </span>
        <h3 className="font-display text-2xl tracking-tight">
          The Evidence Object
        </h3>
        <p className="text-sm leading-relaxed text-muted-foreground">
          A single, strongly typed record capturing everything the platform
          knows about one piece of scientific evidence. Every downstream
          layer — intelligence, gaps, applications — reads exclusively from
          this shape.
        </p>
      </header>
      <ul className="grid gap-x-8 gap-y-3 sm:grid-cols-2 lg:grid-cols-3">
        {FIELDS.map((field) => (
          <li key={field.key} className="flex flex-col gap-0.5">
            <code className="font-mono text-[12px] text-foreground">
              {field.key}
            </code>
            <span className="text-xs leading-relaxed text-muted-foreground">
              {field.description}
            </span>
          </li>
        ))}
      </ul>
    </article>
  );
}
