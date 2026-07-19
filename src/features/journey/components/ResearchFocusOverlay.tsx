import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import {
  ArrowRight,
  Check,
  CircleDot,
  Loader2,
  Sparkles,
  X,
} from "lucide-react";
import { AnimatedCounter } from "@/components/common/animated-counter";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { feedback } from "@/lib/feedback";
import { getStep, JOURNEY_STEPS } from "../steps";
import { journeyStore, useJourney } from "../store";
import { FOCUS_STEPS, type FocusMetric } from "../focus-steps";
import type { JourneyStepId } from "../types";

type Phase = "ready" | "running" | "success";

export function ResearchFocusOverlay() {
  const j = useJourney();
  const navigate = useNavigate();

  const stepId = j.currentStep;
  const step = getStep(stepId);
  const focus = FOCUS_STEPS[stepId];

  const [phase, setPhase] = useState<Phase>("ready");
  const [activeStage, setActiveStage] = useState(-1); // -1 = none, length = all done
  const [revealMetrics, setRevealMetrics] = useState(false);
  const timers = useRef<Array<ReturnType<typeof setTimeout>>>([]);

  // Reset phase whenever the step or focus mode changes
  useEffect(() => {
    setPhase("ready");
    setActiveStage(-1);
    setRevealMetrics(false);
    return () => {
      timers.current.forEach(clearTimeout);
      timers.current = [];
    };
  }, [stepId, j.focus, j.active]);

  // Scroll into view when overlay activates
  useEffect(() => {
    if (!j.active || !j.focus) return;
    if (typeof window === "undefined") return;
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [j.active, j.focus, stepId]);

  const isFinal = stepId === "summary";

  if (!j.active || !j.focus) return null;

  function runPipeline() {
    if (phase === "running") return;
    setPhase("running");
    setActiveStage(0);
    const stageMs = 380;
    focus.stages.forEach((_, i) => {
      const t = setTimeout(() => setActiveStage(i + 1), stageMs * (i + 1));
      timers.current.push(t);
    });
    const revealT = setTimeout(
      () => setRevealMetrics(true),
      stageMs * Math.max(2, focus.stages.length - 2),
    );
    timers.current.push(revealT);
    const doneT = setTimeout(
      () => setPhase("success"),
      stageMs * focus.stages.length + 250,
    );
    timers.current.push(doneT);
  }

  function goNext() {
    const isSummary = stepId === "summary";
    if (isSummary) {
      journeyStore.completeCurrent();
      journeyStore.exit();
      feedback.success(
        "Scientific project completed",
        "Your project remains available across the workspace.",
      );
      return;
    }
    const next = journeyStore.completeCurrent();
    feedback.success(`${step.label} complete`, focus.achievement);
    if (next) {
      const nextStep = getStep(next);
      // navigate only if route differs, avoids reload
      if (typeof window !== "undefined" && window.location.pathname !== nextStep.route) {
        navigate({ to: nextStep.route as never });
      }
    }
  }

  return (
    <div
      className="fixed inset-0 z-30 flex items-start justify-center overflow-y-auto px-4 pb-40 pt-8 md:pt-12 animate-fade-in"
      role="dialog"
      aria-modal="false"
      aria-label="Research Focus"
    >
      {/* Softening backdrop over the underlying workspace */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-background/85 backdrop-blur-md"
      />

      <div className="relative z-10 w-full max-w-4xl">
        <FocusHeader stepId={stepId} onExitFocus={() => journeyStore.setFocus(false)} />

        <section
          className={cn(
            "mt-4 overflow-hidden rounded-3xl border border-hairline bg-background shadow-elevated",
            "transition-all duration-500",
          )}
        >
          {/* Operation header */}
          <header className="border-b border-hairline px-6 py-5 md:px-8 md:py-6">
            <div className="font-mono text-[10px] uppercase tracking-[0.24em] text-muted-foreground">
              {step.eyebrow} · Research Focus
            </div>
            <h2 className="font-display mt-2 text-2xl leading-tight text-foreground md:text-[28px]">
              {focus.operation}
            </h2>
          </header>

          {/* Input · Processing · Output triptych */}
          <div className="grid gap-0 md:grid-cols-[1fr_1.15fr_1fr]">
            <InputPanel input={focus.scientificInput} />
            <ProcessingPanel
              stages={focus.stages}
              activeStage={activeStage}
              phase={phase}
            />
            <OutputPanel
              metrics={focus.outputs}
              reveal={revealMetrics || phase === "success"}
              headline={focus.outputHeadline}
            />
          </div>

          {/* Action row */}
          <footer className="flex flex-col gap-4 border-t border-hairline bg-secondary/30 px-6 py-5 md:flex-row md:items-center md:justify-between md:px-8">
            <div className="min-w-0">
              {phase === "success" ? (
                <div className="flex items-center gap-2 text-sm">
                  <span className="grid h-6 w-6 place-items-center rounded-full bg-primary text-primary-foreground">
                    <Check className="h-3.5 w-3.5" />
                  </span>
                  <div className="min-w-0">
                    <div className="font-medium text-foreground">Step completed</div>
                    <div className="text-xs text-muted-foreground">
                      {focus.achievement}
                    </div>
                  </div>
                </div>
              ) : (
                <p className="max-w-lg text-sm text-muted-foreground">
                  {step.context}
                </p>
              )}
            </div>
            <div className="flex shrink-0 items-center gap-2">
              {phase === "ready" ? (
                <Button onClick={runPipeline} size="sm" className="gap-2">
                  {isFinal ? "Compose scientific project" : step.primaryAction}
                  <ArrowRight className="h-3.5 w-3.5" />
                </Button>
              ) : phase === "running" ? (
                <Button size="sm" disabled className="gap-2">
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  Executing…
                </Button>
              ) : (
                <Button onClick={goNext} size="sm" className="gap-2">
                  {focus.nextLabel}
                  <ArrowRight className="h-3.5 w-3.5" />
                </Button>
              )}
            </div>
          </footer>
        </section>

        {/* Journey progress rail */}
        <ProgressRail
          currentStep={stepId}
          completed={j.completed}
          onStepClick={(id) => {
            journeyStore.goTo(id);
            navigate({ to: getStep(id).route as never });
          }}
        />

        {/* Final composed summary */}
        {isFinal && phase === "success" ? <FinalSummary /> : null}
      </div>
    </div>
  );
}

/* ---------- subcomponents ---------- */

function FocusHeader({
  stepId,
  onExitFocus,
}: {
  stepId: JourneyStepId;
  onExitFocus: () => void;
}) {
  const total = JOURNEY_STEPS.length;
  const index = JOURNEY_STEPS.findIndex((s) => s.id === stepId) + 1;
  return (
    <div className="flex items-center justify-between gap-4">
      <div className="flex items-center gap-2">
        <span className="grid h-6 w-6 place-items-center rounded-full bg-primary/10 text-primary">
          <Sparkles className="h-3 w-3" />
        </span>
        <span className="font-mono text-[10px] uppercase tracking-[0.24em] text-muted-foreground">
          Guided Journey · Step {index} of {total}
        </span>
      </div>
      <button
        type="button"
        onClick={onExitFocus}
        className="inline-flex items-center gap-1.5 rounded-full border border-hairline bg-background px-3 py-1 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground transition hover:text-foreground"
        title="Exit Research Focus — keep the workspace open"
      >
        <X className="h-3 w-3" />
        Exit focus
      </button>
    </div>
  );
}

function InputPanel({ input }: { input: { label: string; value: string }[] }) {
  return (
    <div className="border-b border-hairline p-6 md:border-b-0 md:border-r md:p-7">
      <SectionLabel>Scientific input</SectionLabel>
      <ul className="mt-3 space-y-3">
        {input.map((i) => (
          <li key={i.label}>
            <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
              {i.label}
            </div>
            <div className="mt-1 text-sm text-foreground">{i.value}</div>
          </li>
        ))}
      </ul>
    </div>
  );
}

function ProcessingPanel({
  stages,
  activeStage,
  phase,
}: {
  stages: string[];
  activeStage: number;
  phase: Phase;
}) {
  return (
    <div className="border-b border-hairline p-6 md:border-b-0 md:border-r md:p-7">
      <SectionLabel>
        {phase === "running" ? "Executing" : phase === "success" ? "Completed" : "Pipeline"}
      </SectionLabel>
      <ol className="mt-3 space-y-2">
        {stages.map((s, i) => {
          const done = i < activeStage;
          const current = i === activeStage - 1 && phase === "running";
          return (
            <li
              key={s}
              className={cn(
                "flex items-center gap-2.5 rounded-lg border px-3 py-2 text-sm transition",
                done
                  ? "border-hairline bg-background text-foreground"
                  : current
                    ? "border-primary/50 bg-primary/5 text-foreground"
                    : "border-hairline bg-background/50 text-muted-foreground",
              )}
            >
              <StageIcon done={done} current={current} />
              <span className="min-w-0 flex-1 truncate">{s}</span>
              {done ? (
                <span className="font-mono text-[9px] uppercase tracking-[0.18em] text-muted-foreground">
                  Done
                </span>
              ) : current ? (
                <span className="font-mono text-[9px] uppercase tracking-[0.18em] text-primary">
                  Running
                </span>
              ) : null}
            </li>
          );
        })}
      </ol>
    </div>
  );
}

function StageIcon({ done, current }: { done: boolean; current: boolean }) {
  if (done) {
    return (
      <span className="grid h-5 w-5 place-items-center rounded-full bg-foreground text-background">
        <Check className="h-3 w-3" />
      </span>
    );
  }
  if (current) {
    return (
      <span className="grid h-5 w-5 place-items-center rounded-full border border-primary text-primary">
        <Loader2 className="h-3 w-3 animate-spin" />
      </span>
    );
  }
  return (
    <span className="grid h-5 w-5 place-items-center rounded-full border border-hairline text-muted-foreground">
      <CircleDot className="h-2.5 w-2.5" />
    </span>
  );
}

function OutputPanel({
  metrics,
  reveal,
  headline,
}: {
  metrics: FocusMetric[];
  reveal: boolean;
  headline: string;
}) {
  return (
    <div className="p-6 md:p-7">
      <SectionLabel>Scientific output</SectionLabel>
      <div className="mt-3 space-y-3">
        {metrics.map((m, i) => (
          <MetricRow key={m.label} metric={m} reveal={reveal} delay={i * 120} />
        ))}
      </div>
      <div
        className={cn(
          "mt-4 border-t border-hairline pt-3 text-xs transition-opacity duration-500",
          reveal ? "opacity-100" : "opacity-0",
        )}
      >
        <span className="text-muted-foreground">Result · </span>
        <span className="text-foreground">{headline}</span>
      </div>
    </div>
  );
}

function MetricRow({
  metric,
  reveal,
  delay,
}: {
  metric: FocusMetric;
  reveal: boolean;
  delay: number;
}) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!reveal) {
      setValue(0);
      return;
    }
    const t = setTimeout(() => setValue(metric.value), delay);
    return () => clearTimeout(t);
  }, [reveal, metric.value, delay]);

  const isScore = metric.format === "score";

  return (
    <div className="flex items-baseline justify-between gap-3">
      <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
        {metric.label}
      </div>
      <div className="font-display text-lg tabular-nums text-foreground">
        <AnimatedCounter value={value} duration={900} />
        {isScore ? (
          <span className="ml-1 font-mono text-[10px] tracking-[0.2em] text-muted-foreground">
            /100
          </span>
        ) : metric.suffix ? (
          <span className="ml-1 font-mono text-[10px] tracking-[0.2em] text-muted-foreground">
            {metric.suffix}
          </span>
        ) : null}
      </div>
    </div>
  );
}

