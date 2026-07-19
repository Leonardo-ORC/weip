import {
  FileText,
  FolderPlus,
  HelpCircle,
  Layers,
  Lightbulb,
  Milestone,
  Plus,
} from "lucide-react";
import type { TimelineEvent, TimelineEventKind } from "../types";
import { OwnerAvatar, RelativeTime } from "./ResearchBadge";

const ICONS: Record<TimelineEventKind, React.ComponentType<{ className?: string }>> = {
  "project-created": FolderPlus,
  "evidence-added": Plus,
  "hypothesis-updated": Lightbulb,
  "collection-modified": Layers,
  "note-created": FileText,
  "question-added": HelpCircle,
  milestone: Milestone,
};

export function ResearchTimeline({ events }: { events: TimelineEvent[] }) {
  return (
    <ol className="relative space-y-4 border-l border-hairline pl-6">
      {events.map((e) => {
        const Icon = ICONS[e.kind];
        return (
          <li key={e.id} className="relative">
            <span className="absolute -left-[34px] grid h-6 w-6 place-items-center rounded-full border border-hairline bg-background text-foreground/80">
              <Icon className="h-3 w-3" />
            </span>
            <div className="rounded-xl border border-hairline bg-background/60 p-4">
              <div className="flex items-center justify-between gap-3">
                <div className="font-display text-sm tracking-tight text-foreground">{e.title}</div>
                <RelativeTime iso={e.at} />
              </div>
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{e.description}</p>
              <div className="mt-3 flex items-center gap-2">
                <OwnerAvatar initials={e.actor.initials} name={e.actor.name} />
                <span className="text-[11px] text-muted-foreground">{e.actor.name}</span>
              </div>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
