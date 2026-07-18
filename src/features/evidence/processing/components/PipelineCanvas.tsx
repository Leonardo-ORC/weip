import { cn } from "@/lib/utils";
import type { StageOverview } from "../services/pipeline-overview-service";
import { PipelineStageCard } from "./PipelineStageCard";
import { PipelineConnector } from "./PipelineConnector";

export function PipelineCanvas({
  stages,
  className,
}: {
  stages: readonly StageOverview[];
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col gap-10", className)}>
      {/* Desktop: horizontal scroll with connectors */}
      <div className="relative -mx-6 hidden overflow-x-auto px-6 lg:block">
        <ol className="flex min-w-max items-stretch gap-4">
          {stages.map((entry, idx) => (
            <li key={entry.stage.id} className="flex items-stretch gap-4">
              <div className="w-[280px]">
                <PipelineStageCard
                  stage={entry.stage}
                  position={entry.position}
                  total={entry.total}
                  visualState={entry.visualState}
                />
              </div>
              {idx < stages.length - 1 ? (
                <div className="flex w-10 items-center">
                  <PipelineConnector />
                </div>
              ) : null}
            </li>
          ))}
        </ol>
      </div>

      {/* Mobile / tablet: vertical stack */}
      <ol className="flex flex-col gap-4 lg:hidden">
        {stages.map((entry) => (
          <li key={entry.stage.id}>
            <PipelineStageCard
              stage={entry.stage}
              position={entry.position}
              total={entry.total}
              visualState={entry.visualState}
            />
          </li>
        ))}
      </ol>
    </div>
  );
}
