import { HelpCircle } from "lucide-react";
import type { ResearchProject, ResearchQuestion } from "../types";
import { PriorityBadge, QuestionStatusBadge, RelativeTime } from "./ResearchBadge";

export function QuestionCard({
  question,
  projectTitle,
}: {
  question: ResearchQuestion;
  projectTitle?: string;
}) {
  return (
    <article className="rounded-2xl border border-hairline bg-background/60 p-5">
      <div className="flex items-start gap-3">
        <div className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-secondary text-foreground/80">
          <HelpCircle className="h-4 w-4" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="mb-1 flex items-center gap-2">
            <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
              {projectTitle ?? "Question"}
            </span>
            <span className="text-muted-foreground/40">·</span>
            <RelativeTime iso={question.updatedAt} />
          </div>
          <h4 className="font-display text-base leading-snug tracking-tight text-foreground">
            {question.question}
          </h4>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{question.rationale}</p>

          <div className="mt-3 flex flex-wrap items-center gap-2">
            <QuestionStatusBadge status={question.status} />
            <PriorityBadge priority={question.priority} />
            <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
              {question.linkedEvidence} evidence · {question.linkedHypotheses} hypotheses
            </span>
          </div>
        </div>
      </div>
    </article>
  );
}

export function QuestionList({
  questions,
  projects,
}: {
  questions: ResearchQuestion[];
  projects: ResearchProject[];
}) {
  if (questions.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-hairline bg-background/40 p-8 text-center text-sm text-muted-foreground">
        No research questions match.
      </div>
    );
  }
  return (
    <div className="grid gap-3 lg:grid-cols-2">
      {questions.map((q) => (
        <QuestionCard
          key={q.id}
          question={q}
          projectTitle={projects.find((p) => p.id === q.projectId)?.title}
        />
      ))}
    </div>
  );
}
