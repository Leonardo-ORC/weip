import type { ComponentType, ReactNode } from "react";

export function PanelShell({
  icon: Icon,
  title,
  eyebrow,
  children,
}: {
  icon: ComponentType<{ className?: string }>;
  title: string;
  eyebrow: string;
  children: ReactNode;
}) {
  return (
    <section className="rounded-xl border border-hairline bg-background/40 p-4">
      <header className="mb-3 flex items-center gap-2">
        <Icon className="h-3.5 w-3.5 text-muted-foreground" />
        <div>
          <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
            {eyebrow}
          </div>
          <div className="font-display text-sm tracking-tight">{title}</div>
        </div>
      </header>
      <div className="space-y-3">{children}</div>
    </section>
  );
}
