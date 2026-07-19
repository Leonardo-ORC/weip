/**
 * In-memory cache with soft TTL. Prevents refetching the same PubMed
 * resources during a session. Safe to swap for a durable cache later —
 * consumers depend only on the ICacheService contract.
 */

export interface ICacheService<V> {
  get(key: string): V | undefined;
  set(key: string, value: V): void;
  has(key: string): boolean;
  delete(key: string): void;
  clear(): void;
  size(): number;
}

interface Entry<V> {
  value: V;
  expiresAt: number;
}

export function createMemoryCache<V>(ttlMs = 5 * 60_000): ICacheService<V> {
  const store = new Map<string, Entry<V>>();

  const purge = (key: string) => {
    const entry = store.get(key);
    if (!entry) return undefined;
    if (entry.expiresAt < Date.now()) {
      store.delete(key);
      return undefined;
    }
    return entry;
  };

  return {
    get(key) {
      return purge(key)?.value;
    },
    has(key) {
      return purge(key) !== undefined;
    },
    set(key, value) {
      store.set(key, { value, expiresAt: Date.now() + ttlMs });
    },
    delete(key) {
      store.delete(key);
    },
    clear() {
      store.clear();
    },
    size() {
      return store.size;
    },
  };
}
