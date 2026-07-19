import { useEffect, useState } from "react";
import { Search, ArrowRight, Command, FolderKanban, Library, Layers, Activity } from "lucide-react";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { APP_NAV_SECTIONS } from "@/constants/app-navigation";
import { useNavigate } from "@tanstack/react-router";
import { cn } from "@/lib/utils";
import { useDashboardData } from "@/features/dashboard";

const KIND_ICON = {
  project: FolderKanban,
  collection: Library,
  module: Layers,
  activity: Activity,
} as const;

export function SearchTrigger({ className }: { className?: string }) {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if ((e.key === "k" && (e.metaKey || e.ctrlKey)) || e.key === "/") {
        if ((e.target as HTMLElement)?.tagName === "INPUT") return;
        e.preventDefault();
        setOpen((o) => !o);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Search WEIP"
        className={cn(
          "group inline-flex h-9 w-full max-w-md items-center gap-3 rounded-full border border-hairline bg-background/60 px-3.5 text-sm text-muted-foreground transition hover:border-border hover:text-foreground",
          className,
        )}
      >
        <Search className="h-4 w-4 shrink-0" />
        <span className="flex-1 truncate text-left">Search evidence, projects, ontology…</span>
        <span className="hidden items-center gap-1 rounded-md border border-hairline px-1.5 py-0.5 font-mono text-[10px] sm:inline-flex">
          <Command className="h-3 w-3" /> K
        </span>
      </button>

      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Search across evidence, ontology, projects…" />
        <CommandList>
          <CommandEmpty>No results. Try a different query.</CommandEmpty>
          {APP_NAV_SECTIONS.map((section) => (
            <CommandGroup key={section.title} heading={section.title}>
              {section.items.map((item) => (
                <CommandItem
                  key={item.to}
                  value={`${item.label} ${item.description ?? ""}`}
                  onSelect={() => {
                    setOpen(false);
                    navigate({ to: item.to as never });
                  }}
                >
                  <item.icon className="mr-2 h-4 w-4" />
                  <span>{item.label}</span>
                  <span className="ml-auto text-xs text-muted-foreground">{item.description}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          ))}
          <CommandSeparator />
          <CommandGroup heading="Quick actions">
            <CommandItem onSelect={() => setOpen(false)}>
              <ArrowRight className="mr-2 h-4 w-4" /> Request early access
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
}
