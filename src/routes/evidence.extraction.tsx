import { createFileRoute } from "@tanstack/react-router";
import { PageLayout } from "@/components/layout/page-layout";
import { PageHeader } from "@/components/layout/page-header";
import { Section } from "@/components/layout/section";
import { SectionHeader } from "@/components/layout/section-header";
import {
  ArchitectureDiagram,
  EvidenceObjectCard,
  ExtractionFlow,
  ModelCard,
  PromptCard,
  useExtractionOverview,
} from "@/features/evidence/extraction";

export const Route = createFileRoute("/evidence/extraction")({
  head: () => ({
    meta: [
      { title: "Extraction Engine — WEIP" },
      {
        name: "description",
        content:
          "The Evidence Extraction Engine — a provider-independent architecture that turns deterministic scientific content into structured Evidence Objects.",
      },
      { property: "og:title", content: "Extraction Engine — WEIP" },
      {
        property: "og:description",
        content:
          "How WEIP turns processed scientific content into structured Evidence Objects — behind a single, provider-independent extraction contract.",
      },
    ],
  }),
  component: ExtractionPage,
});

function ExtractionPage() {
  const { layers, stages, catalog } = useExtractionOverview();

  return (
    <PageLayout
      header={
        <PageHeader
          eyebrow="Evidence Extraction Engine"
          title="Structured evidence, extracted behind a single contract."
          description="The extraction layer sits between deterministic scientific content and the Evidence Object. Models, prompts, parsers and validators are isolated plug-ins — swap any of them without touching the engine."
        />
      }
    >
      <Section>
        <div className="flex flex-col gap-10">
          <SectionHeader
            eyebrow="Extraction flow"
            title="Where extraction lives"
            description="Upstream content is already deterministic. Downstream evidence and intelligence layers ship in future sprints."
          />
          <ArchitectureDiagram layers={layers} />
        </div>
      </Section>

      <Section tone="muted">
        <div className="flex flex-col gap-10">
          <SectionHeader
            eyebrow="Engine stages"
            title="Six stages, one provider-independent contract"
            description="Every stage exposes the same interface — id, input, output, state. New stages plug in without modifying the engine."
          />
          <ExtractionFlow stages={stages} />
        </div>
      </Section>

      <Section>
        <div className="flex flex-col gap-10">
          <SectionHeader
            eyebrow="Central entity"
            title="The Evidence Object"
            description="A single, strongly typed record — the substrate of every downstream capability."
          />
          <EvidenceObjectCard />
        </div>
      </Section>

      <Section tone="muted">
        <div className="flex flex-col gap-10">
          <SectionHeader
            eyebrow="Model registry"
            title="Extraction models, treated as plug-ins"
            description="Providers are registered behind a common interface. The platform never depends on a specific SDK."
          />
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {catalog.models.map((model) => (
              <ModelCard key={model.id} model={model} />
            ))}
          </div>
        </div>
      </Section>

      <Section>
        <div className="flex flex-col gap-10">
          <SectionHeader
            eyebrow="Prompt library"
            title="Prompts, organized by scientific domain"
            description="Domain-scoped, versioned prompts. Templates land in future sprints — this catalog reserves the surface."
          />
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {catalog.domains.map((domain) => (
              <PromptCard key={domain.id} domain={domain} />
            ))}
          </div>
        </div>
      </Section>

      <Section tone="muted">
        <div className="grid gap-16 lg:grid-cols-2">
          <div className="flex flex-col gap-6">
            <SectionHeader
              eyebrow="Validators"
              title="Every candidate passes a validation contract"
              description="Schema, required fields, completeness, confidence and consistency — evaluated before an Evidence Object is emitted."
            />
            <ul className="flex flex-col gap-3">
              {catalog.validators.map((v) => (
                <li
                  key={v.id}
                  className="surface-card flex flex-col gap-1 p-5"
                >
                  <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
                    {v.kind}
                  </span>
                  <span className="font-display text-base tracking-tight">
                    {v.name}
                  </span>
                  <span className="text-xs leading-relaxed text-muted-foreground">
                    {v.description}
                  </span>
                </li>
              ))}
            </ul>
          </div>
          <div className="flex flex-col gap-6">
            <SectionHeader
              eyebrow="Parsers"
              title="Format-agnostic projection onto the schema"
              description="JSON, JSON Schema, Markdown and XML responses converge onto the same Evidence Object shape."
            />
            <ul className="flex flex-col gap-3">
              {catalog.parsers.map((p) => (
                <li
                  key={p.id}
                  className="surface-card flex flex-col gap-1 p-5"
                >
                  <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
                    {p.inputFormat}
                  </span>
                  <span className="font-display text-base tracking-tight">
                    {p.name}
                  </span>
                  <span className="text-xs leading-relaxed text-muted-foreground">
                    {p.description}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Section>
    </PageLayout>
  );
}
