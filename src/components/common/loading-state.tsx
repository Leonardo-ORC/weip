import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

export function LoadingState({ className, label = "Loading" }: { className?: string; label?: string }) {
  return (
    <div className={cn("space-y-4", className)} role="status" aria-live="polite" aria-busy>
      <Skeleton className="h-6 w-1/3" />
      <Skeleton className="h-4 w-2/3" />
      <Skeleton className="h-4 w-1/2" />
      <span className="sr-only">{label}</span>
    </div>
  );
}

export function CardSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn("surface-card p-8", className)}>
      <Skeleton className="h-10 w-10 rounded-full" />
      <Skeleton className="mt-10 h-6 w-1/2" />
      <Skeleton className="mt-3 h-4 w-full" />
      <Skeleton className="mt-2 h-4 w-3/4" />
    </div>
  );
}
