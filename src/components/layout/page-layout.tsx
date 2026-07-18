import type { ReactNode } from "react";
import { Navbar } from "./navbar";
import { Footer } from "./footer";
import { cn } from "@/lib/utils";

interface PageLayoutProps {
  children: ReactNode;
  header?: ReactNode;
  className?: string;
  hideNav?: boolean;
  hideFooter?: boolean;
}

export function PageLayout({
  children,
  header,
  className,
  hideNav,
  hideFooter,
}: PageLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      {!hideNav && <Navbar />}
      {header}
      <main className={cn("flex-1", className)}>{children}</main>
      {!hideFooter && <Footer />}
    </div>
  );
}
