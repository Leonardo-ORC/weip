import { Info } from "lucide-react";
import type { EvidenceExtractionMetadata } from "../types";
import { PanelShell } from "./PanelShell";

export function EvidenceMetadataPanel({ metadata }: { metadata: EvidenceExtractionMetadata }) {
  return (
    <PanelShell icon={Info} title="Extraction metadata" eyebrow="Lineage">
      <dl className="grid gap-2 sm:grid-cols-2">
        <Row k="Extracted" v={new Date(metadata.extractedAt).toLocaleString()} />
        <Row k="Engine" v={`v${metadata.engineVersion}`} />
        <Row k="Strategies" v={metadata.strategies.join(", ")} />
        <Row k="AI provider" v={metadata.aiProviderId ?? "—"} />
        <Row k="Duration" v={`${metadata.durationMs}ms`} />
      </dl>
    </PanelShell>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div>
      <dt className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">{k}</dt>
      <dd className="text-xs text-foreground">{v}</dd>
    </div>
  );
}
