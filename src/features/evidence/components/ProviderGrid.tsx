import { cn } from "@/lib/utils";
import type { ProviderDefinition } from "../types/provider";
import { ProviderCard } from "./ProviderCard";

export function ProviderGrid({
  providers,
  className,
}: {
  providers: readonly ProviderDefinition[];
  className?: string;
}) {
  return (
    <div className={cn("grid gap-6 md:grid-cols-2 xl:grid-cols-3", className)}>
      {providers.map((provider) => (
        <ProviderCard key={provider.id} provider={provider} />
      ))}
    </div>
  );
}
