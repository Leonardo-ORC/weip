import type { ReactNode } from "react";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "./theme-provider";
import { LoadingProvider } from "./loading-provider";
import { ErrorBoundary } from "./error-boundary";
import { AuthProvider } from "@/features/auth";

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider defaultTheme="light">
      <LoadingProvider>
        <TooltipProvider delayDuration={200}>
          <AuthProvider>
            <ErrorBoundary>{children}</ErrorBoundary>
          </AuthProvider>
          <Toaster position="top-right" richColors closeButton />
        </TooltipProvider>
      </LoadingProvider>
    </ThemeProvider>
  );
}
