import { forwardRef, type HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

const gapCls = {
  none: "gap-0",
  xs: "gap-2",
  sm: "gap-3",
  md: "gap-4",
  lg: "gap-6",
  xl: "gap-10",
  "2xl": "gap-16",
} as const;

interface StackProps extends HTMLAttributes<HTMLDivElement> {
  direction?: "row" | "column";
  gap?: keyof typeof gapCls;
  align?: "start" | "center" | "end" | "stretch";
  justify?: "start" | "center" | "end" | "between";
  wrap?: boolean;
}

const alignCls = {
  start: "items-start",
  center: "items-center",
  end: "items-end",
  stretch: "items-stretch",
} as const;

const justifyCls = {
  start: "justify-start",
  center: "justify-center",
  end: "justify-end",
  between: "justify-between",
} as const;

export const Stack = forwardRef<HTMLDivElement, StackProps>(
  (
    { direction = "column", gap = "md", align = "stretch", justify = "start", wrap, className, ...props },
    ref,
  ) => (
    <div
      ref={ref}
      className={cn(
        "flex",
        direction === "column" ? "flex-col" : "flex-row",
        gapCls[gap],
        alignCls[align],
        justifyCls[justify],
        wrap && "flex-wrap",
        className,
      )}
      {...props}
    />
  ),
);
Stack.displayName = "Stack";
