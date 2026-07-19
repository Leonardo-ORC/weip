import { Outlet, createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/app/app-shell";

export const Route = createFileRoute("/app")({
  head: () => ({
    meta: [
      { title: "Workspace — WEIP" },
      { name: "description", content: "The authenticated WEIP workspace." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AppLayout,
});

function AppLayout() {
  return (
    <AppShell>
      <Outlet />
    </AppShell>
  );
}
