import {
  FileText,
  FolderPlus,
  HelpCircle,
  Layers,
  Lightbulb,
  Upload,
} from "lucide-react";
import type { QuickAction } from "../types";

export const QUICK_ACTIONS: QuickAction[] = [
  {
    id: "qa-project",
    label: "New project",
    description: "Start a new investigation",
    icon: FolderPlus,
    kind: "new-project",
  },
  {
    id: "qa-question",
    label: "New question",
    description: "Frame a scientific question",
    icon: HelpCircle,
    kind: "new-question",
  },
  {
    id: "qa-hypothesis",
    label: "New hypothesis",
    description: "Formulate a testable claim",
    icon: Lightbulb,
    kind: "new-hypothesis",
  },
  {
    id: "qa-collection",
    label: "New collection",
    description: "Group related evidence",
    icon: Layers,
    kind: "new-collection",
  },
  {
    id: "qa-note",
    label: "New note",
    description: "Capture a synthesis",
    icon: FileText,
    kind: "new-note",
  },
  {
    id: "qa-import",
    label: "Import evidence",
    description: "From the Evidence Workspace",
    icon: Upload,
    kind: "import-evidence",
  },
];

export function QuickActionPanel({
  onAction,
}: {
  onAction?: (action: QuickAction) => void;
}) {
  return (
    <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
      {QUICK_ACTIONS.map((a) => {
        const Icon = a.icon;
        return (
          <button
            key={a.id}
            type="button"
            onClick={() => onAction?.(a)}
            className="group flex items-center gap-3 rounded-2xl border border-hairline bg-background/60 p-4 text-left transition hover:border-foreground/25 hover:bg-background"
          >
            <div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-secondary text-foreground/80 transition group-hover:bg-foreground group-hover:text-background">
              <Icon className="h-4 w-4" />
            </div>
            <div className="min-w-0">
              <div className="truncate font-display text-sm tracking-tight text-foreground">
                {a.label}
              </div>
              <div className="truncate text-[11px] text-muted-foreground">{a.description}</div>
            </div>
          </button>
        );
      })}
    </div>
  );
}
