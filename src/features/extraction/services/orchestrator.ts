/**
 * Extraction Orchestrator.
 *
 * Runs deterministic extraction on every NormalizedRecord and — when
 * configured — merges results from an AI provider. Produces a fully
 * populated EvidenceExtraction bundle.
 */

import type { NormalizedRecord } from "@/features/sources";
import { BiomedicalExtractor } from "../engine/biomedical-extractor";
import { StudyExtractor } from "../engine/study-extractor";
import { WomensHealthExtractor } from "../engine/womens-health-extractor";
import { AiExtractionProviderRegistry } from "../registry/ai-provider-registry";
import type {
  AiProviderId,
  BiomedicalEntity,
  BiomedicalEntitySet,
  EvidenceExtraction,
  ExtractionMethod,
  StudyAttributes,
  WomensHealthConceptSet,
} from "../types";
import { ConfidenceService } from "./confidence-service";
import { TraceabilityService } from "./traceability-service";
import { ValidationService } from "./validation-service";

export const EXTRACTION_ENGINE_VERSION = "1.0.0";

export interface OrchestratorOptions {
  readonly aiProviderId?: AiProviderId;
  readonly now?: () => Date;
}

function mergeEntities(
  base: BiomedicalEntitySet,
  ai: BiomedicalEntitySet | undefined,
): BiomedicalEntitySet {
  if (!ai || ai.items.length === 0) return base;
  const map = new Map<string, BiomedicalEntity>();
  for (const item of base.items) map.set(`${item.kind}::${item.label}`, item);
  for (const item of ai.items) {
    const key = `${item.kind}::${item.label}`;
    const existing = map.get(key);
    if (!existing) {
      map.set(key, item);
      continue;
    }
    map.set(key, {
      ...existing,
      confidence: Math.max(existing.confidence, item.confidence),
      provenance: [...existing.provenance, ...item.provenance].slice(0, 5),
    });
  }
  const items = Array.from(map.values());
  const countsByKind = { ...base.countsByKind };
  for (const item of items) {
    countsByKind[item.kind] = items.filter((i) => i.kind === item.kind).length;
  }
  return { items, countsByKind };
}

function mergeWomens(
  base: WomensHealthConceptSet,
  ai: WomensHealthConceptSet | undefined,
): WomensHealthConceptSet {
  if (!ai || ai.matches.length === 0) return base;
  const map = new Map(base.matches.map((m) => [m.concept, m] as const));
  for (const m of ai.matches) {
    const existing = map.get(m.concept);
    if (!existing) map.set(m.concept, m);
    else
      map.set(m.concept, {
        ...existing,
        confidence: Math.max(existing.confidence, m.confidence),
        provenance: [...existing.provenance, ...m.provenance].slice(0, 5),
      });
  }
  const matches = Array.from(map.values());
  const primary = base.primary ?? ai.primary;
  return { matches, primary };
}

function mergeStudy(base: StudyAttributes, ai: Partial<StudyAttributes> | undefined): StudyAttributes {
  if (!ai) return base;
  const out = { ...base };
  (Object.keys(ai) as (keyof StudyAttributes)[]).forEach((key) => {
    const aiField = ai[key];
    if (!aiField) return;
    const baseField = base[key];
    if (baseField.method === "not-extracted") {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (out as any)[key] = aiField;
    } else if (aiField.confidence > baseField.confidence) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (out as any)[key] = { ...aiField, method: "hybrid" };
    }
  });
  return out;
}

export const ExtractionOrchestrator = {
  async extract(
    record: NormalizedRecord,
    options: OrchestratorOptions = {},
  ): Promise<EvidenceExtraction> {
    const t0 = typeof performance !== "undefined" ? performance.now() : Date.now();
    const strategies: ExtractionMethod[] = ["deterministic"];

    const deterministicEntities = BiomedicalExtractor.extract(record);
    const deterministicWomens = WomensHealthExtractor.extract(record);
    const deterministicStudy = StudyExtractor.extract(record);

    let entities = deterministicEntities;
    let womens = deterministicWomens;
    let study = deterministicStudy;
    let aiProviderId: AiProviderId | null = null;

    if (options.aiProviderId) {
      const provider = AiExtractionProviderRegistry.get(options.aiProviderId);
      if (provider) {
        aiProviderId = provider.metadata.id;
        try {
          const output = await provider.extract({
            title: record.title,
            abstract: record.abstract,
            keywords: record.keywords,
          });
          entities = mergeEntities(deterministicEntities, output.entities);
          womens = mergeWomens(deterministicWomens, output.womensHealth);
          study = mergeStudy(deterministicStudy, output.study);
          strategies.push("ai-assisted");
        } catch {
          // AI failure never breaks extraction — deterministic wins.
        }
      }
    }

    const confidence = ConfidenceService.score({
      hasBibliography: Boolean(record.title && record.authors.length > 0),
      entities,
      womensHealth: womens,
      study,
    });

    const validation = ValidationService.validate({
      record,
      entities,
      womensHealth: womens,
      study,
    });

    const traceability = TraceabilityService.fromStudy(study);

    const t1 = typeof performance !== "undefined" ? performance.now() : Date.now();
    const now = (options.now?.() ?? new Date()).toISOString();

    return {
      entities,
      womensHealth: womens,
      study,
      confidence,
      traceability,
      validation,
      metadata: {
        extractedAt: now,
        engineVersion: EXTRACTION_ENGINE_VERSION,
        strategies,
        aiProviderId,
        durationMs: Math.round(t1 - t0),
      },
    };
  },
};

export type IExtractionOrchestrator = typeof ExtractionOrchestrator;
