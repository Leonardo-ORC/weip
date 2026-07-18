import { forwardRef, type HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type Cols = 1 | 2 | 3 | 4 | 6 | 12;

const colsCls: Record<Cols, string> = {
  1: "grid-cols-1",
  2: "grid-cols-1 sm:grid-cols-2",
  3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
  4: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4",
  6: "grid-cols-2 md:grid-cols-3 lg:grid-cols-6",
  12: "grid-cols-12",
};

const gapCls = {
  none: "gap-0",
  sm: "gap-3",
  md: "gap-6",
  lg: "gap-8",
  xl: "gap-10",
} as const;

interface GridProps extends HTMLAttributes<HTMLDivElement> {
  cols?: Cols;
  gap?: keyof typeof gapCls;
}

export const Grid = forwardRef<HTMLDivElement, GridProps>(
  ({ cols = 3, gap = "md", className, ...props }, ref) => (
    <div ref={ref} className={cn("grid", colsCls[cols], gapCls[gap], className)} {...props} />
  ),
);
Grid.displayName = "Grid";
