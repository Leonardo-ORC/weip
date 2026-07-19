/**
 * ProviderHealthService — checks connectivity for every registered
 * scientific source provider in parallel.
 */

import { ScientificSourceRegistry } from "../registry";
import type { SourceHealthReport } from "../types";

export interface IProviderHealthService {
  checkAll(): Promise<SourceHealthReport[]>;
}

export const ProviderHealthService: IProviderHealthService = {
  async checkAll() {
    const providers = ScientificSourceRegistry.all();
    return Promise.all(providers.map((p) => p.healthCheck()));
  },
};
