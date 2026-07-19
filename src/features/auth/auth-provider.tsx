import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import type { UserProfile } from "./types";
import { friendlyAuthError } from "./errors";

interface SignUpParams {
  email: string;
  password: string;
  fullName?: string;
  organization?: string;
}

interface AuthContextValue {
  initializing: boolean;
  session: Session | null;
  user: User | null;
  profile: UserProfile | null;
  isAuthenticated: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (params: SignUpParams) => Promise<void>;
  signOut: () => Promise<void>;
  sendPasswordReset: (email: string) => Promise<void>;
  updatePassword: (password: string) => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

function mapProfileRow(row: {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  organization: string | null;
  role: string;
  created_at: string;
  updated_at: string;
}): UserProfile {
  return {
    id: row.id,
    email: row.email,
    fullName: row.full_name,
    avatarUrl: row.avatar_url,
    organization: row.organization,
    role: row.role,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

async function fetchProfile(userId: string): Promise<UserProfile | null> {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .maybeSingle();
  if (error || !data) return null;
  return mapProfileRow(data as Parameters<typeof mapProfileRow>[0]);
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [initializing, setInitializing] = useState(true);
  const currentUserId = useRef<string | null>(null);

  const loadProfile = useCallback(async (userId: string) => {
    const p = await fetchProfile(userId);
    setProfile(p);
  }, []);

  useEffect(() => {
    // Set up listener FIRST
    const { data: sub } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
      const uid = nextSession?.user.id ?? null;
      if (uid !== currentUserId.current) {
        currentUserId.current = uid;
        if (uid) {
          // Defer to avoid recursive lock inside onAuthStateChange
          setTimeout(() => {
            void loadProfile(uid);
          }, 0);
        } else {
          setProfile(null);
        }
      }
    });

    // THEN check for existing session
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      const uid = data.session?.user.id ?? null;
      currentUserId.current = uid;
      if (uid) {
        void loadProfile(uid);
      }
      setInitializing(false);
    });

    return () => {
      sub.subscription.unsubscribe();
    };
  }, [loadProfile]);

  const signIn = useCallback(async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw new Error(friendlyAuthError(error));
  }, []);

  const signUp = useCallback(async ({ email, password, fullName, organization }: SignUpParams) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/app/dashboard`,
        data: {
          full_name: fullName ?? null,
          organization: organization ?? null,
        },
      },
    });
    if (error) throw new Error(friendlyAuthError(error));
  }, []);

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
    setProfile(null);
    setSession(null);
    currentUserId.current = null;
  }, []);

  const sendPasswordReset = useCallback(async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    if (error) throw new Error(friendlyAuthError(error));
  }, []);

  const updatePassword = useCallback(async (password: string) => {
    const { error } = await supabase.auth.updateUser({ password });
    if (error) throw new Error(friendlyAuthError(error));
  }, []);

  const refreshProfile = useCallback(async () => {
    if (currentUserId.current) await loadProfile(currentUserId.current);
  }, [loadProfile]);

  const value = useMemo<AuthContextValue>(
    () => ({
      initializing,
      session,
      user: session?.user ?? null,
      profile,
      isAuthenticated: !!session,
      signIn,
      signUp,
      signOut,
      sendPasswordReset,
      updatePassword,
      refreshProfile,
    }),
    [initializing, session, profile, signIn, signUp, signOut, sendPasswordReset, updatePassword, refreshProfile],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

export function useUser() {
  return useAuth().user;
}

export function useSession() {
  return useAuth().session;
}

export function useUserProfile() {
  return useAuth().profile;
}
