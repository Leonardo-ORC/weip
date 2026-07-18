import { createFileRoute } from "@tanstack/react-router";
import { PlaceholderPage } from "@/components/layout/placeholder-page";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "Settings — WEIP" },
      { name: "description", content: "Account, workspace, and integration settings." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: SettingsPage,
});

function SettingsPage() {
  return (
    <PlaceholderPage
      eyebrow="Settings"
      title="Workspace configuration."
      description="Account, workspace, integrations, and preferences."
      body={{
        title: "Configuration surfaces will land here.",
        items: [
          { title: "Account", description: "Profile and credentials." },
          { title: "Workspace", description: "Team, roles, and access." },
          { title: "Integrations", description: "Data sources and API keys." },
        ],
      }}
    />
  );
}
