/**
 * Design tokens — single source of truth for spacing, radius, motion, and
 * breakpoints referenced from TypeScript. Color tokens live in styles.css.
 */

export const spacing = {
  xs: "0.5rem",
  sm: "0.75rem",
  md: "1rem",
  lg: "1.5rem",
  xl: "2.5rem",
  "2xl": "4rem",
  "3xl": "6rem",
  section: "clamp(4rem, 8vw, 8rem)",
} as const;

export const radius = {
  sm: "0.5rem",
  md: "0.75rem",
  lg: "1rem",
  xl: "1.25rem",
  "2xl": "1.5rem",
  pill: "9999px",
} as const;

export const elevation = {
  soft: "var(--shadow-soft)",
  elevated: "var(--shadow-elevated)",
} as const;

export const motion = {
  fast: "150ms",
  base: "250ms",
  slow: "450ms",
  editorial: "700ms",
  ease: "cubic-bezier(0.22, 1, 0.36, 1)",
} as const;

export const breakpoints = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  "2xl": 1536,
} as const;

export const containerWidth = {
  prose: "42rem",
  narrow: "56rem",
  default: "80rem",
  wide: "96rem",
} as const;

export type Spacing = keyof typeof spacing;
export type Radius = keyof typeof radius;
export type ContainerWidth = keyof typeof containerWidth;
