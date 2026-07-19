import type { LucideIcon } from "lucide-react";
import { Bell, FolderKanban, Library, Sparkles } from "lucide-react";

interface EmptyProps {
  icon: LucideIcon;
  title: string;
  description: string;
}

function Empty({ icon: Icon, title, description }: EmptyProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-hairline bg-background/40 px-6 py-10 text-center">
      <div className="grid h-10 w-10 place-items-center rounded-xl bg-secondary text-foreground/70">
        <Icon className="h-4 w-4" />
      </div>
      <h3 className="font-display mt-4 text-base text-foreground">{title}</h3>
      <p className="mt-1 max-w-sm text-xs leading-relaxed text-muted-foreground">{description}</p>
    </div>
  );
}

export const EmptyProjects = () => (
  <Empty icon={FolderKanban} title="No projects yet" description="Create your first research program to organize evidence and collaborators." />
);
export const EmptyCollections = () => (
  <Empty icon={Library} title="No collections yet" description="Curate scientific evidence into shareable, structured sets." />
);
export const EmptyNotifications = () => (
  <Empty icon={Bell} title="You’re all caught up" description="Notifications about the platform, your projects and research will appear here." />
);
export const EmptyActivity = () => (
  <Empty icon={Sparkles} title="No activity yet" description="Milestones and platform events will stream in as you work." />
);
