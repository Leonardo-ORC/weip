import { createFileRoute } from "@tanstack/react-router";
import { FlaskConical } from "lucide-react";
import { AppPagePlaceholder } from "@/components/app/app-page-placeholder";

export const Route = createFileRoute("/app/research")({
  head: () => ({ meta: [{ title: "Research — WEIP" }, { name: "robots", content: "noindex" }] }),
  component: () => (
    <AppPagePlaceholder
      eyebrow="Research"
      title="Discovery workspace"
      subtitle="Hypotheses, cohorts, and evidence-backed exploration."
      breadcrumbs={[{ label: "Intelligence", to: "/app/dashboard" }, { label: "Research" }]}
      icon={FlaskConical}
    />
  ),
});
