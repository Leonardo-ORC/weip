import type { AuthError } from "@supabase/supabase-js";

export function friendlyAuthError(error: unknown): string {
  if (!error) return "Something went wrong. Please try again.";
  const err = error as Partial<AuthError> & { message?: string; status?: number };
  const msg = (err.message ?? "").toLowerCase();

  if (msg.includes("invalid login") || msg.includes("invalid credentials")) {
    return "Invalid email or password.";
  }
  if (msg.includes("already registered") || msg.includes("user already")) {
    return "An account with this email already exists.";
  }
  if (msg.includes("password") && msg.includes("6")) {
    return "Password must be at least 6 characters.";
  }
  if (msg.includes("weak") && msg.includes("password")) {
    return "Password is too weak. Use at least 8 characters with a mix of letters and numbers.";
  }
  if (msg.includes("email") && msg.includes("confirm")) {
    return "Please confirm your email before signing in.";
  }
  if (msg.includes("network") || msg.includes("fetch")) {
    return "Network error. Check your connection and try again.";
  }
  if (msg.includes("expired") || err.status === 401) {
    return "Your session has expired. Please sign in again.";
  }
  return err.message ?? "Unexpected authentication error.";
}