function ProgressRail({
  currentStep,
  completed,
  onStepClick,
}: {
  currentStep: JourneyStepId;
  completed: readonly JourneyStepId[];
  onStepClick: (id: JourneyStepId) => void;
}) {
  return (
    <ol className="mt-6 flex flex-wrap items-center justify-center gap-1.5">
      {JOURNEY_STEPS.map((s) => {
        const done = completed.includes(s.id);
        const current = s.id === currentStep;
        return (
          <li key={s.id}>
            <button
              type="button"
              onClick={() => onStepClick(s.id)}
              className={cn(
                "flex items-center gap-1.5 rounded-full border px-2.5 py-1 font-mono text-[9px] uppercase tracking-[0.2em] transition",
                current
                  ? "border-primary bg-primary/10 text-primary"
                  : done
                    ? "border-foreground/30 bg-background text-foreground"
                    : "border-hairline bg-background/60 text-muted-foreground",
              )}
            >
              <span
                className={cn(
                  "grid h-3.5 w-3.5 place-items-center rounded-full text-[8px]",
                  current
                    ? "bg-primary text-primary-foreground"
                    : done
                      ? "bg-foreground text-background"
                      : "border border-hairline",
                )}
              >
                {done ? <Check className="h-2 w-2" /> : s.index}
              </span>
              <span className="hidden sm:inline">{s.label}</span>
            </button>
          </li>
        );
      })}
    </ol>
  );
}

function FinalSummary() {
  const items = useMemo(
    () =>
      JOURNEY_STEPS.filter((s) => s.id !== "summary").map((s) => s.label),
    [],
  );
  return (
    <section className="mt-6 rounded-3xl border border-hairline bg-background/95 p-6 md:p-8 animate-fade-in">
      <div className="font-mono text-[10px] uppercase tracking-[0.24em] text-muted-foreground">
        Scientific project completed
      </div>
      <h3 className="font-display mt-2 text-2xl text-foreground">
        Your scientific workflow has been successfully completed.
      </h3>
      <ul className="mt-5 grid gap-2 sm:grid-cols-2">
        {items.map((label) => (
          <li
            key={label}
            className="flex items-center gap-2 rounded-lg border border-hairline bg-background px-3 py-2 text-sm text-foreground"
          >
            <span className="grid h-5 w-5 place-items-center rounded-full bg-primary text-primary-foreground">
              <Check className="h-3 w-3" />
            </span>
            {label}
          </li>
        ))}
      </ul>
    </section>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="font-mono text-[10px] uppercase tracking-[0.24em] text-muted-foreground">
      {children}
    </div>
  );
}
