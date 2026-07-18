import { Search } from "lucide-react";
import { EmptyState } from "@/components/common/empty-state";

export function ProviderEmptyState({ onReset }: { onReset?: () => void }) {
  return (
    <EmptyState
      icon={<Search className="h-5 w-5" aria-hidden />}
      title="No providers match your filters"
      description="Try broadening your query or clearing category and status filters to explore the full evidence infrastructure."
      action={
        onReset ? (
          <button
            type="button"
            onClick={onReset}
            className="inline-flex items-center rounded-full border border-hairline px-5 py-2 font-mono text-[10px] uppercase tracking-[0.22em] text-foreground transition-colors hover:border-foreground/40"
          >
            Reset filters
          </button>
        ) : null
      }
    />
  );
}
