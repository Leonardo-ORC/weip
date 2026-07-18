import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type Variant = "default" | "outline" | "accent" | "ink";

const variants: Record<Variant, string> = {
  default: "bg-secondary text-secondary-foreground",
  outline: "border border-hairline text-foreground",
  accent: "bg-accent/20 text-foreground",
  ink: "bg-ink text-background",
};

interface Props extends HTMLAttributes<HTMLSpanElement> {
  variant?: Variant;
}

export function Tag({ variant = "default", className, ...props }: Props) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.18em]",
        variants[variant],
        className,
      )}
      {...props}
    />
  );
}
