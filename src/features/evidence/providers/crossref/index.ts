import type { ProviderDefinition } from "../../types/provider";

export const crossrefProvider: ProviderDefinition = {
  id: "crossref",
  name: "Crossref",
  shortName: "Crossref",
  description:
    "The official DOI registration agency for scholarly content — canonical metadata, references and funding relationships.",
  category: "bibliographic-knowledge",
  status: "planned",
  availability: "public",
  documentation: {
    homepage: "https://www.crossref.org/",
    apiReference: "https://api.crossref.org/",
  },
  supportedContent: ["metadata", "citations"],
  refreshStrategy: "daily",
  coverage: {
    documents: "150M+ registered records",
    geography: "Global",
  },
  futureCapabilities: [
    { title: "Funder attribution", description: "Trace evidence back to funding programs and grant instruments." },
    { title: "Reference graph enrichment", description: "Densify the citation graph across otherwise-siloed corpora." },
  ],
  tags: ["DOI", "Bibliographic"],
};

export default crossrefProvider;
