import { Bell } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const items = [
  { title: "Extraction engine ready", time: "2m", description: "5 model providers registered." },
  { title: "Pipeline framework armed", time: "1h", description: "8 stages available for orchestration." },
  { title: "New evidence source", time: "6h", description: "Europe PMC added to catalog." },
];

export function NotificationMenu() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        aria-label="Notifications"
        className="relative inline-flex h-9 w-9 items-center justify-center rounded-full border border-hairline text-foreground/80 transition hover:bg-secondary hover:text-foreground"
      >
        <Bell className="h-4 w-4" />
        <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-primary" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <DropdownMenuLabel>Notifications</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <ul className="max-h-80 overflow-auto py-1">
          {items.map((n) => (
            <li key={n.title} className="flex gap-3 px-2 py-2.5 hover:bg-secondary/60">
              <div className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-primary/70" />
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
