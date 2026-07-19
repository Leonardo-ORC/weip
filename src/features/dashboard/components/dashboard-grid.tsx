import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Composition primitive for dashboard widgets. Prepares layout for future
 * customization (drag & drop, saved user layouts) by isolating widget slots.
 */
export function DashboardStack({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn("space-y-6 lg:space-y-8", className)}>{children}</div>;
}

export function DashboardRow({
  children,
  ratio = "balanced",
  className,
}: {
  children: ReactNode;
  ratio?: "balanced" | "primary" | "secondary";
  className?: string;
}) {
  const cols =
    ratio === "primary"
      ? "lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]"
      : ratio === "secondary"
        ? "lg:grid-cols-[minmax(0,1fr)_minmax(0,1.6fr)]"
        : "lg:grid-cols-2";
  return <div className={cn("grid gap-6 lg:gap-8", cols, className)}>{children}</div>;
}

export function DashboardFull({ children }: { children: ReactNode }) {
  return <div className="min-w-0">{children}</div>;
}
