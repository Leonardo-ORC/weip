import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState, type ReactNode } from "react";
import heroImage from "@/assets/hero-researcher.jpg";
import drugScoreImage from "@/assets/drug-score-dashboard.jpg";

export const Route = createFileRoute("/")({
  component: HomePage,
});

/* ---------------------------------------------------------------- */
/* Primitives                                                        */
/* ---------------------------------------------------------------- */

const NAV_LINKS = [
  { label: "Platform", href: "#approach" },
  { label: "Research", href: "#approach" },
  { label: "Applications", href: "#application" },
  { label: "Developers", href: "#approach" },
  { label: "About", href: "#mission" },
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
/* 1. Hero                                                           */
/* ---------------------------------------------------------------- */

function Hero() {
  return (
    <section className="relative overflow-hidden pt-32 pb-20 lg:pt-40 lg:pb-24">
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
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-6">
            <div className="animate-rise">
              <Eyebrow>Women's Evidence Intelligence Platform</Eyebrow>
            </div>
            <h1 className="font-display animate-rise mt-6 text-[clamp(2.5rem,5.5vw,4.75rem)] leading-[0.98] tracking-tight text-balance">
              An operating system for{" "}
              <span className="italic text-royal">clinical evidence.</span>
            </h1>
            <p className="animate-rise mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground">
              WEIP is scientific infrastructure built to transform publications,
              clinical trials and regulatory evidence into structured{" "}
              <span className="text-foreground">Evidence Objects</span>, a living{" "}
              <span className="text-foreground">Knowledge Graph</span> and
              explainable <span className="text-foreground">Research Intelligence</span>
              {" "}— beginning with women's health, where evidence gaps still
              affect millions of patients.
            </p>
            <div className="animate-rise mt-10 flex flex-wrap items-center gap-3">
              <Button href="/register">Request early access</Button>
              <Button variant="ghost" href="#approach">
                See how it works
              </Button>
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="relative aspect-[4/5] w-full overflow-hidden rounded-3xl border border-hairline bg-ink shadow-elevated">
              <img
                src={heroImage}
                alt="Biomedical researcher reviewing clinical evidence dashboards and knowledge graph"
                width={1280}
                height={1600}
                className="h-full w-full object-cover"
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/60 via-transparent to-transparent" />
            </div>
          </div>
        </div>

        {/* Problem statistics */}
        <div className="mt-20 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[
            {
              n: ">$1T",
              d: "Closing the women's health gap could generate more than US$1 trillion annually for the global economy.",
              s: "McKinsey Health Institute, 2024",
            },
            {
              n: "52%",
              d: "Since 2000, women have reported 52% more adverse drug events than men for approved medications.",
              s: "Zucker & Prendergast, Biology of Sex Differences",
            },
            {
              n: "3.5×",
              d: "Drugs withdrawn for safety were 3.5× more likely to be pulled because of risks specific to women.",
              s: "US GAO, Drug Safety Report",
            },
            {
              n: "Excluded",
              d: "Between 1977 and 1993, women of childbearing age were largely excluded from early clinical trials.",
              s: "US FDA, Historical Guidance",
            },
          ].map((c) => (
            <article key={c.n} className="surface-card p-6 shadow-soft">
              <div className="font-display text-4xl leading-none tracking-tight text-royal">
                {c.n}
              </div>
              <p className="mt-4 text-sm leading-relaxed text-foreground/80">
                {c.d}
              </p>
              <div className="mt-4 border-t border-hairline pt-3 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                {c.s}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------------------------------------------------------- */
/* Mission                                                           */
/* ---------------------------------------------------------------- */

function Mission() {
  return (
    <section id="mission" className="border-y border-hairline bg-secondary/40 py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="grid gap-10 lg:grid-cols-12 lg:items-center">
          <div className="lg:col-span-4">
            <Eyebrow>Our mission</Eyebrow>
          </div>
          <div className="lg:col-span-8">
            <p className="font-display text-3xl leading-[1.15] tracking-tight lg:text-5xl text-balance">
              Build the scientific infrastructure that ensures women are fully
              represented in clinical evidence, so medicine can work{" "}
              <span className="italic text-royal">for everyone.</span>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------------------------------------------------------------- */
/* 2. Approach — Pipeline                                            */
/* ---------------------------------------------------------------- */

function Approach() {
  const steps = [
    { k: "01", t: "Scientific Sources", d: "PubMed, ClinicalTrials.gov and OpenAlex, ingested continuously." },
    { k: "02", t: "Evidence Extraction", d: "Deterministic parsing enriched by AI, with full provenance." },
    { k: "03", t: "Evidence Objects", d: "Populations, interventions and outcomes as structured data." },
    { k: "04", t: "Knowledge Graph", d: "Every entity and relationship connected in a semantic layer." },
    { k: "05", t: "Research Intelligence", d: "Explainable insights, gaps and next actions for researchers." },
  ];
  return (
    <section id="approach" className="py-28 lg:py-36">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="max-w-3xl">
          <Eyebrow>Our approach</Eyebrow>
          <h2 className="font-display mt-6 text-4xl leading-[1.05] tracking-tight lg:text-6xl text-balance">
            Evidence infrastructure for{" "}
            <span className="italic text-royal">women in clinical trials.</span>
          </h2>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">
            A complete scientific pipeline that continuously extracts,
            structures, validates and connects evidence specific to women.
          </p>
        </div>

        <ol className="mt-20 grid gap-4 md:grid-cols-2 lg:grid-cols-5">
          {steps.map((s, i) => (
            <li key={s.k} className="surface-card relative p-6 shadow-soft">
              <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
                {s.k}
              </span>
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
/* 3. First Application — Drug Score                                 */
/* ---------------------------------------------------------------- */

function DrugScore() {
  const pillars = [
    { t: "Objective", d: "Measure women's representation across exposure, outcomes and safety." },
    { t: "Transparent", d: "Every score links directly to supporting clinical evidence." },
    { t: "Actionable", d: "Researchers, clinicians and industry can immediately identify evidence gaps." },
  ];
  return (
    <section id="application" className="border-t border-hairline bg-secondary/30 py-28 lg:py-36">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="grid gap-16 lg:grid-cols-12 lg:gap-20">
          <div className="lg:col-span-5">
            <Eyebrow>Our first application</Eyebrow>
            <h2 className="font-display mt-6 text-4xl leading-[1.05] tracking-tight lg:text-[3.25rem] text-balance">
              Drug Score:{" "}
              <span className="italic text-royal">
                how well has each drug been studied in women?
              </span>
            </h2>
            <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
              A transparent evidence score that reveals how extensively each
              medication has been evaluated in women across clinical
              development.
            </p>

            <dl className="mt-10 space-y-6">
              {pillars.map((p, i) => (
                <div key={p.t} className="flex gap-5 border-t border-hairline pt-6">
                  <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
                    0{i + 1}
                  </span>
                  <div>
                    <dt className="font-display text-xl tracking-tight">{p.t}</dt>
                    <dd className="mt-2 text-sm leading-relaxed text-muted-foreground">
                      {p.d}
                    </dd>
                  </div>
                </div>
              ))}
            </dl>
          </div>

          <div className="lg:col-span-7">
            <div className="relative overflow-hidden rounded-3xl border border-hairline bg-ink shadow-elevated">
              <img
                src={drugScoreImage}
                alt="Clinical researcher analyzing the Drug Score evidence dashboard"
                width={1600}
                height={1200}
                loading="lazy"
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------------------------------------------------------------- */
/* 4. Why this matters                                               */
/* ---------------------------------------------------------------- */

function WhyMatters() {
  const trust = [
    "Built on scientific rigor",
    "Explainable by design",
    "Full provenance",
    "Knowledge Graph powered",
    "Privacy by default",
  ];
  return (
    <section className="relative overflow-hidden bg-ink py-28 text-background lg:py-36">
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
            <span className="text-background/60">Why this matters</span>
          </Eyebrow>
          <h2 className="font-display mt-6 text-4xl leading-[1.05] tracking-tight lg:text-6xl text-balance">
            Better evidence. Better decisions.{" "}
            <span className="italic text-teal">Better outcomes.</span>
          </h2>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-background/70">
            Medicine cannot become truly personalized while half of the
            population remains underrepresented in clinical research. WEIP
            builds the infrastructure required to make women's evidence
            visible, structured, explainable and actionable.
          </p>
        </div>

        <div className="mt-16 flex flex-wrap items-center gap-x-8 gap-y-4 border-t border-background/10 pt-10">
          {trust.map((t) => (
            <div key={t} className="flex items-center gap-2 text-sm text-background/80">
              <span className="h-1.5 w-1.5 rounded-full bg-teal" />
              {t}
            </div>
          ))}
        </div>

        <div className="mt-16 flex flex-wrap items-center gap-3">
          <Button href="/register">Request early access</Button>
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
              Scientific infrastructure for clinical evidence — beginning with
              women's health.
            </p>
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
                      <a href="#" className="text-sm text-foreground/80 transition-colors hover:text-foreground">
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
/* Guided Journey (landing entry)                                    */
/* ---------------------------------------------------------------- */

function GuidedJourneyBanner() {
  const steps = [
    "Sources",
    "Extraction",
    "Evidence",
    "Graph",
    "Intelligence",
    "Drug Score",
    "Project",
  ];
  return (
    <section id="journey" className="border-y border-hairline bg-secondary/40 py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="grid gap-10 lg:grid-cols-12 lg:items-center">
          <div className="lg:col-span-5">
            <Eyebrow>Guided Research Journey</Eyebrow>
            <h2 className="font-display mt-6 text-4xl leading-[1.05] tracking-tight lg:text-5xl text-balance">
              See the platform in{" "}
              <span className="italic text-royal">five minutes.</span>
            </h2>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground">
              A curated scientific project — from imported studies to a
              calculated Drug Score — running inside the real platform, not a
              tutorial.
            </p>
            <div className="mt-8">
              <Button href="/app/journey">Start guided journey</Button>
            </div>
          </div>
          <div className="lg:col-span-7">
            <ol className="grid gap-3">
              {steps.map((s, i) => (
                <li
                  key={s}
                  className="flex items-center gap-4 rounded-2xl border border-hairline bg-background/70 px-5 py-3.5 shadow-soft"
                >
                  <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="font-display text-base text-foreground">{s}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
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
        <Mission />
        <Approach />
        <DrugScore />
        <GuidedJourneyBanner />
        <WhyMatters />
      </main>
      <Footer />
    </div>
  );
}
