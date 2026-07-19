import { useNavigate } from "@tanstack/react-router";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useJourney, journeyStore } from "../store";
import { getStep } from "../steps";
import { JOURNEY_STEPS } from "../steps";

interface Props {
  variant?: "dashboard" | "landing";
}

export function JourneyEntryCard({ variant = "dashboard" }: Props) {
  const j = useJourney();
  const navigate = useNavigate();
  const hasProgress = j.completed.length > 0 || j.startedAt !== null;

  function start() {
    if (!hasProgress) journeyStore.start();
    else journeyStore.resume();
    navigate({ to: getStep(j.currentStep).route as never });
  }

  function restart() {
    journeyStore.reset();
    journeyStore.start();
    navigate({ to: getStep("sources").route as never });
  }

  const isLanding = variant === "landing";

  return (
    <section
      className={
        isLanding
          ? "rounded-3xl border border-hairline bg-background/70 p-8 shadow-soft backdrop-blur-sm"
          : "rounded-2xl border border-hairline bg-gradient-to-br from-primary/[0.04] via-background to-background p-6"
      }
    >
      <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.22em] text-primary">
        <Sparkles className="h-3 w-3" />
        Guided Research Journey
      </div>
      <h2 className="font-display mt-2 text-xl text-foreground md:text-2xl">
        Experience the full scientific workflow in five minutes.
      </h2>
      <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
        Walk through a real scientific project — from imported studies to a
        calculated Drug Score — using a curated demonstration dataset. Every
        step happens inside the real platform.
      </p>

      <ol className="mt-5 flex flex-wrap items-center gap-x-2 gap-y-1.5 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
        {JOURNEY_STEPS.map((s, i) => (
          <li key={s.id} className="flex items-center gap-2">
            <span className="text-foreground/70">{s.label}</span>
            {i < JOURNEY_STEPS.length - 1 ? <span aria-hidden>→</span> : null}
          </li>
        ))}
      </ol>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <Button onClick={start} size="sm" className="gap-2">
          {hasProgress ? "Resume journey" : "Start guided journey"}
          <ArrowRight className="h-3.5 w-3.5" />
        </Button>
        {hasProgress ? (
          <button
            type="button"
            onClick={restart}
            className="text-xs text-muted-foreground underline-offset-4 transition hover:text-foreground hover:underline"
          >
            Restart from step 1
          </button>
        ) : null}
        {hasProgress ? (
          <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
            {j.completed.length}/{JOURNEY_STEPS.length} completed
          </span>
        ) : null}
      </div>
    </section>
  );
}
