import type { ProviderDefinition } from "../../types/provider";

export const pubmedCentralProvider: ProviderDefinition = {
  id: "pubmed-central",
  name: "PubMed Central",
  shortName: "PMC",
  description:
    "Free full-text archive of biomedical and life sciences journal literature at the U.S. National Institutes of Health.",
  category: "scientific-literature",
  status: "planned",
  availability: "public",
  documentation: {
    homepage: "https://www.ncbi.nlm.nih.gov/pmc/",
    apiReference: "https://www.ncbi.nlm.nih.gov/pmc/tools/developers/",
  },
  supportedContent: ["full-text", "abstracts", "metadata"],
  refreshStrategy: "daily",
  coverage: {
    documents: "9M+ full-text articles",
    startYear: 2000,
    geography: "Global",
  },
  futureCapabilities: [
    { title: "Section-aware parsing", description: "Methods, results and discussion resolved into distinct evidence units." },
    { title: "Figure and table capture", description: "Structured extraction of results tables and forest plots." },
  ],
  tags: ["NCBI", "Open Access"],
};

export default pubmedCentralProvider;
