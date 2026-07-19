import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState, type ReactNode } from "react";
import heroImage from "@/assets/hero-intelligence.jpg";
import architectureImage from "@/assets/architecture-vision.jpg";

export const Route = createFileRoute("/")({
  component: HomePage,
});

/* ---------------------------------------------------------------- */
/* Primitives                                                        */
/* ---------------------------------------------------------------- */

const NAV_LINKS = [
  { label: "Platform", href: "#platform" },
  { label: "Research", href: "#how" },
  { label: "Applications", href: "#modules" },
  { label: "Developers", href: "#modules" },
  { label: "About", href: "#platform" },
];

function WeipMark({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
        <circle cx="12" cy="12" r="10.5" stroke="currentColor" strokeWidth="1.2" />
        <circle cx="12" cy="12" r="5.5" stroke="currentColor" strokeWidth="1.2" />
        <circle cx="12" cy="12" r="1.4" fill="currentColor" />
        <path d="M12 1.5V22.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" opacity="0.5" />
      </svg>
      <span className="font-display text-lg tracking-tight">WEIP</span>
    </div>
  );
}

function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <div className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
      <span className="h-px w-6 bg-hairline" />
      {children}
    </div>
  );
}

function Button({
  children,
  variant = "primary",
  href = "#",
}: {
  children: ReactNode;
  variant?: "primary" | "ghost";
  href?: string;
}) {
  const base =
    "inline-flex items-center justify-center gap-1.5 rounded-full px-5 py-2.5 text-sm font-medium transition-all duration-300";
  const styles =
    variant === "primary"
      ? "bg-ink text-background hover:opacity-90 shadow-soft"
      : "text-foreground hover:bg-secondary border border-hairline";

  if (href.startsWith("/")) {
    return (
      <Link to={href as never} className={`${base} ${styles}`}>
        {children}
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden>
          <path d="M2.5 6h7M6 2.5l3.5 3.5L6 9.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </Link>
    );
  }

  return (
    <a href={href} className={`${base} ${styles}`}>
      {children}
      <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden>
        <path d="M2.5 6h7M6 2.5l3.5 3.5L6 9.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </a>
  );
}

/* ---------------------------------------------------------------- */
/* Navigation                                                        */
/* ---------------------------------------------------------------- */

function Nav() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 12);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        scrolled
          ? "border-b border-hairline bg-background/80 backdrop-blur-xl"
          : "border-b border-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-10">
        <Link to="/" className="text-foreground">
          <WeipMark />
        </Link>
        <nav className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map((l) => (
            <a
              key={l.label}
              href={l.href}
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              {l.label}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <Link
            to="/login"
            className="hidden text-sm text-muted-foreground transition-colors hover:text-foreground sm:inline"
          >
            Sign in
          </Link>
          <Button href="/register">Request early access</Button>
        </div>
      </div>
    </header>
  );
}

/* ---------------------------------------------------------------- */
/* 1. Hero — What is WEIP?                                           */
/* ---------------------------------------------------------------- */

