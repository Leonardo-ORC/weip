import { useEffect } from "react";
import { useNavigate, useRouterState } from "@tanstack/react-router";
import { useAuth } from "./auth-provider";

export function useProtectedRoute() {
  const { initializing, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useRouterState({ select: (s) => s.location });

  useEffect(() => {
    if (initializing) return;
    if (!isAuthenticated) {
      navigate({
        to: "/login",
        search: { redirect: location.href },
        replace: true,
      });
    }
  }, [initializing, isAuthenticated, navigate, location.href]);

  return { initializing, isAuthenticated };
}
