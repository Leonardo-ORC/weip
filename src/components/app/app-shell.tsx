import type { ReactNode } from "react";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "./app-sidebar";
import { AppTopNav } from "./app-topnav";
import { JourneyBar, ResearchFocusOverlay } from "@/features/journey";

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <SidebarProvider defaultOpen>
      <div className="flex min-h-screen w-full bg-background text-foreground">
        <AppSidebar />
        <SidebarInset className="flex min-w-0 flex-1 flex-col bg-background">
          <AppTopNav />
          <main className="flex min-h-0 flex-1 flex-col pb-40">{children}</main>
        </SidebarInset>
      </div>
      <ResearchFocusOverlay />
      <JourneyBar />
    </SidebarProvider>
  );
}