function Hero() {
  return (
    <section className="relative overflow-hidden pt-32 pb-24 lg:pt-44 lg:pb-32">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 grid-pattern fade-mask-b opacity-60"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{ background: "var(--gradient-hero)" }}
      />
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="flex flex-col items-start gap-10 lg:flex-row lg:items-center">
          <div className="max-w-2xl flex-1">
            <div className="animate-rise">
              <Eyebrow>Women's Evidence Intelligence Platform</Eyebrow>
            </div>
            <h1 className="font-display animate-rise mt-6 text-[clamp(2.75rem,6vw,5.25rem)] leading-[0.98] tracking-tight text-balance">
              An operating system for{" "}
              <span className="italic text-royal">clinical evidence.</span>
            </h1>
            <p className="animate-rise mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground">
              WEIP is scientific infrastructure. It transforms publications, trials
              and regulatory data into <span className="text-foreground">Evidence Objects</span>,
              a living <span className="text-foreground">Knowledge Graph</span> and
              explainable <span className="text-foreground">Research Intelligence</span>.
            </p>
            <div className="animate-rise mt-10 flex flex-wrap items-center gap-3">
              <Button href="/register">Request early access</Button>
              <Button variant="ghost" href="#how">
                See how it works
              </Button>
            </div>
            <div className="mt-14 flex items-center gap-6 text-xs text-muted-foreground">
              <span className="font-mono uppercase tracking-[0.2em]">Built for</span>
              <div className="flex flex-wrap gap-x-6 gap-y-2">
                {["Researchers", "Physicians", "Universities", "Pharma", "CROs"].map(
                  (t) => (
                    <span key={t}>{t}</span>
                  ),
                )}
              </div>
            </div>
          </div>

          <div className="relative w-full flex-1">
            <div className="relative aspect-[4/5] w-full overflow-hidden rounded-3xl border border-hairline bg-ink shadow-elevated">
              <img
                src={heroImage}
                alt="Scientific knowledge graph — interconnected evidence nodes"
                width={1600}
                height={1600}
                className="h-full w-full object-cover opacity-90"
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-6">
                <div className="hairline rounded-2xl bg-background/10 p-4 backdrop-blur-md">
                  <div className="flex items-center justify-between text-[11px] font-mono uppercase tracking-[0.2em] text-background/80">
                    <span>Evidence Graph</span>
                    <span className="text-teal">live</span>
                  </div>
                  <div className="mt-3 grid grid-cols-3 gap-3 text-background">
                    {[
                      ["3", "Sources"],
                      ["17", "Node types"],
                      ["14", "Relations"],
                    ].map(([n, l]) => (
                      <div key={l}>
                        <div className="font-display text-2xl">{n}</div>
                        <div className="mt-1 text-[10px] font-mono uppercase tracking-[0.18em] text-background/60">
                          {l}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function LogoRow() {
  return (
    <section className="border-y border-hairline bg-secondary/40">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-6 px-6 py-6 lg:px-10">
        <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
          Ingesting from
        </span>
        <div className="flex flex-wrap items-center gap-x-10 gap-y-3 text-sm text-muted-foreground">
          {["PubMed", "ClinicalTrials.gov", "OpenAlex"].map((n) => (
            <span key={n} className="font-display text-lg text-foreground/70">
              {n}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------------------------------------------------------- */
/* 2. How it works — the pipeline                                    */
/* ---------------------------------------------------------------- */

function HowItWorks() {
  const steps = [
    {
      k: "01",
      t: "Scientific Sources",
      d: "Publications, clinical trials and regulatory evidence, continuously ingested.",
    },
    {
      k: "02",
      t: "Evidence Extraction",
      d: "Deterministic and AI-assisted extraction, with full provenance.",
    },
    {
      k: "03",
      t: "Evidence Objects",
      d: "Populations, interventions and outcomes as first-class structured data.",
    },
    {
      k: "04",
      t: "Knowledge Graph",
      d: "Every entity and relationship connected into a living semantic layer.",
    },
    {
      k: "05",
      t: "Research Intelligence",
      d: "Explainable insights, gaps and next actions surfaced to researchers.",
    },
  ];
  return (
    <section id="how" className="relative border-b border-hairline bg-secondary/30 py-28 lg:py-36">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="max-w-3xl">
          <Eyebrow>How it works</Eyebrow>
          <h2 className="font-display mt-6 text-4xl leading-[1.05] tracking-tight lg:text-6xl text-balance">
            A single pipeline from{" "}
            <span className="italic text-royal">source to insight.</span>
          </h2>
        </div>

        <ol className="mt-20 grid gap-4 md:grid-cols-2 lg:grid-cols-5">
          {steps.map((s, i) => (
            <li key={s.k} className="surface-card relative p-6 shadow-soft">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
                  {s.k}
                </span>
                {i < steps.length - 1 && (
                  <span className="text-muted-foreground lg:hidden">↓</span>
                )}
              </div>
              <h3 className="font-display mt-8 text-xl leading-tight tracking-tight">
                {s.t}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                {s.d}
              </p>
              {i < steps.length - 1 && (
                <div className="absolute -right-2 top-1/2 hidden h-px w-4 -translate-y-1/2 bg-hairline lg:block" />
              )}
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

/* ---------------------------------------------------------------- */
/* 3. Why WEIP — 6 capabilities                                      */
/* ---------------------------------------------------------------- */

function WhyWeip() {
  const caps = [
    { t: "Evidence Objects", d: "Every study normalized into a strongly typed, queryable schema." },
    { t: "Knowledge Graph", d: "A living semantic layer connecting concepts, entities and studies." },
    { t: "Research Intelligence", d: "Gaps, trends and opportunities detected across the evidence base." },
    { t: "Women's Health Intelligence", d: "Hormonal, reproductive and endocrine evidence as first-class citizens." },
    { t: "Explainable AI", d: "Deterministic extraction first, AI enrichment second — never opaque." },
    { t: "Scientific Provenance", d: "Every field, edge and insight traces back to its source." },
  ];
  return (
    <section id="platform" className="py-28 lg:py-36">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="max-w-3xl">
          <Eyebrow>Why WEIP</Eyebrow>
          <h2 className="font-display mt-6 text-4xl leading-[1.05] tracking-tight lg:text-6xl text-balance">
            Built for scientific rigor.
          </h2>
        </div>

        <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {caps.map((c, i) => (
            <article
              key={c.t}
              className="surface-card group relative overflow-hidden p-8 transition-all duration-500 hover:-translate-y-0.5 hover:shadow-elevated"
            >
              <div className="flex items-start justify-between">
                <div className="hairline flex h-10 w-10 items-center justify-center rounded-full">
                  <span className="font-mono text-xs text-muted-foreground">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </div>
                <div
                  aria-hidden
                  className="h-10 w-10 rounded-full opacity-20 transition-opacity group-hover:opacity-40"
                  style={{
                    background:
                      "radial-gradient(circle at 30% 30%, var(--teal), transparent 70%)",
                  }}
                />
              </div>
              <h3 className="font-display mt-10 text-2xl tracking-tight">{c.t}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{c.d}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------------------------------------------------------- */
/* 4. Architecture                                                   */
/* ---------------------------------------------------------------- */

function Architecture() {
  const layers = [
    "Scientific Sources",
    "Evidence Extraction",
    "Evidence Objects",
    "Knowledge Graph",
    "Research Intelligence",
  ];
  return (
    <section className="border-t border-hairline py-28 lg:py-36">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="grid gap-16 lg:grid-cols-12 lg:gap-20">
          <div className="lg:col-span-5">
            <Eyebrow>Architecture</Eyebrow>
            <h2 className="font-display mt-6 text-4xl leading-[1.05] tracking-tight lg:text-6xl text-balance">
              Five layers.{" "}
              <span className="italic text-royal">One substrate.</span>
            </h2>

            <ol className="mt-12 space-y-px overflow-hidden rounded-xl border border-hairline">
              {layers.map((l, i) => (
                <li
                  key={l}
                  className="flex items-center justify-between bg-background px-5 py-4 transition-colors hover:bg-secondary/40"
                >
                  <div className="flex items-center gap-4">
                    <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
                      L{i + 1}
                    </span>
                    <span className="font-display text-lg">{l}</span>
                  </div>
                  <span className="text-muted-foreground">↓</span>
                </li>
              ))}
            </ol>
          </div>

          <div className="lg:col-span-7">
            <div className="relative overflow-hidden rounded-3xl border border-hairline bg-ink shadow-elevated">
              <img
                src={architectureImage}
                alt="Layered architecture of the WEIP evidence substrate"
                width={1600}
                height={1200}
                loading="lazy"
                className="h-full w-full object-cover opacity-95"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------------------------------------------------------------- */
/* 5. Platform Modules                                               */
/* ---------------------------------------------------------------- */

function PlatformModules() {
  const modules = [
    { t: "Evidence Explorer", tag: "Workspace", d: "Faceted search across every structured Evidence Object." },
    { t: "Clinical Knowledge Workspace", tag: "Ontology", d: "Concepts, vocabularies and relationships, curated and traceable." },
    { t: "Research Intelligence", tag: "Insight", d: "Gaps, opportunities and next actions across projects and evidence." },
    { t: "Scientific Sources", tag: "Ingestion", d: "PubMed, ClinicalTrials.gov and OpenAlex through one unified interface." },
    { t: "Developer API", tag: "Platform", d: "Programmatic access to Evidence Objects and the Knowledge Graph." },
    { t: "Open Science", tag: "Public", d: "Curated evidence surfaces for the scientific commons." },
  ];
  return (
    <section
      id="modules"
      className="relative overflow-hidden bg-ink py-28 text-background lg:py-36"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-30"
        style={{
          background:
            "radial-gradient(800px 400px at 80% 10%, color-mix(in oklab, var(--teal) 40%, transparent), transparent 60%), radial-gradient(600px 500px at 10% 90%, color-mix(in oklab, var(--royal) 50%, transparent), transparent 60%)",
        }}
      />
      <div className="relative mx-auto max-w-7xl px-6 lg:px-10">
        <div className="max-w-3xl">
          <Eyebrow>
            <span className="text-background/60">Platform modules</span>
          </Eyebrow>
          <h2 className="font-display mt-6 text-4xl leading-[1.05] tracking-tight lg:text-6xl text-balance">
            What researchers work with{" "}
            <span className="italic text-teal">today.</span>
          </h2>
        </div>

        <div className="mt-16 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {modules.map((m) => (
            <article
              key={m.t}
              className="group relative rounded-2xl border border-background/10 bg-background/[0.03] p-8 transition-all duration-500 hover:border-background/20 hover:bg-background/[0.06]"
            >
              <div className="flex items-center justify-between">
                <span className="rounded-full border border-background/15 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.18em] text-background/70">
                  {m.tag}
                </span>
                <span className="text-background/40 transition-colors group-hover:text-teal">
                  →
                </span>
              </div>
              <h3 className="font-display mt-10 text-3xl tracking-tight">{m.t}</h3>
              <p className="mt-3 text-sm leading-relaxed text-background/60">{m.d}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------------------------------------------------------- */
/* Footer                                                            */
/* ---------------------------------------------------------------- */

function Footer() {
  const cols = [
    { title: "Platform", links: ["Evidence Objects", "Knowledge Graph", "Research Intelligence", "Sources"] },
    { title: "Research", links: ["Methodology", "Provenance", "Explainability", "Open Science"] },
    { title: "Developers", links: ["API", "Documentation", "Changelog", "Status"] },
    { title: "Company", links: ["About", "Careers", "Press", "Contact"] },
  ];
  return (
    <footer className="border-t border-hairline bg-background">
      <div className="mx-auto max-w-7xl px-6 py-20 lg:px-10">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <WeipMark />
            <p className="mt-6 max-w-xs text-sm leading-relaxed text-muted-foreground">
              An operating system for clinical evidence — starting with women's
              hormonal health.
            </p>
            <div className="mt-6 flex items-center gap-3">
              {["X", "Li", "Gh"].map((s) => (
                <a
                  key={s}
                  href="#"
                  className="hairline flex h-9 w-9 items-center justify-center rounded-full text-xs text-muted-foreground transition-colors hover:text-foreground"
                >
                  {s}
                </a>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-8 lg:col-span-8 lg:grid-cols-4">
            {cols.map((c) => (
              <div key={c.title}>
                <div className="font-mono text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
                  {c.title}
                </div>
                <ul className="mt-4 space-y-2.5">
                  {c.links.map((l) => (
                    <li key={l}>
                      <a
                        href="#"
                        className="text-sm text-foreground/80 transition-colors hover:text-foreground"
                      >
                        {l}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-16 flex flex-wrap items-center justify-between gap-4 border-t border-hairline pt-6 text-xs text-muted-foreground">
          <span>© 2026 WEIP. All rights reserved.</span>
          <div className="flex items-center gap-6">
            <a href="#" className="hover:text-foreground">Privacy</a>
            <a href="#" className="hover:text-foreground">Terms</a>
            <a href="#" className="hover:text-foreground">Security</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

/* ---------------------------------------------------------------- */
/* Page                                                              */
/* ---------------------------------------------------------------- */

function HomePage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Nav />
      <main>
        <Hero />
        <LogoRow />
        <HowItWorks />
        <WhyWeip />
        <Architecture />
        <PlatformModules />
      </main>
      <Footer />
    </div>
  );
}
