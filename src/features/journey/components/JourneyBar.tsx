import { useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { X, ChevronRight, Info, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { feedback } from "@/lib/feedback";
import { useJourney, journeyStore } from "../store";
import { getStep } from "../steps";
import { JourneyIndicator } from "./JourneyIndicator";

export function JourneyBar() {
  const j = useJourney();
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState(true);
  const [busy, setBusy] = useState(false);

  if (!j.active) return null;

  const step = getStep(j.currentStep);

  async function handlePrimary() {
    setBusy(true);
    await new Promise((r) => setTimeout(r, 650));
    const next = journeyStore.completeCurrent();
    feedback.success(`${step.label} complete`, step.result);
    if (next) {
      const nextStep = getStep(next);
      navigate({ to: nextStep.route as never });
    }
    setBusy(false);
  }

  function handleExit() {
    journeyStore.exit();
    feedback.info(
      "Guided Journey paused",
      "Your progress is saved. Resume anytime from the dashboard.",
    );
  }

  return (
    <div
      role="region"
      aria-label="Guided Research Journey"
      className="pointer-events-none fixed inset-x-0 bottom-0 z-40 flex justify-center px-4 pb-4"
    >
      <div className="pointer-events-auto w-full max-w-6xl overflow-hidden rounded-2xl border border-hairline bg-background/95 shadow-elevated backdrop-blur-xl">
        {/* Progress rail */}
        <div className="flex items-center justify-between gap-4 border-b border-hairline px-4 py-2.5">
          <div className="flex min-w-0 items-center gap-2">
            <Sparkles className="h-3.5 w-3.5 shrink-0 text-primary" />
            <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
              Guided Journey
            </span>
          </div>
          <div className="min-w-0 overflow-x-auto">
            <JourneyIndicator
              currentStep={j.currentStep}
              completed={j.completed}
              onStepClick={(id) => {
                journeyStore.goTo(id);
                navigate({ to: getStep(id).route as never });
              }}
              compact
            />
          </div>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setExpanded((v) => !v)}
              className="rounded-full border border-hairline px-2 py-1 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground transition hover:text-foreground"
              aria-expanded={expanded}
            >
              {expanded ? "Hide" : "Details"}
            </button>
            <button
              type="button"
              onClick={handleExit}
              className="rounded-full border border-hairline p-1.5 text-muted-foreground transition hover:text-foreground"
              aria-label="Exit Guided Journey"
              title="Exit — your progress is saved"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        {/* Context + primary action */}
        {expanded ? (
          <div className="flex flex-col gap-4 px-5 py-4 md:flex-row md:items-center md:justify-between">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
                <Info className="h-3 w-3" />
                {step.eyebrow} · {step.label}
              </div>
              <h3 className="font-display mt-1 text-base text-foreground">
                {step.objective}
              </h3>
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                {step.context}
              </p>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              <Button
                onClick={handlePrimary}
                loading={busy}
                loadingText="Working…"
                size="sm"
                className="gap-2"
              >
                {step.primaryAction}
                <ChevronRight className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
