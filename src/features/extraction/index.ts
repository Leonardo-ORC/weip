/**
 * Evidence Extraction Engine — public surface.
 */

export * from "./types";
export * from "./engine/biomedical-extractor";
export * from "./engine/womens-health-extractor";
export * from "./engine/study-extractor";
export * from "./engine/text-utils";
export * from "./registry/ai-provider-registry";
export * from "./services";
export { OpenAIExtractionProvider, OPENAI_PROVIDER_METADATA } from "./providers/openai-provider";

// Auto-register built-in providers.
import { AiExtractionProviderRegistry } from "./registry/ai-provider-registry";
import { OpenAIExtractionProvider } from "./providers/openai-provider";
AiExtractionProviderRegistry.register(OpenAIExtractionProvider);

export { PanelShell } from "./components/PanelShell";
export { EvidenceConfidenceBadge } from "./components/EvidenceConfidenceBadge";
export { EvidenceExtractionStatus } from "./components/EvidenceExtractionStatus";
export { BiomedicalEntitiesPanel } from "./components/BiomedicalEntitiesPanel";
export { WomensHealthPanel } from "./components/WomensHealthPanel";
export { StudyPanel } from "./components/StudyPanel";
export { ValidationPanel } from "./components/ValidationPanel";
export { EvidenceTraceabilityPanel } from "./components/EvidenceTraceabilityPanel";
export { EvidenceMetadataPanel } from "./components/EvidenceMetadataPanel";
