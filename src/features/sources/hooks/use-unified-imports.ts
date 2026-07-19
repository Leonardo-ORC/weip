import { useMemo, useSyncExternalStore } from "react";
import { ScientificImportStore } from "../store/import-store";

export function useUnifiedImports() {
  const snapshot = useSyncExternalStore(
    ScientificImportStore.subscribe,
    () => ScientificImportStore.snapshot(),
    () => ScientificImportStore.snapshot(),
  );

  const totals = useMemo(
    () => ({
      total: snapshot.length,
      perSource: ScientificImportStore.countsBySource(),
      last: snapshot[0]?.importedAt,
    }),
    [snapshot],
  );

  return { records: snapshot, totals };
}
