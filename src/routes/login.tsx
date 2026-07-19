import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { AuthShell } from "@/components/auth/auth-shell";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/login")({
  head: () => ({ meta: [{ title: "Sign in — WEIP" }, { name: "robots", content: "noindex" }] }),
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  return (
    <AuthShell
      eyebrow="Sign in"
      title="Enter the intelligence layer."
      description="Access your workspace, cohorts and shared collections."
      footer={
        <>
          Don't have an account?{" "}
          <Link to="/register" className="font-medium text-foreground underline-offset-4 hover:underline">
            Request access
          </Link>
        </>
      }
    >
      <form
        className="space-y-5"
        onSubmit={(e) => {
          e.preventDefault();
          setLoading(true);
          setTimeout(() => navigate({ to: "/app/dashboard" }), 300);
        }}
      >
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" required placeholder="you@institution.org" autoComplete="email" />
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Password</Label>
            <Link to="/forgot-password" className="text-xs text-muted-foreground hover:text-foreground">
              Forgot?
            </Link>
          </div>
          <Input id="password" type="password" required autoComplete="current-password" />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="inline-flex w-full items-center justify-center rounded-full bg-ink px-5 py-3 text-sm font-medium text-background shadow-soft transition hover:opacity-90 disabled:opacity-60"
        >
          {loading ? "Signing in…" : "Continue"}
        </button>
        <div className="relative py-2 text-center">
          <span className="relative z-10 bg-background px-3 font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
            or
          </span>
          <span aria-hidden className="absolute inset-x-0 top-1/2 h-px bg-hairline" />
        </div>
        <button
          type="button"
          className="inline-flex w-full items-center justify-center rounded-full border border-hairline px-5 py-3 text-sm text-foreground transition hover:bg-secondary"
        >
          Continue with SSO
        </button>
      </form>
    </AuthShell>
  );
}
