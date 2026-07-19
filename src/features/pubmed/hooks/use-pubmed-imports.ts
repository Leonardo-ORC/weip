import { useMemo, useSyncExternalStore } from "react";
import { PubMedImportStore } from "../store/import-store";

export function usePubMedImports() {
  const snapshot = useSyncExternalStore(
    PubMedImportStore.subscribe,
    () => PubMedImportStore.snapshot(),
    () => PubMedImportStore.snapshot(),
  );

  const totals = useMemo(
    () => ({
      total: snapshot.length,
      last: snapshot[0]?.importedAt,
    }),
    [snapshot],
  );

  return {
    records: snapshot,
    totals,
    isImported: (id: string) => PubMedImportStore.has(id),
    remove: (id: string) => PubMedImportStore.remove(id),
    clear: () => PubMedImportStore.clear(),
  };
}
