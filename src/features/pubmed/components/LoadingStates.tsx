import { Loader2 } from "lucide-react";

export function PubMedLoadingState({ label = "Contacting PubMed…" }: { label?: string }) {
  return (
    <div className="flex items-center gap-2 rounded-xl border border-hairline bg-background/50 px-4 py-6 text-sm text-muted-foreground">
      <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
      {label}
    </div>
  );
}

export function PubMedSkeletonRow() {
  return (
    <div className="animate-pulse rounded-xl border border-hairline bg-background/40 p-4">
      <div className="h-3 w-2/3 rounded bg-muted" />
      <div className="mt-2 h-2 w-1/3 rounded bg-muted/70" />
      <div className="mt-4 h-2 w-full rounded bg-muted/60" />
      <div className="mt-1 h-2 w-5/6 rounded bg-muted/60" />
    </div>
  );
}

export function PubMedSkeletonList({ count = 4 }: { count?: number }) {
  return (
    <div className="grid gap-3">
      {Array.from({ length: count }).map((_, i) => (
        <PubMedSkeletonRow key={i} />
      ))}
    </div>
  );
}
