import { Link } from "@tanstack/react-router";
import { LogOut } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { APP_USER_MENU } from "@/constants/app-navigation";

export function UserMenu() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        aria-label="Account menu"
        className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-ink text-background text-xs font-medium tracking-wide shadow-soft transition hover:opacity-90"
      >
        AV
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64">
        <DropdownMenuLabel>
          <div className="flex flex-col gap-0.5">
            <span className="text-sm font-medium text-foreground">Ava Vidal</span>
            <span className="text-xs text-muted-foreground">ava@weip.science</span>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {APP_USER_MENU.map((item) => (
          <DropdownMenuItem key={item.to} asChild>
            <Link to={item.to as never}>
              <item.icon className="mr-2 h-4 w-4" /> {item.label}
            </Link>
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link to="/">
            <LogOut className="mr-2 h-4 w-4" /> Sign out
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
