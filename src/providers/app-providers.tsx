import type { ReactNode } from "react";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "./theme-provider";
import { LoadingProvider } from "./loading-provider";
import { ErrorBoundary } from "./error-boundary";

/**
 * AppProviders — mounts all app-wide providers except QueryClientProvider,
 * which lives in __root.tsx so route loaders can access it via context.
 */
export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider defaultTheme="light">
      <LoadingProvider>
        <TooltipProvider delayDuration={200}>
          <ErrorBoundary>{children}</ErrorBoundary>
          <Toaster position="top-right" richColors closeButton />
        </TooltipProvider>
      </LoadingProvider>
    </ThemeProvider>
  );
}
