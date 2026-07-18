import { createFileRoute } from "@tanstack/react-router";
import { PageLayout } from "@/components/layout/page-layout";
import { PageHeader } from "@/components/layout/page-header";
import { Section } from "@/components/layout/section";
import { SectionHeader } from "@/components/layout/section-header";
import {
  PipelineCanvas,
  PipelineLegend,
  PipelineOverview,
  usePipelineOverview,
} from "@/features/evidence/processing";

export const Route = createFileRoute("/evidence/pipeline")({
  head: () => ({
    meta: [
      { title: "Processing Pipeline — WEIP" },
      {
        name: "description",
        content:
          "The Evidence Processing Framework — a deterministic pipeline that receives, validates, normalizes and segments scientific evidence before AI extraction.",
      },
      { property: "og:title", content: "Processing Pipeline — WEIP" },
      {
        property: "og:description",
        content:
          "How WEIP transforms raw scientific content from providers into deterministic, machine-ready evidence ahead of AI extraction.",
      },
    ],
  }),
  component: PipelinePage,
});

function PipelinePage() {
  const { stages, layers } = usePipelineOverview();

  return (
    <PageLayout
      header={
        <PageHeader
          eyebrow="Evidence Processing Framework"
          title="A deterministic substrate between raw evidence and clinical intelligence."
          description="The Processing Pipeline sits between scientific sources and AI extraction. It receives raw provider payloads, normalizes them onto a common schema, and produces deterministic units of evidence with full provenance — before a single language model is invoked."
        />
      }
    >
      <Section>
        <div className="flex flex-col gap-10">
          <SectionHeader
            eyebrow="Platform architecture"
            title="Where the pipeline lives"
            description="The processing layer is the current focus. Upstream sources are already registered; downstream extraction, evidence objects and intelligence follow in future sprints."
          />
          <PipelineOverview layers={layers} />
        </div>
      </Section>

      <Section variant="muted">
        <div className="flex flex-col gap-10">
          <SectionHeader
            eyebrow="Pipeline stages"
            title="Eight deterministic stages, one common contract"
            description="Every stage exposes the same interface — id, input, output, status, dependencies. New stages plug in without modifying the engine."
          />
          <PipelineCanvas stages={stages} />
          <PipelineLegend />
        </div>
      </Section>
    </PageLayout>
  );
}
