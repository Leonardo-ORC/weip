import { createFileRoute } from "@tanstack/react-router";
import { Briefcase } from "lucide-react";
import { AppPagePlaceholder } from "@/components/app/app-page-placeholder";

export const Route = createFileRoute("/app/workspace")({
  head: () => ({ meta: [{ title: "Workspace — WEIP" }, { name: "robots", content: "noindex" }] }),
  component: () => (
    <AppPagePlaceholder
      eyebrow="Workspace"
      title="Your working surfaces"
      subtitle="Notebooks, saved cohorts and shared collections."
      breadcrumbs={[{ label: "Workspace", to: "/app/dashboard" }, { label: "Overview" }]}
      icon={Briefcase}
    />
  ),
});
