import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { WeipMark } from "@/components/layout/weip-mark";

interface AuthShellProps {
  eyebrow: string;
  title: string;
  description: string;
  children: ReactNode;
  footer?: ReactNode;
}

export function AuthShell({ eyebrow, title, description, children, footer }: AuthShellProps) {
  return (
    <div className="relative flex min-h-screen bg-background text-foreground">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 grid-pattern fade-mask-b opacity-40"
      />
      <div className="relative flex w-full flex-col justify-between px-6 py-8 lg:w-[46%] lg:px-16">
        <div className="flex items-center justify-between">
          <Link to="/" className="text-foreground" aria-label="Home">
            <WeipMark />
          </Link>
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground transition hover:text-foreground"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to home
          </Link>
        </div>
        <div className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center py-16">
          <div className="font-mono text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
            {eyebrow}
          </div>
          <h1 className="font-display mt-4 text-4xl leading-tight tracking-tight text-foreground">
            {title}
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{description}</p>
          <div className="mt-10">{children}</div>
          {footer ? <div className="mt-8 text-sm text-muted-foreground">{footer}</div> : null}
        </div>
        <div className="text-xs text-muted-foreground">
          © {new Date().getFullYear()} WEIP · Women's Evidence Intelligence Platform
        </div>
      </div>

      <div
        aria-hidden
        className="relative hidden overflow-hidden border-l border-hairline lg:block lg:w-[54%]"
        style={{ background: "var(--gradient-hero)" }}
      >
        <div className="absolute inset-0 grid-pattern opacity-40" />
        <div className="relative flex h-full flex-col justify-end p-16">
          <p className="font-display max-w-md text-3xl leading-tight tracking-tight text-foreground">
            The operating system for women's clinical evidence.
          </p>
          <p className="mt-4 max-w-md text-sm leading-relaxed text-muted-foreground">
            Structured, explainable, continuously-updated scientific intelligence for researchers,
            physicians and institutions.
          </p>
        </div>
      </div>
    </div>
  );
}
