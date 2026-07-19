import { createFileRoute, Link } from "@tanstack/react-router";
import { Database } from "lucide-react";
import { AppPagePlaceholder } from "@/components/app/app-page-placeholder";

export const Route = createFileRoute("/app/evidence")({
  head: () => ({ meta: [{ title: "Evidence — WEIP" }, { name: "robots", content: "noindex" }] }),
  component: () => (
    <AppPagePlaceholder
      eyebrow="Evidence"
      title="Structured scientific evidence"
      subtitle="In-workspace evidence explorer. See the public catalog for the live source list."
      breadcrumbs={[{ label: "Intelligence", to: "/app/dashboard" }, { label: "Evidence" }]}
      icon={Database}
      emptyTitle="Evidence explorer arriving next"
      emptyDescription={"Meanwhile, browse the public scientific source catalog to see registered providers."}
    />
  ),
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const _keepImport = Link;
