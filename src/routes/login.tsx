import { createFileRoute, Link, useNavigate, useSearch } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { AuthShell } from "@/components/auth/auth-shell";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/features/auth";

const search = z.object({ redirect: z.string().optional() });

export const Route = createFileRoute("/login")({
  validateSearch: search,
  head: () => ({ meta: [{ title: "Sign in — WEIP" }, { name: "robots", content: "noindex" }] }),
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const { redirect } = useSearch({ from: "/login" });
  const { signIn, isAuthenticated, initializing } = useAuth();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!initializing && isAuthenticated) {
      navigate({ to: redirect ?? "/app/dashboard", replace: true });
    }
  }, [initializing, isAuthenticated, navigate, redirect]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await signIn(email, password);
      toast.success("Welcome back");
      navigate({ to: redirect ?? "/app/dashboard", replace: true });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Sign in failed";
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }

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
      <form className="space-y-5" onSubmit={onSubmit}>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            required
            placeholder="you@institution.org"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
          />
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Password</Label>
            <Link to="/forgot-password" className="text-xs text-muted-foreground hover:text-foreground">
              Forgot?
            </Link>
          </div>
          <Input
            id="password"
            type="password"
            required
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
          />
        </div>
        {error ? (
          <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-xs text-destructive">
            {error}
          </div>
        ) : null}
        <button
          type="submit"
          disabled={loading}
          className="inline-flex w-full items-center justify-center rounded-full bg-ink px-5 py-3 text-sm font-medium text-background shadow-soft transition hover:opacity-90 disabled:opacity-60"
        >
          {loading ? "Signing in…" : "Continue"}
        </button>
      </form>
    </AuthShell>
  );
}
