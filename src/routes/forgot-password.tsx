import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { AuthShell } from "@/components/auth/auth-shell";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/features/auth";

export const Route = createFileRoute("/forgot-password")({
  head: () => ({ meta: [{ title: "Reset password — WEIP" }, { name: "robots", content: "noindex" }] }),
  component: ForgotPasswordPage,
});

function ForgotPasswordPage() {
  const { sendPasswordReset } = useAuth();
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await sendPasswordReset(email);
      setSent(true);
      toast.success("Reset link sent");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Could not send reset link";
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthShell
      eyebrow="Reset password"
      title="We'll send you a link."
      description="Enter the email tied to your workspace and we'll send a secure reset link."
      footer={
        <>
          Back to{" "}
          <Link to="/login" className="font-medium text-foreground underline-offset-4 hover:underline">
            sign in
          </Link>
        </>
      }
    >
      {sent ? (
        <div className="rounded-2xl border border-hairline bg-background/60 p-6">
          <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-muted-foreground">Check your inbox</p>
          <p className="mt-3 text-sm text-foreground">
            If that email is registered, a reset link is on its way.
          </p>
        </div>
      ) : (
        <form className="space-y-5" onSubmit={onSubmit}>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" required autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} disabled={loading} />
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
            {loading ? "Sending…" : "Send reset link"}
          </button>
        </form>
      )}
    </AuthShell>
  );
}
