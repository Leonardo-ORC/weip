import { createFileRoute } from "@tanstack/react-router";
import { Bell } from "lucide-react";
import { AppPage } from "@/components/app/app-page";
import { ActivityCard } from "@/components/app/cards";

export const Route = createFileRoute("/app/notifications")({
  head: () => ({ meta: [{ title: "Notifications — WEIP" }, { name: "robots", content: "noindex" }] }),
  component: NotificationsPage,
});

function NotificationsPage() {
  return (
    <AppPage
      eyebrow="Notifications"
      title="Activity"
      subtitle="Platform milestones and workspace events. Illustrative."
      breadcrumbs={[{ label: "Workspace", to: "/app/dashboard" }, { label: "Notifications" }]}
    >
      <div className="rounded-2xl border border-hairline bg-background/60 p-6">
        <ActivityCard
          items={[
            { title: "Extraction engine ready", description: "5 model providers registered.", time: "2m", icon: Bell, tone: "primary" },
            { title: "Pipeline framework armed", description: "8 stages available for orchestration.", time: "1h" },
            { title: "New evidence source", description: "Europe PMC added to the catalog.", time: "6h" },
            { title: "Workspace initialized", description: "Application shell provisioned.", time: "2d" },
          ]}
        />
      </div>
    </AppPage>
  );
}
