import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { AuthShell } from "@/components/auth/auth-shell";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/features/auth";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/reset-password")({
  ssr: false,
  head: () => ({ meta: [{ title: "Set new password — WEIP" }, { name: "robots", content: "noindex" }] }),
  component: ResetPasswordPage,
});

function ResetPasswordPage() {
  const navigate = useNavigate();
  const { updatePassword } = useAuth();
  const [ready, setReady] = useState(false);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Supabase recovery link sets the session automatically via URL hash.
    // We just need to wait until the client has processed it.
    const { data } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY" || event === "SIGNED_IN") {
        setReady(true);
      }
    });
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) setReady(true);
    });
    return () => data.subscription.unsubscribe();
  }, []);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }
    setLoading(true);
    try {
      await updatePassword(password);
      toast.success("Password updated");
      navigate({ to: "/app/dashboard", replace: true });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Could not update password";
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthShell
      eyebrow="New password"
      title="Set a new password."
      description="Choose a strong password for your workspace."
      footer={
        <>
          Back to{" "}
          <Link to="/login" className="font-medium text-foreground underline-offset-4 hover:underline">
            sign in
          </Link>
        </>
      }
    >
      {!ready ? (
        <div className="rounded-2xl border border-hairline bg-background/60 p-6 text-sm text-muted-foreground">
          Validating your reset link…
        </div>
      ) : (
        <form className="space-y-5" onSubmit={onSubmit}>
          <div className="space-y-2">
            <Label htmlFor="password">New password</Label>
            <Input id="password" type="password" required autoComplete="new-password" value={password} onChange={(e) => setPassword(e.target.value)} disabled={loading} minLength={8} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirm">Confirm password</Label>
            <Input id="confirm" type="password" required autoComplete="new-password" value={confirm} onChange={(e) => setConfirm(e.target.value)} disabled={loading} minLength={8} />
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
            {loading ? "Updating…" : "Update password"}
          </button>
        </form>
      )}
    </AuthShell>
  );
}
