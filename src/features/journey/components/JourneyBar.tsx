import { useNavigate } from "@tanstack/react-router";
import { X, Sparkles, RotateCcw } from "lucide-react";
import { feedback } from "@/lib/feedback";
import { useJourney, journeyStore } from "../store";
import { getStep } from "../steps";
import { JourneyIndicator } from "./JourneyIndicator";

/**
 * Minimal, non-competing progress bar.
 * Contextual guidance (objective + primary action) lives in JourneyCoach,
 * anchored to the real UI element for the current step.
 */
export function JourneyBar() {
  const j = useJourney();
  const navigate = useNavigate();

  if (!j.active) return null;

  function handleExit() {
    journeyStore.exit();
    feedback.info(
      "Guided Journey paused",
      "Your progress is saved. Resume anytime from the dashboard.",
    );
  }

  function handleRestart() {
    journeyStore.reset();
    journeyStore.start();
    navigate({ to: getStep("sources").route as never });
    feedback.info("Guided Journey restarted", "Back to step 1 — Scientific Sources.");
  }

  return (
    <div
      role="region"
      aria-label="Guided Research Journey"
      className="pointer-events-none fixed inset-x-0 bottom-0 z-30 flex justify-center px-4 pb-4"
    >
      <div className="pointer-events-auto w-full max-w-5xl overflow-hidden rounded-full border border-hairline bg-background/95 shadow-elevated backdrop-blur-xl">
        <div className="flex items-center justify-between gap-4 px-4 py-2">
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
              onClick={handleRestart}
              className="inline-flex items-center gap-1.5 rounded-full border border-hairline px-2 py-1 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground transition hover:text-foreground"
              title="Restart the Guided Journey from step 1"
              aria-label="Restart Guided Journey"
            >
              <RotateCcw className="h-3 w-3" />
              Restart
            </button>
            <button
              type="button"
              onClick={handleExit}
              className="rounded-full border border-hairline p-1.5 text-muted-foreground transition hover:text-foreground"
              aria-label="Pause Guided Journey"
              title="Pause — your progress is saved"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
