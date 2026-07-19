import { Link, useNavigate } from "@tanstack/react-router";
import { LogOut } from "lucide-react";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { APP_USER_MENU } from "@/constants/app-navigation";
import { useAuth } from "@/features/auth";

function initialsFrom(name: string | null | undefined, email: string | null | undefined) {
  const source = name?.trim() || email?.trim() || "";
  if (!source) return "··";
  const parts = source.split(/[\s@._-]+/).filter(Boolean);
  const first = parts[0]?.[0] ?? "";
  const second = parts[1]?.[0] ?? "";
  return (first + second).toUpperCase() || source.slice(0, 2).toUpperCase();
}

export function UserMenu() {
  const { profile, user, signOut } = useAuth();
  const navigate = useNavigate();
  const displayName = profile?.fullName || user?.email?.split("@")[0] || "Account";
  const email = profile?.email || user?.email || "";
  const initials = initialsFrom(profile?.fullName, email);

  async function handleSignOut() {
    try {
      await signOut();
      toast.success("Signed out");
      navigate({ to: "/login", replace: true });
    } catch {
      toast.error("Could not sign out");
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        aria-label="Account menu"
        className="inline-flex h-9 w-9 items-center justify-center overflow-hidden rounded-full bg-ink text-background text-xs font-medium tracking-wide shadow-soft transition hover:opacity-90"
      >
        {profile?.avatarUrl ? (
          <img src={profile.avatarUrl} alt="" className="h-full w-full object-cover" />
        ) : (
          initials
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64">
        <DropdownMenuLabel>
          <div className="flex flex-col gap-0.5">
            <span className="text-sm font-medium text-foreground">{displayName}</span>
            <span className="text-xs text-muted-foreground">{email}</span>
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
        <DropdownMenuItem onSelect={(e) => { e.preventDefault(); void handleSignOut(); }}>
          <LogOut className="mr-2 h-4 w-4" /> Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
