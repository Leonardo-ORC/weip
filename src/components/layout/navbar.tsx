import { Link, useRouterState } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { PRIMARY_NAV } from "@/constants/navigation";
import { WeipMark } from "./weip-mark";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { VisuallyHidden } from "@/components/common/visually-hidden";
import { cn } from "@/lib/utils";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 12);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-500",
        scrolled
          ? "border-b border-hairline bg-background/80 backdrop-blur-xl"
          : "border-b border-transparent",
      )}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-10">
        <Link to="/" className="text-foreground" aria-label="WEIP home">
          <WeipMark />
        </Link>

        <nav aria-label="Primary" className="hidden items-center gap-8 md:flex">
          {PRIMARY_NAV.map((l) => (
            <Link
              key={l.to}
              to={l.to as never}
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
              activeProps={{ className: "text-foreground" }}
            >
              {l.label}
            </Link>
          ))}
        </nav>


        <div className="flex items-center gap-3">
          <Link
            to="/dashboard"
            className="hidden text-sm text-muted-foreground transition-colors hover:text-foreground sm:inline"
          >
            Sign in
          </Link>
          <Link
            to="/dashboard"
            className="hidden items-center justify-center gap-1.5 rounded-full bg-ink px-5 py-2.5 text-sm font-medium text-background shadow-soft transition hover:opacity-90 md:inline-flex"
          >
            Request early access
          </Link>

          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <button
                type="button"
                aria-label="Open menu"
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-hairline text-foreground md:hidden"
              >
                {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
              </button>
            </SheetTrigger>
            <SheetContent side="right" className="w-full max-w-sm">
              <SheetTitle asChild>
                <VisuallyHidden>Navigation</VisuallyHidden>
              </SheetTitle>
              <nav aria-label="Mobile" className="mt-10 flex flex-col gap-1">
                {PRIMARY_NAV.map((l) => (
                  <Link
                    key={l.to}
                    to={l.to as never}
                    className="rounded-lg px-3 py-3 text-lg font-medium text-foreground transition-colors hover:bg-secondary"
                    activeProps={{ className: "bg-secondary" }}
                  >
                    {l.label}
                  </Link>
                ))}

                <div className="mt-6 border-t border-hairline pt-6">
                  <Link
                    to="/dashboard"
                    className="inline-flex w-full items-center justify-center rounded-full bg-ink px-5 py-3 text-sm font-medium text-background"
                  >
                    Request early access
                  </Link>
                </div>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
