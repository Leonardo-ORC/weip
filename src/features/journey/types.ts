export type JourneyStepId =
  | "sources"
  | "extraction"
  | "evidence"
  | "graph"
  | "intelligence"
  | "drug-score"
  | "summary";

export interface JourneyStep {
  id: JourneyStepId;
  index: number;
  label: string;
  eyebrow: string;
  route: string;
  objective: string;
  context: string;
  primaryAction: string;
  result: string;
}

export interface JourneyState {
  active: boolean;
  currentStep: JourneyStepId;
  completed: JourneyStepId[];
  startedAt: string | null;
}
