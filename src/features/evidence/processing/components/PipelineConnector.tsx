import { cn } from "@/lib/utils";

export function PipelineConnector({
  className,
  dashed,
}: {
  className?: string;
  dashed?: boolean;
}) {
  return (
    <div
      aria-hidden
      className={cn(
        "relative flex h-px flex-1 items-center",
        className,
      )}
    >
      <div
        className={cn(
          "h-px w-full",
          dashed
            ? "border-t border-dashed border-hairline"
            : "bg-gradient-to-r from-hairline via-primary/40 to-hairline",
        )}
      />
      <span className="absolute right-0 top-1/2 h-1.5 w-1.5 -translate-y-1/2 rounded-full border border-hairline bg-background" />
    </div>
  );
}
