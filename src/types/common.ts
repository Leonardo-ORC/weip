import type { ReactNode } from "react";

export interface WithChildren {
  children: ReactNode;
}

export interface WithClassName {
  className?: string;
}

export type AsyncStatus = "idle" | "loading" | "success" | "error";

export interface PageMeta {
  title: string;
  description: string;
  eyebrow?: string;
}
