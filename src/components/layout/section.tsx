import { forwardRef, type HTMLAttributes } from "react";
import { cn } from "@/lib/utils";
import { Container } from "./container";

type Tone = "default" | "muted" | "ink" | "hero";

const tones: Record<Tone, string> = {
  default: "bg-background text-foreground",
  muted: "bg-secondary/40 text-foreground border-y border-hairline",
  ink: "bg-ink text-background",
  hero: "relative overflow-hidden",
};

interface SectionProps extends HTMLAttributes<HTMLElement> {
  tone?: Tone;
  containerSize?: "prose" | "narrow" | "default" | "wide" | "full";
  padded?: boolean;
  as?: "section" | "div" | "article" | "aside";
}

export const Section = forwardRef<HTMLElement, SectionProps>(
  (
    {
      tone = "default",
      containerSize = "default",
      padded = true,
      as: Tag = "section",
      className,
      children,
      ...props
    },
    ref,
  ) => (
    <Tag
      // @ts-expect-error — polymorphic ref
      ref={ref}
      className={cn(tones[tone], padded && "py-24 lg:py-32", className)}
      {...props}
    >
      <Container size={containerSize}>{children}</Container>
    </Tag>
  ),
);
Section.displayName = "Section";
