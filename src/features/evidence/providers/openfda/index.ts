import type { ProviderDefinition } from "../../types/provider";

export const openFdaProvider: ProviderDefinition = {
  id: "openfda",
  name: "openFDA",
  shortName: "openFDA",
  description:
    "U.S. FDA open data APIs for adverse events, product recalls, enforcement reports and regulatory submissions.",
  category: "drug-safety",
  status: "planned",
  availability: "public",
  documentation: {
    homepage: "https://open.fda.gov/",
    apiReference: "https://open.fda.gov/apis/",
  },
  supportedContent: ["adverse-events", "regulatory-documents", "metadata"],
  refreshStrategy: "weekly",
  coverage: {
    documents: "20M+ adverse event reports",
    startYear: 2004,
    geography: "United States",
  },
  futureCapabilities: [
    { title: "Signal detection", description: "Disproportionality analyses across FAERS with sex-stratified baselines." },
    { title: "Regulatory event timeline", description: "Recalls and label changes aligned with adverse event bursts." },
  ],
  tags: ["FDA", "Pharmacovigilance"],
};

export default openFdaProvider;
