import type { ProviderDefinition } from "../../types/provider";

export const pubmedProvider: ProviderDefinition = {
  id: "pubmed",
  name: "PubMed",
  shortName: "PubMed",
  description:
    "The U.S. National Library of Medicine's biomedical literature index — the canonical entry point into peer-reviewed clinical research.",
  category: "scientific-literature",
  status: "planned",
  availability: "public",
  documentation: {
    homepage: "https://pubmed.ncbi.nlm.nih.gov/",
    apiReference: "https://www.ncbi.nlm.nih.gov/books/NBK25501/",
  },
  supportedContent: ["abstracts", "metadata", "citations"],
  refreshStrategy: "daily",
  coverage: {
    documents: "36M+ citations",
    startYear: 1966,
    geography: "Global",
  },
  futureCapabilities: [
    { title: "Structured extraction", description: "Populations, interventions, outcomes and effect sizes extracted from every abstract." },
    { title: "Longitudinal tracking", description: "Track how conclusions evolve across successive publications on the same intervention." },
  ],
  tags: ["NCBI", "NLM"],
};

export default pubmedProvider;
