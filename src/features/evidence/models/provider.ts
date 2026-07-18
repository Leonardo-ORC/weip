import type {
  ProviderCategory,
  ProviderStatus,
  SupportedContentType,
} from "../types/provider";

export const PROVIDER_CATEGORY_LABELS: Record<ProviderCategory, string> = {
  "scientific-literature": "Scientific Literature",
  "clinical-trials": "Clinical Trials",
  "drug-safety": "Drug Safety",
  "drug-labels": "Drug Labels",
  "bibliographic-knowledge": "Bibliographic Knowledge",
  "future-sources": "Future Sources",
};

export const PROVIDER_CATEGORY_DESCRIPTIONS: Record<ProviderCategory, string> = {
  "scientific-literature": "Peer-reviewed publications, abstracts and full-text corpora.",
  "clinical-trials": "Registered interventional and observational studies worldwide.",
  "drug-safety": "Post-market surveillance, adverse events and pharmacovigilance signals.",
  "drug-labels": "Structured product labeling and regulatory prescribing information.",
  "bibliographic-knowledge": "Scholarly metadata, citations and open bibliographic graphs.",
  "future-sources": "Reserved provider slots planned for upcoming integrations.",
};

export const PROVIDER_CATEGORY_ORDER: readonly ProviderCategory[] = [
  "scientific-literature",
  "clinical-trials",
  "drug-safety",
  "drug-labels",
  "bibliographic-knowledge",
  "future-sources",
];

export const PROVIDER_STATUS_LABELS: Record<ProviderStatus, string> = {
  available: "Available",
  planned: "Planned",
  experimental: "Experimental",
  deprecated: "Deprecated",
  future: "Future",
};

export const PROVIDER_STATUS_ORDER: readonly ProviderStatus[] = [
  "available",
  "experimental",
  "planned",
  "future",
  "deprecated",
];

export const SUPPORTED_CONTENT_LABELS: Record<SupportedContentType, string> = {
  abstracts: "Abstracts",
  "full-text": "Full text",
  "clinical-trials": "Clinical trials",
  "adverse-events": "Adverse events",
  "drug-labels": "Drug labels",
  citations: "Citations",
  metadata: "Metadata",
  "structured-outcomes": "Structured outcomes",
  "regulatory-documents": "Regulatory documents",
};
