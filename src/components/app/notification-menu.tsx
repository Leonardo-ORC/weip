import { Bell } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useDashboardData } from "@/features/dashboard";

export function NotificationMenu() {
  const { notifications } = useDashboardData();
  const unread = notifications.filter((n) => n.unread).length;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        aria-label={`Notifications, ${unread} unread`}
        className="relative inline-flex h-9 w-9 items-center justify-center rounded-full border border-hairline text-foreground/80 transition hover:bg-secondary hover:text-foreground"
      >
        <Bell className="h-4 w-4" />
        {unread > 0 ? (
          <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-primary" />
        ) : null}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <DropdownMenuLabel className="flex items-center justify-between">
          <span>Notifications</span>
          <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
            {unread} unread
          </span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <ul className="max-h-80 overflow-auto py-1">
          {notifications.slice(0, 6).map((n) => (
            <li key={n.id} className="flex gap-3 px-2 py-2.5 hover:bg-secondary/60">
              <div
                className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${
                  n.unread ? "bg-primary" : "bg-muted-foreground/40"
                }`}
              />
              <div className="min-w-0 flex-1">
                <div className="flex items-baseline justify-between gap-2">
                  <p className="truncate text-sm font-medium text-foreground">{n.title}</p>
                  <span className="text-[11px] text-muted-foreground">{n.time}</span>
                </div>
                <p className="mt-0.5 line-clamp-2 text-xs text-muted-foreground">{n.description}</p>
              </div>
            </li>
          ))}
        </ul>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
