import { createFileRoute } from "@tanstack/react-router";
import { Network } from "lucide-react";
import { AppPagePlaceholder } from "@/components/app/app-page-placeholder";

export const Route = createFileRoute("/app/ontology")({
  head: () => ({ meta: [{ title: "Ontology — WEIP" }, { name: "robots", content: "noindex" }] }),
  component: () => (
    <AppPagePlaceholder
      eyebrow="Ontology"
      title="Clinical concept graph"
      subtitle="Hormones, cycles, conditions and interventions — the shared vocabulary of the platform."
      breadcrumbs={[{ label: "Intelligence", to: "/app/dashboard" }, { label: "Ontology" }]}
      icon={Network}
    />
  ),
});
