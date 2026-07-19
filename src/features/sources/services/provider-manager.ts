/**
 * ProviderManager — high-level facade combining registry, factory, search,
 * fetch and health services. UI code depends on the manager, not on the
 * concrete provider implementations.
 */

import { ScientificProviderFactory } from "../factory";
import { ScientificSourceRegistry } from "../registry";
import type {
  ProviderMetadata,
  ScientificSourceProvider,
  SourceId,
} from "../types";

export interface IProviderManager {
  registry: typeof ScientificSourceRegistry;
  factory: typeof ScientificProviderFactory;
  list(): readonly ProviderMetadata[];
  get(id: SourceId): ScientificSourceProvider | undefined;
}

export const ProviderManager: IProviderManager = {
  registry: ScientificSourceRegistry,
  factory: ScientificProviderFactory,
  list() {
    return ScientificSourceRegistry.metadata();
  },
  get(id) {
    return ScientificSourceRegistry.get(id);
  },
};
