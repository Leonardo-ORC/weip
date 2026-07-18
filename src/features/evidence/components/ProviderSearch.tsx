import { SearchBar } from "@/components/common/search-bar";
import { cn } from "@/lib/utils";
import {
  PROVIDER_CATEGORY_LABELS,
  PROVIDER_CATEGORY_ORDER,
  PROVIDER_STATUS_LABELS,
  PROVIDER_STATUS_ORDER,
} from "../models/provider";
import type {
  ProviderCategory,
  ProviderStatus,
} from "../types/provider";

interface Props {
  query: string;
  onQueryChange: (value: string) => void;
  selectedCategories: readonly ProviderCategory[];
  onToggleCategory: (category: ProviderCategory) => void;
  selectedStatuses: readonly ProviderStatus[];
  onToggleStatus: (status: ProviderStatus) => void;
  onReset?: () => void;
  hasActiveFilters?: boolean;
  className?: string;
}

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-full border px-3.5 py-1.5 font-mono text-[10px] uppercase tracking-[0.2em] transition-colors",
        active
          ? "border-foreground bg-foreground text-background"
          : "border-hairline text-muted-foreground hover:border-foreground/40 hover:text-foreground",
      )}
    >
      {children}
    </button>
  );
}

export function ProviderSearch({
  query,
  onQueryChange,
  selectedCategories,
  onToggleCategory,
  selectedStatuses,
  onToggleStatus,
  onReset,
  hasActiveFilters,
  className,
}: Props) {
  return (
    <div className={cn("flex flex-col gap-6", className)}>
      <SearchBar
        value={query}
        onChange={(e) => onQueryChange(e.target.value)}
        placeholder="Search providers, content types, tags…"
      />

      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
            Category
          </span>
          {hasActiveFilters && onReset ? (
            <button
              type="button"
              onClick={onReset}
              className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground transition-colors hover:text-foreground"
            >
              Reset
            </button>
          ) : null}
        </div>
        <div className="flex flex-wrap gap-2">
          {PROVIDER_CATEGORY_ORDER.map((category) => (
            <Chip
              key={category}
              active={selectedCategories.includes(category)}
              onClick={() => onToggleCategory(category)}
            >
              {PROVIDER_CATEGORY_LABELS[category]}
            </Chip>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
          Status
        </span>
        <div className="flex flex-wrap gap-2">
          {PROVIDER_STATUS_ORDER.map((status) => (
            <Chip
              key={status}
              active={selectedStatuses.includes(status)}
              onClick={() => onToggleStatus(status)}
            >
              {PROVIDER_STATUS_LABELS[status]}
            </Chip>
          ))}
        </div>
      </div>
    </div>
  );
}
