/**
 * ScientificProviderFactory.
 *
 * Resolves a ScientificSourceProvider by id. Wraps the registry so
 * higher-level code depends on a factory contract instead of the
 * concrete registry — keeps dependency injection easy for tests.
 */

import { ScientificSourceRegistry } from "./registry";
import type { ScientificSourceProvider, SourceId } from "./types";

export interface IScientificProviderFactory {
  create(id: SourceId): ScientificSourceProvider;
  createMany(ids: readonly SourceId[]): ScientificSourceProvider[];
  available(): readonly SourceId[];
}

export const ScientificProviderFactory: IScientificProviderFactory = {
  create(id) {
    const provider = ScientificSourceRegistry.get(id);
    if (!provider) throw new Error(`Unknown scientific source provider: ${id}`);
    return provider;
  },
  createMany(ids) {
    return ids.map((id) => this.create(id));
  },
  available() {
    return ScientificSourceRegistry.ids();
  },
};
