import { Link } from "@tanstack/react-router";
import { WeipMark } from "@/components/layout/weip-mark";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { SearchTrigger } from "./search-dialog";
import { WorkspaceSelector } from "./workspace-selector";
import { NotificationMenu } from "./notification-menu";
import { ThemeToggle } from "./theme-toggle";
import { UserMenu } from "./user-menu";

export function AppTopNav() {
  return (
    <header className="sticky top-0 z-40 flex h-16 items-center gap-3 border-b border-hairline bg-background/85 px-4 backdrop-blur-xl lg:px-6">
      <SidebarTrigger className="text-foreground" />
      <Separator orientation="vertical" className="h-6" />
      <Link to="/app/dashboard" aria-label="WEIP workspace" className="hidden text-foreground md:block">
        <WeipMark />
      </Link>
      <div className="mx-2 hidden md:block">
        <WorkspaceSelector />
      </div>
      <div className="ml-auto flex flex-1 items-center justify-end gap-2 md:ml-6 md:justify-between">
        <SearchTrigger className="hidden md:flex" />
        <div className="flex items-center gap-1.5">
          <NotificationMenu />
          <ThemeToggle />
          <Separator orientation="vertical" className="mx-1 h-6" />
          <UserMenu />
        </div>
      </div>
    </header>
  );
}
