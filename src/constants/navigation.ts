import type { FileRoutesByPath } from "@tanstack/react-router";

export type AppRoute = keyof FileRoutesByPath;

export interface NavItem {
  label: string;
  to: AppRoute;
  description?: string;
}

export const PRIMARY_NAV: NavItem[] = [
  { label: "Platform", to: "/platform", description: "Capabilities and architecture" },
  { label: "Research", to: "/research", description: "Methodology and open science" },
  { label: "Evidence", to: "/evidence", description: "The structured evidence graph" },
  { label: "Applications", to: "/applications", description: "Modules built on WEIP" },
  { label: "Developers", to: "/developers", description: "APIs and integration" },
  { label: "About", to: "/about", description: "Team and vision" },
];

export const UTILITY_NAV: NavItem[] = [
  { label: "Dashboard", to: "/dashboard" },
  { label: "Settings", to: "/settings" },
];

export const FOOTER_SECTIONS: { title: string; items: NavItem[] }[] = [
  {
    title: "Platform",
    items: [
      { label: "Overview", to: "/platform" },
      { label: "Evidence", to: "/evidence" },
      { label: "Applications", to: "/applications" },
    ],
  },
  {
    title: "Research",
    items: [
      { label: "Methodology", to: "/research" },
      { label: "About", to: "/about" },
    ],
  },
  {
    title: "Developers",
    items: [
      { label: "API", to: "/developers" },
      { label: "Dashboard", to: "/dashboard" },
      { label: "Settings", to: "/settings" },
    ],
  },
];
