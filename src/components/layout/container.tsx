import { forwardRef, type HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type Size = "prose" | "narrow" | "default" | "wide" | "full";

const sizes: Record<Size, string> = {
  prose: "max-w-2xl",
  narrow: "max-w-4xl",
  default: "max-w-7xl",
  wide: "max-w-[96rem]",
  full: "max-w-none",
};

interface ContainerProps extends HTMLAttributes<HTMLDivElement> {
  size?: Size;
}

export const Container = forwardRef<HTMLDivElement, ContainerProps>(
  ({ size = "default", className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("mx-auto w-full px-6 lg:px-10", sizes[size], className)}
      {...props}
    />
  ),
);
Container.displayName = "Container";
