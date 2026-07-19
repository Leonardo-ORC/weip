import { useState } from "react";
import { ChevronRight } from "lucide-react";
import type { TaxonomyNode } from "../types";
import { cn } from "@/lib/utils";

interface HierarchyNodeProps {
  node: TaxonomyNode;
  depth?: number;
  selectedId?: string;
  onSelect?: (conceptId: string) => void;
}

export function HierarchyNode({ node, depth = 0, selectedId, onSelect }: HierarchyNodeProps) {
  const [open, setOpen] = useState(depth < 1);
  const hasChildren = node.children.length > 0;
  const isSelected = node.conceptId && node.conceptId === selectedId;

  return (
    <li>
      <div
        className={cn(
          "group flex items-center gap-1.5 rounded-md px-2 py-1.5 text-sm text-foreground/90 hover:bg-secondary/60",
          isSelected && "bg-teal/10 text-foreground",
        )}
        style={{ paddingLeft: 8 + depth * 12 }}
      >
        {hasChildren ? (
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            aria-label={open ? "Collapse" : "Expand"}
            className="grid h-4 w-4 place-items-center text-muted-foreground hover:text-foreground"
          >
            <ChevronRight className={cn("h-3 w-3 transition-transform", open && "rotate-90")} />
          </button>
        ) : (
          <span className="w-4" />
        )}
        {node.conceptId ? (
          <button
            type="button"
            onClick={() => onSelect?.(node.conceptId!)}
            className="flex-1 truncate text-left hover:text-teal"
          >
            {node.label}
          </button>
        ) : (
          <span className="flex-1 truncate font-medium">{node.label}</span>
        )}
      </div>
      {hasChildren && open ? (
        <ul className="mt-0.5">
          {node.children.map((c) => (
            <HierarchyNode
              key={c.id}
              node={c}
              depth={depth + 1}
              selectedId={selectedId}
              onSelect={onSelect}
            />
          ))}
        </ul>
      ) : null}
    </li>
  );
}

export function TaxonomyTree({
  roots,
  selectedId,
  onSelect,
}: {
  roots: TaxonomyNode[];
  selectedId?: string;
  onSelect?: (conceptId: string) => void;
}) {
  return (
    <ul className="grid gap-0.5" role="tree">
      {roots.map((r) => (
        <HierarchyNode key={r.id} node={r} selectedId={selectedId} onSelect={onSelect} />
      ))}
    </ul>
  );
}
