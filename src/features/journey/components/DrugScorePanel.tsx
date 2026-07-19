import { DEMO_DRUG_SCORE, DEMO_PROJECT } from "../dataset";

export function DrugScorePanel() {
  const { overall, grade, breakdown } = DEMO_DRUG_SCORE;
  return (
    <section className="rounded-2xl border border-hairline bg-background/60 p-6 lg:p-8">
      <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
        <div className="min-w-0">
          <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
            Drug Score · {DEMO_PROJECT.drug}
          </div>
          <h2 className="font-display mt-2 text-2xl text-foreground">
            How well has {DEMO_PROJECT.drug} been studied in {DEMO_PROJECT.population.toLowerCase()}?
          </h2>
          <p className="mt-2 max-w-xl text-sm text-muted-foreground">
            An objective, transparent measure of research completeness — derived
            from the Evidence Objects and Knowledge Graph you just built.
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-4 rounded-2xl border border-hairline bg-background px-5 py-4">
          <div className="text-right">
            <div className="font-display text-5xl leading-none tracking-tight text-royal">
              {overall}
            </div>
            <div className="mt-1 font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
              /100
            </div>
          </div>
          <div className="h-12 w-px bg-hairline" />
          <div>
            <div className="font-display text-3xl text-foreground">{grade}</div>
            <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
              Grade
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-2">
        {breakdown.map((b) => (
          <div key={b.label} className="rounded-xl border border-hairline p-4">
            <div className="flex items-baseline justify-between">
              <div className="text-sm font-medium text-foreground">{b.label}</div>
              <div className="font-mono text-sm text-foreground">{b.value}</div>
            </div>
            <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-secondary">
              <div
                className="h-full rounded-full bg-primary"
                style={{ width: `${b.value}%` }}
              />
            </div>
            <p className="mt-2 text-xs text-muted-foreground">{b.note}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
