import type { LucideIcon } from "lucide-react";
import { Sparkles } from "lucide-react";
import { AppPage } from "./app-page";
import { EmptyWorkspace } from "./cards";
import type { Crumb } from "./app-breadcrumb";

interface Props {
  eyebrow?: string;
  title: string;
  subtitle: string;
  breadcrumbs?: Crumb[];
  emptyTitle?: string;
  emptyDescription?: string;
  icon?: LucideIcon;
}

export function AppPagePlaceholder({
  eyebrow,
  title,
  subtitle,
  breadcrumbs,
  emptyTitle,
  emptyDescription,
  icon = Sparkles,
}: Props) {
  return (
    <AppPage eyebrow={eyebrow} title={title} subtitle={subtitle} breadcrumbs={breadcrumbs}>
      <EmptyWorkspace
        icon={icon}
        title={emptyTitle ?? "This surface is being prepared"}
        description={
          emptyDescription ??
          "Future sprints will populate this workspace with live evidence, tooling and intelligence."
        }
      />
    </AppPage>
  );
}
