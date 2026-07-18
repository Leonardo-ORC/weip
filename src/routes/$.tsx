import { createFileRoute, Link } from "@tanstack/react-router";
import { PageLayout } from "@/components/layout/page-layout";
import { Container } from "@/components/layout/container";

export const Route = createFileRoute("/$")({
  head: () => ({
    meta: [
      { title: "Not found — WEIP" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: NotFoundPage,
});

function NotFoundPage() {
  return (
    <PageLayout>
      <section className="flex min-h-[70vh] items-center pt-32">
        <Container>
          <div className="max-w-xl">
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
              Error 404
            </p>
            <h1 className="font-display mt-4 text-6xl leading-[1.02] tracking-tight text-balance">
              This page hasn't been written yet.
            </h1>
            <p className="mt-6 text-lg text-muted-foreground">
              The URL you followed doesn't exist on WEIP. Head back to the home page and continue
              exploring.
            </p>
            <div className="mt-10">
              <Link
                to="/"
                className="inline-flex items-center justify-center gap-1.5 rounded-full bg-ink px-5 py-2.5 text-sm font-medium text-background transition hover:opacity-90"
              >
                Return home
              </Link>
            </div>
          </div>
        </Container>
      </section>
    </PageLayout>
  );
}
