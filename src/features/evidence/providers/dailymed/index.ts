import type { ProviderDefinition } from "../../types/provider";

export const dailyMedProvider: ProviderDefinition = {
  id: "dailymed",
  name: "DailyMed",
  shortName: "DailyMed",
  description:
    "Official provider of FDA structured product labeling (SPL) — prescribing information for medicines marketed in the United States.",
  category: "drug-labels",
  status: "planned",
  availability: "public",
  documentation: {
    homepage: "https://dailymed.nlm.nih.gov/",
    apiReference: "https://dailymed.nlm.nih.gov/dailymed/app-support-web-services.cfm",
  },
  supportedContent: ["drug-labels", "regulatory-documents", "metadata"],
  refreshStrategy: "weekly",
  coverage: {
    documents: "140k+ product labels",
    geography: "United States",
  },
  futureCapabilities: [
    { title: "Section-level diffing", description: "Track evolution of warnings, contraindications and dosage across label revisions." },
    { title: "Sex-specific labeling audit", description: "Surface labels lacking sex-stratified pharmacokinetic guidance." },
  ],
  tags: ["FDA", "SPL"],
};

export default dailyMedProvider;
