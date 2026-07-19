import { createFileRoute } from "@tanstack/react-router";
import { LifeBuoy, BookOpen, MessageSquare, Shield } from "lucide-react";
import { AppPage } from "@/components/app/app-page";
import { QuickActionCard } from "@/components/app/cards";

export const Route = createFileRoute("/app/help")({
  head: () => ({ meta: [{ title: "Help — WEIP" }, { name: "robots", content: "noindex" }] }),
  component: HelpPage,
});

function HelpPage() {
  return (
    <AppPage
      eyebrow="Help"
      title="Support & documentation"
      subtitle="Guides, community and direct support channels."
      breadcrumbs={[{ label: "Workspace", to: "/app/dashboard" }, { label: "Help" }]}
    >
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <QuickActionCard icon={BookOpen} title="Documentation" description="Concepts, architecture and integration guides." to="/developers" />
        <QuickActionCard icon={MessageSquare} title="Contact team" description="Reach out about pilots, partnerships or feedback." to="/about" />
        <QuickActionCard icon={Shield} title="Security" description="Compliance posture and data handling principles." to="/about" />
        <QuickActionCard icon={LifeBuoy} title="Status" description="Live systems and infrastructure status." to="/app/dashboard" />
      </div>
    </AppPage>
  );
}
