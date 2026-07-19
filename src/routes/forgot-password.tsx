import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { AuthShell } from "@/components/auth/auth-shell";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/forgot-password")({
  head: () => ({ meta: [{ title: "Reset password — WEIP" }, { name: "robots", content: "noindex" }] }),
  component: ForgotPasswordPage,
});

function ForgotPasswordPage() {
  const [sent, setSent] = useState(false);
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
        <form
          className="space-y-5"
          onSubmit={(e) => {
            e.preventDefault();
            setSent(true);
          }}
        >
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" required autoComplete="email" />
          </div>
          <button
            type="submit"
            className="inline-flex w-full items-center justify-center rounded-full bg-ink px-5 py-3 text-sm font-medium text-background shadow-soft transition hover:opacity-90"
          >
            Send reset link
          </button>
        </form>
      )}
    </AuthShell>
  );
}
