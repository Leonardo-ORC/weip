import { createFileRoute } from "@tanstack/react-router";
import { Settings2 } from "lucide-react";
import { AppPagePlaceholder } from "@/components/app/app-page-placeholder";

export const Route = createFileRoute("/app/settings")({
  head: () => ({ meta: [{ title: "Settings — WEIP" }, { name: "robots", content: "noindex" }] }),
  component: () => (
    <AppPagePlaceholder
      eyebrow="Settings"
      title="Workspace settings"
      subtitle="Organization, members, integrations and preferences."
      breadcrumbs={[{ label: "Workspace", to: "/app/dashboard" }, { label: "Settings" }]}
      icon={Settings2}
    />
  ),
});
