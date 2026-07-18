import type { ReactNode } from "react";
import { Container } from "./container";
import { Eyebrow } from "@/components/common/eyebrow";
import { cn } from "@/lib/utils";

interface PageHeaderProps {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  actions?: ReactNode;
  className?: string;
}

export function PageHeader({
  eyebrow,
  title,
  description,
  actions,
  className,
}: PageHeaderProps) {
  return (
    <header
      className={cn(
        "relative overflow-hidden border-b border-hairline pt-36 pb-16 lg:pt-44 lg:pb-24",
        className,
      )}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 grid-pattern fade-mask-b opacity-60"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{ background: "var(--gradient-hero)" }}
      />
      <Container>
        <div className="flex flex-col gap-6">
          {eyebrow ? <Eyebrow>{eyebrow}</Eyebrow> : null}
          <h1 className="font-display max-w-3xl text-[clamp(2.5rem,5vw,4.5rem)] leading-[1.02] tracking-tight text-balance">
            {title}
          </h1>
          {description ? (
            <p className="max-w-2xl text-lg leading-relaxed text-muted-foreground">
              {description}
            </p>
          ) : null}
          {actions ? <div className="flex flex-wrap items-center gap-3 pt-2">{actions}</div> : null}
        </div>
      </Container>
    </header>
  );
}
