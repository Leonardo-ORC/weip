import type { EvidenceObject } from "../types";
import { EvidenceCard } from "./EvidenceCard";
import { EvidenceEmptyState } from "./EvidenceEmptyState";

interface Props {
  items: EvidenceObject[];
  activeId?: string;
  bookmarks: string[];
  compareIds: string[];
  onSelect: (id: string) => void;
  onBookmark: (id: string) => void;
  onCompare: (id: string) => void;
  onReset: () => void;
}

export function EvidenceGrid({
  items,
  activeId,
  bookmarks,
  compareIds,
  onSelect,
  onBookmark,
  onCompare,
  onReset,
}: Props) {
  if (items.length === 0) {
    return <EvidenceEmptyState onReset={onReset} />;
  }
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {items.map((e) => (
        <EvidenceCard
          key={e.id}
          evidence={e}
          active={e.id === activeId}
          bookmarked={bookmarks.includes(e.id)}
          comparing={compareIds.includes(e.id)}
          onSelect={onSelect}
          onBookmark={onBookmark}
          onCompare={onCompare}
        />
      ))}
    </div>
  );
}
