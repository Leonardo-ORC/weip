import { useSyncExternalStore } from "react";
import type { JourneyState, JourneyStepId } from "./types";
import { JOURNEY_STEPS, STEP_INDEX, nextStepId } from "./steps";

const STORAGE_KEY = "weip:journey:v1";

const initialState: JourneyState = {
  active: false,
  currentStep: "sources",
  completed: [],
  startedAt: null,
  focus: true,
};

let state: JourneyState = initialState;
const listeners = new Set<() => void>();

function isBrowser() {
  return typeof window !== "undefined";
}

function load(): JourneyState {
  if (!isBrowser()) return initialState;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return initialState;
    const parsed = JSON.parse(raw) as Partial<JourneyState>;
    return { ...initialState, ...parsed };
  } catch {
    return initialState;
  }
}

function persist(next: JourneyState) {
  state = next;
  if (isBrowser()) {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      /* ignore */
    }
  }
  listeners.forEach((l) => l());
}

let hydrated = false;
function ensureHydrated() {
  if (hydrated || !isBrowser()) return;
  hydrated = true;
  state = load();
  listeners.forEach((l) => l());
}

function subscribe(l: () => void) {
  ensureHydrated();
  listeners.add(l);
  return () => listeners.delete(l);
}

export const journeyStore = {
  get: () => state,
  subscribe,
  start() {
    persist({
      active: true,
      currentStep: "sources",
      completed: [],
      startedAt: new Date("2026-01-01T00:00:00Z").toISOString(),
      focus: true,
    });
  },
  exit() {
    persist({ ...state, active: false });
  },
  resume() {
    persist({ ...state, active: true });
  },
  reset() {
    persist(initialState);
  },
  setFocus(v: boolean) {
    persist({ ...state, focus: v });
  },
  toggleFocus() {
    persist({ ...state, focus: !state.focus });
  },
  goTo(id: JourneyStepId) {
    persist({ ...state, currentStep: id, active: true });
  },
  completeCurrent(): JourneyStepId | null {
    const current = state.currentStep;
    const completed = state.completed.includes(current)
      ? state.completed
      : [...state.completed, current];
    const next = nextStepId(current);
    persist({
      ...state,
      completed,
      currentStep: next ?? current,
      active: true,
    });
    return next;
  },
};

export function useJourney() {
  const s = useSyncExternalStore(subscribe, () => state, () => initialState);
  const currentIndex = STEP_INDEX[s.currentStep];
  return {
    ...s,
    steps: JOURNEY_STEPS,
    currentIndex,
    isComplete: s.completed.length === JOURNEY_STEPS.length,
    isStepComplete: (id: JourneyStepId) => s.completed.includes(id),
  };
}
