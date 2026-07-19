import { Check, ChevronsUpDown, Building2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";

const workspaces = [
  { id: "weip", name: "WEIP Research", plan: "Enterprise" },
  { id: "endo", name: "Endocrine Lab", plan: "Team" },
  { id: "personal", name: "Personal", plan: "Free" },
];

export function WorkspaceSelector() {
  const [active, setActive] = useState(workspaces[0]);
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="inline-flex h-9 items-center gap-2 rounded-full border border-hairline bg-background/60 px-3 text-sm text-foreground transition hover:bg-secondary">
        <span className="grid h-5 w-5 place-items-center rounded-md bg-primary/10 text-primary">
          <Building2 className="h-3 w-3" />
        </span>
        <span className="max-w-[9rem] truncate">{active.name}</span>
        <ChevronsUpDown className="h-3.5 w-3.5 text-muted-foreground" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-64">
        <DropdownMenuLabel>Workspaces</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {workspaces.map((w) => (
          <DropdownMenuItem key={w.id} onClick={() => setActive(w)}>
            <div className="flex flex-1 flex-col">
              <span className="text-sm text-foreground">{w.name}</span>
              <span className="text-[11px] text-muted-foreground">{w.plan}</span>
            </div>
            {w.id === active.id ? <Check className="h-4 w-4 text-primary" /> : null}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
