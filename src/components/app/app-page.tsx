import type { ReactNode } from "react";
import { WorkspaceHeader } from "./workspace-header";
import { ContextPanel } from "./context-panel";
import type { Crumb } from "./app-breadcrumb";
import { cn } from "@/lib/utils";

interface AppPageProps {
  eyebrow?: string;
  title: ReactNode;
  subtitle?: ReactNode;
  breadcrumbs?: Crumb[];
  primaryAction?: ReactNode;
  secondaryActions?: ReactNode;
  meta?: ReactNode;
  contextPanel?: ReactNode;
  contextPanelTitle?: string;
  className?: string;
  children: ReactNode;
}

export function AppPage({
  eyebrow,
  title,
  subtitle,
  breadcrumbs,
  primaryAction,
  secondaryActions,
  meta,
  contextPanel,
  contextPanelTitle,
  className,
  children,
}: AppPageProps) {
  return (
    <div className="flex min-h-0 flex-1">
      <div className="flex min-w-0 flex-1 flex-col">
        <WorkspaceHeader
          eyebrow={eyebrow}
          title={title}
          subtitle={subtitle}
          breadcrumbs={breadcrumbs}
          primaryAction={primaryAction}
          secondaryActions={secondaryActions}
          meta={meta}
        />
        <div className={cn("flex-1 px-6 py-8 lg:px-10 lg:py-10", className)}>{children}</div>
      </div>
      {contextPanel ? <ContextPanel title={contextPanelTitle}>{contextPanel}</ContextPanel> : null}
    </div>
  );
}
