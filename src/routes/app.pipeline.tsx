import { createFileRoute } from "@tanstack/react-router";
import { Workflow } from "lucide-react";
import { AppPagePlaceholder } from "@/components/app/app-page-placeholder";

export const Route = createFileRoute("/app/pipeline")({
  head: () => ({ meta: [{ title: "Pipeline — WEIP" }, { name: "robots", content: "noindex" }] }),
  component: () => (
    <AppPagePlaceholder
      eyebrow="Pipeline"
      title="Processing pipeline"
      subtitle="Ingestion, validation, normalization, enrichment and storage stages."
      breadcrumbs={[{ label: "Intelligence", to: "/app/dashboard" }, { label: "Pipeline" }]}
      icon={Workflow}
    />
  ),
});
