import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Eyebrow } from "@/components/common/eyebrow";

interface SectionHeaderProps {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  align?: "start" | "center";
  actions?: ReactNode;
  className?: string;
}

export function SectionHeader({
  eyebrow,
  title,
  description,
  align = "start",
  actions,
  className,
}: SectionHeaderProps) {
  const alignCls = align === "center" ? "items-center text-center" : "items-start";
  return (
    <header className={cn("flex flex-col gap-6", alignCls, className)}>
      {eyebrow ? <Eyebrow>{eyebrow}</Eyebrow> : null}
      <h2 className="font-display text-4xl leading-[1.05] tracking-tight lg:text-6xl text-balance">
        {title}
      </h2>
      {description ? (
        <p className="max-w-2xl text-lg leading-relaxed text-muted-foreground">
          {description}
        </p>
      ) : null}
      {actions ? <div className="flex flex-wrap gap-3">{actions}</div> : null}
    </header>
  );
}
