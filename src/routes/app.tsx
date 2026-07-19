import { Outlet, createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/app/app-shell";
import { useProtectedRoute } from "@/features/auth";
import { Loader2 } from "lucide-react";

export const Route = createFileRoute("/app")({
  ssr: false,
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
  const { initializing, isAuthenticated } = useProtectedRoute();

  if (initializing || !isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3 text-muted-foreground">
          <Loader2 className="h-5 w-5 animate-spin" />
          <span className="font-mono text-[11px] uppercase tracking-[0.22em]">
            Restoring session
          </span>
        </div>
      </div>
    );
  }

  return (
    <AppShell>
      <Outlet />
    </AppShell>
  );
}
