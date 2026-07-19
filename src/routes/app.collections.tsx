import { createFileRoute } from "@tanstack/react-router";
import { Library } from "lucide-react";
import { AppPagePlaceholder } from "@/components/app/app-page-placeholder";

export const Route = createFileRoute("/app/collections")({
  head: () => ({ meta: [{ title: "Collections — WEIP" }, { name: "robots", content: "noindex" }] }),
  component: () => (
    <AppPagePlaceholder
      eyebrow="Collections"
      title="Curated evidence"
      subtitle="Shareable sets of publications, trials and labels grouped by topic."
      breadcrumbs={[{ label: "Workspace", to: "/app/dashboard" }, { label: "Collections" }]}
      icon={Library}
    />
  ),
});
