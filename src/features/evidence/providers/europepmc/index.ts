import type { ProviderDefinition } from "../../types/provider";

export const europePmcProvider: ProviderDefinition = {
  id: "europepmc",
  name: "Europe PMC",
  shortName: "EPMC",
  description:
    "Life sciences literature database including PubMed, preprints, patents and clinical guidelines — hosted by EMBL-EBI.",
  category: "scientific-literature",
  status: "planned",
  availability: "public",
  documentation: {
    homepage: "https://europepmc.org/",
    apiReference: "https://europepmc.org/RestfulWebService",
  },
  supportedContent: ["abstracts", "full-text", "metadata", "citations"],
  refreshStrategy: "daily",
  coverage: {
    documents: "43M+ abstracts, 9M+ full text",
    geography: "Global",
  },
  futureCapabilities: [
    { title: "Preprint integration", description: "First-class handling of bioRxiv, medRxiv and other preprint servers." },
    { title: "Annotation harvest", description: "Ingest community and machine annotations for evidence enrichment." },
  ],
  tags: ["EMBL-EBI", "Open Access"],
};

export default europePmcProvider;
