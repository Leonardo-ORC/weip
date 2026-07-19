import { createFileRoute } from "@tanstack/react-router";
import { UserRound } from "lucide-react";
import { AppPagePlaceholder } from "@/components/app/app-page-placeholder";

export const Route = createFileRoute("/app/profile")({
  head: () => ({ meta: [{ title: "Profile — WEIP" }, { name: "robots", content: "noindex" }] }),
  component: () => (
    <AppPagePlaceholder
      eyebrow="Profile"
      title="Your account"
      subtitle="Identity, credentials and public research profile."
      breadcrumbs={[{ label: "Workspace", to: "/app/dashboard" }, { label: "Profile" }]}
      icon={UserRound}
    />
  ),
});
