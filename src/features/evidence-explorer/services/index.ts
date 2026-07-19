import { EVIDENCE_OBJECTS, SAVED_COLLECTIONS } from "../mock";
import { PubMedImportStore } from "@/features/pubmed/store/import-store";
import { ScientificImportStore } from "@/features/sources/store/import-store";
import type {
  EvidenceCollection,
  EvidenceFilters,
  EvidenceObject,
} from "../types";

function allEvidence(): EvidenceObject[] {
  return [
    ...ScientificImportStore.snapshotEvidence(),
    ...PubMedImportStore.snapshotEvidence(),
    ...EVIDENCE_OBJECTS,
  ];
}

export interface IEvidenceService {
  list(): EvidenceObject[];
  get(id: string): EvidenceObject | undefined;
  overview(): {
    total: number;
    clinicalTrials: number;
    publications: number;
    drugLabels: number;
    countries: number;
    studyTypes: number;
  };
}

export interface IEvidenceSearchService {
  search(query: string, source?: EvidenceObject[]): EvidenceObject[];
}

export interface IEvidenceFilterService {
  apply(items: EvidenceObject[], filters: EvidenceFilters): EvidenceObject[];
  facets(items: EvidenceObject[]): {
    countries: string[];
    journals: string[];
    drugs: string[];
    conditions: string[];
    yearRange: [number, number];
  };
}

export interface IEvidenceCollectionService {
  list(): EvidenceCollection[];
}

export const EvidenceService: IEvidenceService = {
  list: () => allEvidence(),
  get: (id) => allEvidence().find((e) => e.id === id),
  overview: () => {
    const items = allEvidence();
    const countries = new Set<string>();
    const studyTypes = new Set<string>();
    let trials = 0;
    let labels = 0;
    let publications = 0;
    for (const e of items) {
      e.population.countries.forEach((c) => countries.add(c));
      studyTypes.add(e.studyDesign);
      if (e.type === "clinical-trial") trials++;
      if (e.type === "drug-label") labels++;
      if (e.type !== "drug-label") publications++;
    }
    return {
      total: items.length,
      clinicalTrials: trials,
      publications,
      drugLabels: labels,
      countries: countries.size,
      studyTypes: studyTypes.size,
    };
  },
};

export const EvidenceSearchService: IEvidenceSearchService = {
  search(query, source = EVIDENCE_OBJECTS) {
    const q = query.trim().toLowerCase();
    if (!q) return source;
    return source.filter((e) => {
      const hay = [
        e.title,
        e.summary,
        e.drug ?? "",
        e.condition,
        e.hormonalContext,
        e.studyDesign,
        e.publication.journal,
        ...e.publication.authors,
        ...e.tags,
        e.population.description,
      ]
        .join(" ")
        .toLowerCase();
      return hay.includes(q);
    });
  },
};

export const EvidenceFilterService: IEvidenceFilterService = {
  apply(items, f) {
    return items.filter((e) => {
      if (f.types.length && !f.types.includes(e.type)) return false;
      if (f.designs.length && !f.designs.includes(e.studyDesign)) return false;
      if (f.hormonalContexts.length && !f.hormonalContexts.includes(e.hormonalContext)) return false;
      if (f.confidences.length && !f.confidences.includes(e.confidence)) return false;
      if (f.qualities.length && !f.qualities.includes(e.quality)) return false;
      if (f.countries.length && !e.population.countries.some((c) => f.countries.includes(c))) return false;
      if (f.journals.length && !f.journals.includes(e.publication.journal)) return false;
      if (f.drugs.length && !(e.drug && f.drugs.includes(e.drug))) return false;
      if (f.conditions.length && !f.conditions.includes(e.condition)) return false;
      if (f.years) {
        const [min, max] = f.years;
        if (e.publication.year < min || e.publication.year > max) return false;
      }
      if (f.hasAdverseEvents === true && e.adverseEvents.length === 0) return false;
      if (f.hasAdverseEvents === false && e.adverseEvents.length > 0) return false;
      return true;
    });
  },
  facets(items) {
    const countries = new Set<string>();
    const journals = new Set<string>();
    const drugs = new Set<string>();
    const conditions = new Set<string>();
    let minY = Infinity;
    let maxY = -Infinity;
    for (const e of items) {
      e.population.countries.forEach((c) => countries.add(c));
      journals.add(e.publication.journal);
      if (e.drug) drugs.add(e.drug);
      conditions.add(e.condition);
      minY = Math.min(minY, e.publication.year);
      maxY = Math.max(maxY, e.publication.year);
    }
    return {
      countries: [...countries].sort(),
      journals: [...journals].sort(),
      drugs: [...drugs].sort(),
      conditions: [...conditions].sort(),
      yearRange: [Number.isFinite(minY) ? minY : 2000, Number.isFinite(maxY) ? maxY : new Date().getFullYear()],
    };
  },
};

export const EvidenceCollectionService: IEvidenceCollectionService = {
  list: () => SAVED_COLLECTIONS,
};

export const EMPTY_FILTERS: EvidenceFilters = {
  query: "",
  types: [],
  designs: [],
  years: null,
  hormonalContexts: [],
  countries: [],
  journals: [],
  drugs: [],
  conditions: [],
  confidences: [],
  qualities: [],
  hasAdverseEvents: null,
};
