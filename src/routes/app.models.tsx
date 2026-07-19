import { createFileRoute } from "@tanstack/react-router";
import { Cpu } from "lucide-react";
import { AppPagePlaceholder } from "@/components/app/app-page-placeholder";

export const Route = createFileRoute("/app/models")({
  head: () => ({ meta: [{ title: "Models — WEIP" }, { name: "robots", content: "noindex" }] }),
  component: () => (
    <AppPagePlaceholder
      eyebrow="Models"
      title="Extraction engines"
      subtitle="Model providers and prompt domains that power evidence extraction."
      breadcrumbs={[{ label: "Intelligence", to: "/app/dashboard" }, { label: "Models" }]}
      icon={Cpu}
    />
  ),
});
