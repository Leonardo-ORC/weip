import { useQuery } from "@tanstack/react-query";
import { UnifiedHealthClient } from "../services";

export function useProviderHealth(pollMs = 60_000) {
  return useQuery({
    queryKey: ["sources", "health"],
    queryFn: () => UnifiedHealthClient.checkAll(),
    refetchInterval: pollMs,
    staleTime: pollMs / 2,
  });
}
