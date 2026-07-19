import { cn } from "@/lib/utils";
import type { ExtractionStageOverview } from "../services/extraction-overview-service";
import { ExtractionStage } from "./ExtractionStage";

function Connector() {
  return (
    <div aria-hidden className="relative flex h-px flex-1 items-center">
      <div className="h-px w-full bg-gradient-to-r from-hairline via-primary/40 to-hairline" />
      <span className="absolute right-0 top-1/2 h-1.5 w-1.5 -translate-y-1/2 rounded-full border border-hairline bg-background" />
    </div>
  );
}

export function ExtractionFlow({
  stages,
  className,
}: {
  stages: readonly ExtractionStageOverview[];
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col gap-10", className)}>
      <div className="relative -mx-6 hidden overflow-x-auto px-6 lg:block">
        <ol className="flex min-w-max items-stretch gap-4">
          {stages.map((entry, idx) => (
            <li key={entry.stage.id} className="flex items-stretch gap-4">
              <div className="w-[280px]">
                <ExtractionStage
                  stage={entry.stage}
                  position={entry.position}
                  total={entry.total}
                />
              </div>
              {idx < stages.length - 1 ? (
                <div className="flex w-10 items-center">
                  <Connector />
                </div>
              ) : null}
            </li>
          ))}
        </ol>
      </div>

      <ol className="flex flex-col gap-4 lg:hidden">
        {stages.map((entry) => (
          <li key={entry.stage.id}>
            <ExtractionStage
              stage={entry.stage}
              position={entry.position}
              total={entry.total}
            />
          </li>
        ))}
      </ol>
    </div>
  );
}
