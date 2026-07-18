/**
 * evidence — public module surface.
 *
 * The Evidence Infrastructure Layer. Exposes provider metadata, the source
 * registry and catalog UI primitives. No ingestion, extraction or
 * processing logic lives here yet.
 */

export * from "./types/provider";
export * from "./models/provider";
export * from "./registry";
export * from "./services/catalog-service";
export * from "./hooks/use-provider-catalog";

export { ProviderCard } from "./components/ProviderCard";
export { ProviderGrid } from "./components/ProviderGrid";
export { ProviderBadge } from "./components/ProviderBadge";
export { ProviderCategory } from "./components/ProviderCategory";
export { ProviderStatus } from "./components/ProviderStatus";
export { ProviderSearch } from "./components/ProviderSearch";
export { ProviderEmptyState } from "./components/ProviderEmptyState";
