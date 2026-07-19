import { useEffect, useRef, useState } from "react";
import { useNavigate, useRouterState } from "@tanstack/react-router";
import { ArrowRight, Sparkles, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { feedback } from "@/lib/feedback";
import { journeyStore, useJourney } from "../store";
import { getStep, JOURNEY_STEPS } from "../steps";
import type { JourneyStepId } from "../types";

/**
 * Contextual guidance for the Guided Research Journey.
 *
 * - Never covers the workspace: renders a floating ring around a real UI element
 *   plus a compact 2-sentence callout, positioned next to it.
 * - Falls back to a docked callout above the JourneyBar when no target exists
 *   on the current page (or the researcher is on a different route than the step).
 */

interface CoachSpec {
  selector: string;
  title: string; // dominant step title
  helper: string; // ≤ 2 sentences
  primaryLabel: string;
}

const COACH: Record<JourneyStepId, CoachSpec> = {
  sources: {
    selector: '[data-journey-target="sources"]',
    title: "Import Scientific Studies",
    helper:
      "Import the demonstration studies on metformin in PCOS. WEIP will unify PubMed, ClinicalTrials.gov and OpenAlex before extraction.",
    primaryLabel: "Mark sources imported",
  },
  extraction: {
    selector: '[data-journey-target="extraction"]',
    title: "Extract Evidence Objects",
    helper:
      "Run the extraction pipeline. Deterministic extractors run first; AI enriches — never replaces — the structured fields.",
    primaryLabel: "Mark extraction complete",
  },
  evidence: {
    selector: '[data-journey-target="evidence"]',
    title: "Review Evidence Objects",
    helper:
      "Review the canonical Evidence Objects. Every record is typed, comparable and linked back to its source.",
    primaryLabel: "Mark evidence reviewed",
  },
  graph: {
    selector: '[data-journey-target="graph"]',
    title: "Build Knowledge Graph",
    helper:
      "Explore the semantic relationships built from the evidence. Nodes and edges keep provenance and confidence.",
    primaryLabel: "Mark graph explored",
  },
  intelligence: {
    selector: '[data-journey-target="intelligence"]',
    title: "Generate Research Intelligence",
    helper:
      "Generate research intelligence. Insights, gaps and trends are traceable to their supporting evidence.",
    primaryLabel: "Mark intelligence generated",
  },
  "drug-score": {
    selector: '[data-journey-target="drug-score"]',
    title: "Calculate Drug Score",
    helper:
      "Calculate the Women's Drug Score for metformin in PCOS. Coverage, quality and representation compose the final grade.",
    primaryLabel: "Mark score calculated",
  },
  summary: {
    selector: '[data-journey-target="summary"]',
    title: "Complete Project Summary",
    helper:
      "The full scientific project is ready. Continue using WEIP — every artifact stays available in the workspace.",
    primaryLabel: "Continue using WEIP",
  },
};

interface Rect {
  top: number;
  left: number;
  width: number;
  height: number;
}

export function JourneyCoach() {
  const j = useJourney();
  const navigate = useNavigate();
  const path = useRouterState({ select: (s) => s.location.pathname });

  const stepId = j.currentStep;
  const step = getStep(stepId);
  const spec = COACH[stepId];

  const [rect, setRect] = useState<Rect | null>(null);
  const scrolledFor = useRef<string | null>(null);

  // Track target position (also handles scroll/resize).
  useEffect(() => {
    if (!j.active || typeof window === "undefined") {
      setRect(null);
      return;
    }

    let raf = 0;
    let alive = true;
    const measure = () => {
      const el = document.querySelector(spec.selector) as HTMLElement | null;
      if (!el) {
        setRect(null);
      } else {
        const r = el.getBoundingClientRect();
        setRect({ top: r.top, left: r.left, width: r.width, height: r.height });
        // scroll once per (route, step) into view
        const key = `${path}::${stepId}`;
        if (scrolledFor.current !== key) {
          scrolledFor.current = key;
          el.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      }
      if (alive) raf = window.requestAnimationFrame(measure);
    };
    measure();

    const onResize = () => measure();
    window.addEventListener("resize", onResize);
    return () => {
      alive = false;
      window.cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
    };
  }, [j.active, stepId, spec.selector, path]);

  if (!j.active) return null;

  const onRoute = matchesRoute(path, step.route);

  function complete() {
    const isSummary = stepId === "summary";
    const next = journeyStore.completeCurrent();
    feedback.success(`${step.label} complete`, step.result);
    if (isSummary) {
      journeyStore.exit();
      return;
    }
    if (next) {
      const nextRoute = getStep(next).route;
      navigate({ to: nextRoute as never });
    }
  }

  function goToStepRoute() {
    navigate({ to: step.route as never });
  }

  // Docked callout (fallback) — user isn't on the step route or target not mounted.
  if (!onRoute || !rect) {
    return (
      <DockedCallout
        stepId={stepId}
        title={step.objective}
        helper={spec.helper}
        primaryLabel={onRoute ? spec.primaryLabel : `Open ${step.label}`}
        onPrimary={onRoute ? complete : goToStepRoute}
      />
    );
  }

  // Positioned ring + tooltip
  return (
    <AnchoredCoach
      rect={rect}
      stepId={stepId}
      title={spec.title}
      helper={spec.helper}
      primaryLabel={spec.primaryLabel}
      onPrimary={complete}
    />
  );
}

/* ---------- pieces ---------- */

function AnchoredCoach({
  rect,
  stepId,
  title,
  helper,
  primaryLabel,
  onPrimary,
}: {
  rect: Rect;
  stepId: JourneyStepId;
  title: string;
  helper: string;
  primaryLabel: string;
  onPrimary: () => void;
}) {
  const step = getStep(stepId);
  const stepNumber = step.index;
  const total = JOURNEY_STEPS.length;

  // Position the card: below by default, above if not enough room.
  const vw = typeof window !== "undefined" ? window.innerWidth : 1200;
  const vh = typeof window !== "undefined" ? window.innerHeight : 800;
  const tooltipW = Math.min(480, vw - 32);
  const spaceBelow = vh - (rect.top + rect.height);
  const placeAbove = spaceBelow < 260 && rect.top > 260;

  const tooltipTop = placeAbove
    ? Math.max(16, rect.top - 12 - 240)
    : Math.min(vh - 240, rect.top + rect.height + 12);
  const tooltipLeft = Math.max(
    16,
    Math.min(vw - tooltipW - 16, rect.left + rect.width / 2 - tooltipW / 2),
  );

  return (
    <>
      {/* Ring — never blocks interaction */}
      <div
        aria-hidden
        className="pointer-events-none fixed z-40 rounded-2xl ring-2 ring-primary/70 ring-offset-2 ring-offset-background transition-all duration-300 animate-fade-in"
        style={{
          top: rect.top - 6,
          left: rect.left - 6,
          width: rect.width + 12,
          height: rect.height + 12,
          boxShadow: "0 0 0 6px hsl(var(--primary) / 0.10), 0 12px 40px -12px hsl(var(--primary) / 0.35)",
        }}
      />
      {/* Soft pulse layer */}
      <div
        aria-hidden
        className="pointer-events-none fixed z-40 rounded-2xl animate-pulse"
        style={{
          top: rect.top - 6,
          left: rect.left - 6,
          width: rect.width + 12,
          height: rect.height + 12,
          boxShadow: "0 0 0 3px hsl(var(--primary) / 0.35)",
        }}
      />
      {/* Context Card */}
      <div
        role="status"
        aria-live="polite"
        className="pointer-events-auto fixed z-40 animate-fade-in"
        style={{ top: tooltipTop, left: tooltipLeft, width: tooltipW }}
      >
        <JourneyContextCard
          stepNumber={stepNumber}
          total={total}
          title={title}
          helper={helper}
          primaryLabel={primaryLabel}
          onPrimary={onPrimary}
        />
      </div>
    </>
  );
}

function DockedCallout({
  stepId,
  title,
  helper,
  primaryLabel,
  onPrimary,
}: {
  stepId: JourneyStepId;
  title: string;
  helper: string;
  primaryLabel: string;
  onPrimary: () => void;
}) {
  const step = getStep(stepId);
  return (
    <div
      role="status"
      aria-live="polite"
      className="pointer-events-none fixed inset-x-0 bottom-24 z-40 flex justify-end px-4 animate-fade-in"
    >
      <div className="pointer-events-auto w-full max-w-sm overflow-hidden rounded-2xl border border-hairline bg-background/95 shadow-elevated backdrop-blur-xl">
        <div className="flex items-center justify-between gap-2 border-b border-hairline px-4 py-2">
          <div className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
            <Sparkles className="h-3 w-3 text-primary" />
            Step {step.index} of {JOURNEY_STEPS.length} · {step.label}
          </div>
          <button
            type="button"
            onClick={() => journeyStore.exit()}
            className="rounded-full p-1 text-muted-foreground transition hover:text-foreground"
            aria-label="Pause guided journey"
            title="Pause — progress is saved"
          >
            <X className="h-3 w-3" />
          </button>
        </div>
        <div className="p-4">
          <h3 className="font-display text-sm leading-snug text-foreground">{title}</h3>
          <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">{helper}</p>
          <div className="mt-3 flex justify-end">
            <Button size="sm" onClick={onPrimary} className="gap-2">
              {primaryLabel}
              <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

function matchesRoute(current: string, target: string) {
  if (current === target) return true;
  // /app/journey hub covers drug-score & summary panels
  return current.replace(/\/+$/, "") === target.replace(/\/+$/, "");
}
