import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export function HeroWrapper({ className, children, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("relative overflow-hidden", className)} {...props}>
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 grid-pattern fade-mask-b opacity-60"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{ background: "var(--gradient-hero)" }}
      />
      {children}
    </div>
  );
}

export function ContentWrapper({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("prose prose-neutral max-w-none", className)} {...props} />;
}
