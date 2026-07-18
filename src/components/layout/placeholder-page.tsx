import type { ReactNode } from "react";
import { PageLayout } from "@/components/layout/page-layout";
import { PageHeader } from "@/components/layout/page-header";
import { Container } from "@/components/layout/container";
import { ComingSoon } from "@/components/common/coming-soon";

interface PlaceholderPageProps {
  eyebrow: string;
  title: ReactNode;
  description: ReactNode;
  body: {
    title: ReactNode;
    description?: ReactNode;
    items?: { title: ReactNode; description?: ReactNode }[];
  };
}

export function PlaceholderPage({ eyebrow, title, description, body }: PlaceholderPageProps) {
  return (
    <PageLayout
      header={<PageHeader eyebrow={eyebrow} title={title} description={description} />}
    >
      <section className="py-24 lg:py-32">
        <Container>
          <ComingSoon
            title={body.title}
            description={body.description}
            items={body.items}
          />
        </Container>
      </section>
    </PageLayout>
  );
}
