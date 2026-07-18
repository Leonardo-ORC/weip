import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

interface LoadingContextValue {
  isLoading: boolean;
  activeCount: number;
  start: (key?: string) => void;
  stop: (key?: string) => void;
}

const LoadingContext = createContext<LoadingContextValue | null>(null);

export function LoadingProvider({ children }: { children: ReactNode }) {
  const [keys, setKeys] = useState<Set<string>>(() => new Set());

  const start = useCallback((key = "__default") => {
    setKeys((prev) => {
      const next = new Set(prev);
      next.add(key);
      return next;
    });
  }, []);

  const stop = useCallback((key = "__default") => {
    setKeys((prev) => {
      if (!prev.has(key)) return prev;
      const next = new Set(prev);
      next.delete(key);
      return next;
    });
  }, []);

  const value = useMemo<LoadingContextValue>(
    () => ({ isLoading: keys.size > 0, activeCount: keys.size, start, stop }),
    [keys, start, stop],
  );

  return <LoadingContext.Provider value={value}>{children}</LoadingContext.Provider>;
}

export function useLoading() {
  const ctx = useContext(LoadingContext);
  if (!ctx) throw new Error("useLoading must be used within LoadingProvider");
  return ctx;
}
