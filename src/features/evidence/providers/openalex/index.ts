import type { ProviderDefinition } from "../../types/provider";

export const openAlexProvider: ProviderDefinition = {
  id: "openalex",
  name: "OpenAlex",
  shortName: "OpenAlex",
  description:
    "Open catalog of scholarly works, authors, institutions, concepts and venues — a modern successor to Microsoft Academic Graph.",
  category: "bibliographic-knowledge",
  status: "planned",
  availability: "public",
  documentation: {
    homepage: "https://openalex.org/",
    apiReference: "https://docs.openalex.org/",
  },
  supportedContent: ["metadata", "citations", "abstracts"],
  refreshStrategy: "monthly",
  coverage: {
    documents: "250M+ works",
    geography: "Global",
  },
  futureCapabilities: [
    { title: "Author disambiguation", description: "Stable identity resolution across authorship and affiliation changes." },
    { title: "Concept-level trend analysis", description: "Track velocity and gaps across women's health subdomains." },
  ],
  tags: ["OurResearch", "Open"],
};

export default openAlexProvider;
