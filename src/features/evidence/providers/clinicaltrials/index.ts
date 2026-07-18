import type { ProviderDefinition } from "../../types/provider";

export const clinicalTrialsProvider: ProviderDefinition = {
  id: "clinicaltrials",
  name: "ClinicalTrials.gov",
  shortName: "CTG",
  description:
    "Registry and results database of publicly and privately supported clinical studies conducted around the world.",
  category: "clinical-trials",
  status: "planned",
  availability: "public",
  documentation: {
    homepage: "https://clinicaltrials.gov/",
    apiReference: "https://clinicaltrials.gov/data-api/api",
  },
  supportedContent: ["clinical-trials", "structured-outcomes", "metadata"],
  refreshStrategy: "daily",
  coverage: {
    documents: "500k+ studies",
    startYear: 2000,
    geography: "220+ countries",
  },
  futureCapabilities: [
    { title: "Protocol diffing", description: "Detect and explain amendments to enrollment, endpoints and analysis plans." },
    { title: "Population overlap detection", description: "Identify studies drawing from overlapping cohorts." },
  ],
  tags: ["NIH", "Registry"],
};

export default clinicalTrialsProvider;
