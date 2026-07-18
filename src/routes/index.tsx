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
  { label: "Research", href: "#research" },
  { label: "Applications", href: "#applications" },
  { label: "Developers", href: "#developers" },
  { label: "About", href: "#about" },
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
          <a
            href="#early-access"
            className="hidden text-sm text-muted-foreground transition-colors hover:text-foreground sm:inline"
          >
            Sign in
          </a>
          <Button href="#early-access">Request early access</Button>
        </div>
      </div>
    </header>
  );
}

/* ---------------------------------------------------------------- */
/* Sections                                                          */
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
              The intelligence layer for{" "}
              <span className="italic text-royal">women's clinical evidence.</span>
            </h1>
            <p className="animate-rise mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground">
              WEIP transforms fragmented scientific publications, clinical trials
              and regulatory evidence into structured, explainable intelligence —
              starting with women's hormonal health.
            </p>
            <div className="animate-rise mt-10 flex flex-wrap items-center gap-3">
              <Button href="#early-access">Request early access</Button>
              <Button variant="ghost" href="#vision">
                Read the vision
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
                alt="Abstract visualization of connected scientific evidence"
                width={1600}
                height={1200}
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
                      ["12.4M", "Publications"],
                      ["48K", "Trials"],
                      ["190+", "Endpoints"],
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
          In dialogue with
        </span>
        <div className="flex flex-wrap items-center gap-x-10 gap-y-3 text-sm text-muted-foreground">
          {[
            "Academic Medical Centers",
            "Regulatory Bodies",
            "Clinical Research Orgs",
            "Innovation Programs",
          ].map((n) => (
            <span key={n} className="font-display text-lg text-foreground/70">
              {n}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

function Problem() {
  const items = [
    {
      k: "01",
      metric: "> 12M",
      title: "Publications",
      body: "Scientific evidence on women's health is scattered across decades of siloed publications.",
    },
    {
      k: "02",
      metric: "70%",
      title: "Underrepresented",
      body: "Women remain underrepresented in clinical trials — evidence gaps compound over time.",
    },
    {
      k: "03",
      metric: "0.2%",
      title: "Structured",
      body: "A vanishingly small fraction of trial and regulatory data is machine-readable today.",
    },
    {
      k: "04",
      metric: "months",
      title: "To synthesize",
      body: "Researchers spend months manually reconciling endpoints, cohorts and outcomes.",
    },
  ];
  return (
    <section className="py-28 lg:py-36">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <Eyebrow>The problem</Eyebrow>
            <h2 className="font-display mt-6 text-4xl leading-[1.05] tracking-tight lg:text-6xl text-balance">
              Scientific evidence is <em className="not-italic text-muted-foreground">fragmented</em>,
              opaque and slow.
            </h2>
          </div>
          <div className="lg:col-span-7">
            <p className="max-w-xl text-lg leading-relaxed text-muted-foreground">
              Women's health suffers most. The evidence exists — but it lives in
              PDFs, registries, and disconnected databases. It is not queryable.
              It is not comparable. It is not intelligence.
            </p>
          </div>
        </div>

        <div className="mt-16 grid gap-px overflow-hidden rounded-2xl border border-hairline bg-hairline sm:grid-cols-2 lg:grid-cols-4">
          {items.map((it) => (
            <div
              key={it.k}
              className="group relative bg-background p-8 transition-colors hover:bg-secondary/40"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
                  {it.k}
                </span>
                <span className="text-teal opacity-0 transition-opacity group-hover:opacity-100">
                  ↗
                </span>
              </div>
              <div className="font-display mt-10 text-5xl tracking-tight">{it.metric}</div>
              <div className="mt-2 text-sm font-medium">{it.title}</div>
              <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{it.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Vision() {
  const steps = [
    {
      k: "I.",
      t: "Scientific Publications",
      d: "Peer-reviewed literature, preprints, and registries continuously ingested.",
    },
    {
      k: "II.",
      t: "Evidence Processing",
      d: "Endpoints, cohorts, outcomes and populations extracted into structured objects.",
    },
    {
      k: "III.",
      t: "Evidence Intelligence",
      d: "A living knowledge graph — explainable, connected, versioned.",
    },
    {
      k: "IV.",
      t: "Research Insights",
      d: "Answers, hypotheses and identified research gaps for scientists and clinicians.",
    },
  ];
  return (
    <section id="vision" className="relative border-y border-hairline bg-secondary/30 py-28 lg:py-36">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="max-w-3xl">
          <Eyebrow>Our vision</Eyebrow>
          <h2 className="font-display mt-6 text-4xl leading-[1.05] tracking-tight lg:text-6xl text-balance">
            An operating system for{" "}
            <span className="italic text-royal">clinical evidence.</span>
          </h2>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">
            WEIP is a scientific infrastructure that turns unstructured evidence
            into structured, explainable intelligence — beginning with women's
            hormonal health, extending across all of medicine.
          </p>
        </div>

        <ol className="mt-20 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {steps.map((s, i) => (
            <li key={s.k} className="surface-card relative p-8 shadow-soft">
              <div className="flex items-center justify-between">
                <span className="font-display text-royal text-xl">{s.k}</span>
                <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                  Step {i + 1}
                </span>
              </div>
              <h3 className="font-display mt-8 text-2xl leading-tight tracking-tight">
                {s.t}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{s.d}</p>
              {i < steps.length - 1 && (
                <div className="absolute -right-3 top-1/2 hidden h-px w-6 -translate-y-1/2 bg-hairline lg:block" />
              )}
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

function Platform() {
  const caps = [
    { t: "Evidence Intelligence", d: "Structured, queryable, versioned scientific evidence." },
    { t: "Clinical Knowledge", d: "Cohorts, endpoints and outcomes as first-class objects." },
    { t: "Women's Health Focus", d: "Hormonal, reproductive and endocrine evidence, unified." },
    { t: "Research Opportunities", d: "Automatically identified gaps, contradictions and frontiers." },
    { t: "Explainable AI", d: "Every insight traces back to its source and reasoning path." },
    { t: "Evidence Quality", d: "Provenance, methodology and strength assessed transparently." },
  ];
  return (
    <section id="platform" className="py-28 lg:py-36">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
          <div className="max-w-2xl">
            <Eyebrow>Platform</Eyebrow>
            <h2 className="font-display mt-6 text-4xl leading-[1.05] tracking-tight lg:text-6xl text-balance">
              Capabilities designed for scientific rigor.
            </h2>
          </div>
          <p className="max-w-sm text-sm text-muted-foreground">
            Every layer is built to be inspectable, reproducible, and worthy of
            citation.
          </p>
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

function FuturePlatform() {
  const modules = [
    { t: "Drug Intelligence", tag: "Pharma", d: "Compound-level evidence graph across trials and outcomes." },
    { t: "Disease Intelligence", tag: "Clinical", d: "Longitudinal disease models grounded in evidence." },
    { t: "Hormone Intelligence", tag: "Women's Health", d: "The first WEIP module — endocrine evidence, unified." },
    { t: "Evidence Explorer", tag: "Research", d: "A queryable interface over the entire evidence graph." },
    { t: "Research Copilot", tag: "Workflow", d: "An expert companion for scientific reasoning." },
    { t: "Developer API", tag: "Platform", d: "Programmatic access to structured evidence objects." },
    { t: "Open Science", tag: "Public", d: "Curated evidence surfaces for the scientific commons." },
  ];
  return (
    <section
      id="applications"
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
            <span className="text-background/60">Future platform</span>
          </Eyebrow>
          <h2 className="font-display mt-6 text-4xl leading-[1.05] tracking-tight lg:text-6xl text-balance">
            A family of modules on{" "}
            <span className="italic text-teal">one intelligence substrate.</span>
          </h2>
        </div>

        <div className="mt-16 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {modules.map((m, i) => (
            <article
              key={m.t}
              className={`group relative rounded-2xl border border-background/10 bg-background/[0.03] p-8 transition-all duration-500 hover:border-background/20 hover:bg-background/[0.06] ${
                i === 2 ? "lg:row-span-2" : ""
              }`}
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
              {i === 2 && (
                <div className="mt-8 flex items-center gap-2 text-xs text-teal">
                  <span className="h-1.5 w-1.5 rounded-full bg-teal animate-pulse" />
                  <span className="font-mono uppercase tracking-[0.2em]">
                    First module
                  </span>
                </div>
              )}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function Architecture() {
  const layers = [
    "Evidence Sources",
    "Evidence Processing",
    "Evidence Objects",
    "Clinical Intelligence",
    "Research Applications",
  ];
  return (
    <section id="research" className="py-28 lg:py-36">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="grid gap-16 lg:grid-cols-12 lg:gap-20">
          <div className="lg:col-span-5">
            <Eyebrow>Architecture vision</Eyebrow>
            <h2 className="font-display mt-6 text-4xl leading-[1.05] tracking-tight lg:text-6xl text-balance">
              From sources to{" "}
              <span className="italic text-royal">insight,</span> transparently.
            </h2>
            <p className="mt-6 max-w-md text-lg leading-relaxed text-muted-foreground">
              Every layer is inspectable. Every insight is explainable. The
              substrate is designed to outlive any single model or method.
            </p>

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
                height={1008}
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

function WhyWeip() {
  const traditional = ["Read", "Search", "Manual", "Fragmented", "Static"];
  const weip = ["Structured", "Explainable", "Connected", "Intelligent", "Living"];
  return (
    <section className="py-28 lg:py-36">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="max-w-3xl">
          <Eyebrow>Why WEIP</Eyebrow>
          <h2 className="font-display mt-6 text-4xl leading-[1.05] tracking-tight lg:text-6xl text-balance">
            Two ways to work with evidence.
          </h2>
        </div>

        <div className="mt-16 grid gap-6 md:grid-cols-2">
          <div className="surface-card p-10">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
                Traditional literature
              </span>
              <span className="font-mono text-xs text-muted-foreground">Today</span>
            </div>
            <h3 className="font-display mt-8 text-3xl tracking-tight text-muted-foreground">
              Read. Search. Repeat.
            </h3>
            <ul className="mt-8 space-y-4">
              {traditional.map((t) => (
                <li
                  key={t}
                  className="flex items-center justify-between border-b border-hairline pb-3 last:border-0"
                >
                  <span className="text-muted-foreground">{t}</span>
                  <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
                    manual
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div className="relative overflow-hidden rounded-xl border border-ink/10 bg-ink p-10 text-background shadow-elevated">
            <div
              aria-hidden
              className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full opacity-40"
              style={{
                background:
                  "radial-gradient(circle, color-mix(in oklab, var(--teal) 50%, transparent), transparent 60%)",
              }}
            />
            <div className="relative flex items-center justify-between">
              <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-background/70">
                WEIP
              </span>
              <span className="font-mono text-xs text-teal">Now emerging</span>
            </div>
            <h3 className="font-display relative mt-8 text-3xl tracking-tight">
              An evidence intelligence.
            </h3>
            <ul className="relative mt-8 space-y-4">
              {weip.map((t) => (
                <li
                  key={t}
                  className="flex items-center justify-between border-b border-background/10 pb-3 last:border-0"
                >
                  <span>{t}</span>
                  <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-teal">
                    native
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

function Inspirational() {
  return (
    <section id="about" className="relative overflow-hidden py-32 lg:py-44">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{ background: "var(--gradient-hero)" }}
      />
      <div className="mx-auto max-w-5xl px-6 text-center lg:px-10">
        <Eyebrow>The future</Eyebrow>
        <h2 className="font-display mx-auto mt-8 max-w-4xl text-[clamp(2.75rem,6vw,5.5rem)] leading-[1.02] tracking-tight text-balance">
          The future of women's clinical evidence will be{" "}
          <span className="italic text-royal">written, not searched.</span>
        </h2>
        <p className="mx-auto mt-8 max-w-2xl text-lg leading-relaxed text-muted-foreground">
          A generation of researchers, physicians and institutions deserve an
          infrastructure worthy of the questions they are asking.
        </p>
      </div>
    </section>
  );
}

function FinalCTA() {
  return (
    <section
      id="early-access"
      className="relative overflow-hidden border-t border-hairline bg-ink py-28 text-background lg:py-36"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          background:
            "radial-gradient(600px 300px at 20% 20%, color-mix(in oklab, var(--royal) 60%, transparent), transparent 60%), radial-gradient(500px 300px at 80% 80%, color-mix(in oklab, var(--teal) 40%, transparent), transparent 60%)",
        }}
      />
      <div className="relative mx-auto max-w-6xl px-6 lg:px-10">
        <div className="max-w-3xl">
          <Eyebrow>
            <span className="text-background/60">Join early</span>
          </Eyebrow>
          <h2 className="font-display mt-8 text-[clamp(2.5rem,6vw,5rem)] leading-[1.02] tracking-tight text-balance">
            Build the substrate for the next century of women's health research.
          </h2>
          <p className="mt-8 max-w-xl text-lg leading-relaxed text-background/70">
            We're partnering with a small group of researchers, physicians and
            institutions shaping the first generation of WEIP.
          </p>
          <div className="mt-12 flex flex-wrap items-center gap-3">
            <a
              href="#"
              className="inline-flex items-center gap-2 rounded-full bg-background px-6 py-3 text-sm font-medium text-ink transition hover:opacity-90"
            >
              Request early access →
            </a>
            <a
              href="#"
              className="inline-flex items-center gap-2 rounded-full border border-background/20 px-6 py-3 text-sm text-background transition hover:bg-background/10"
            >
              Contact the team
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  const cols = [
    { title: "Platform", links: ["Overview", "Intelligence", "Applications", "Roadmap"] },
    { title: "Research", links: ["Methodology", "Publications", "Evidence Quality", "Open Science"] },
    { title: "Developers", links: ["API", "Documentation", "Changelog", "Status"] },
    { title: "Company", links: ["About", "Careers", "Press", "Contact"] },
  ];
  return (
    <footer id="developers" className="border-t border-hairline bg-background">
      <div className="mx-auto max-w-7xl px-6 py-20 lg:px-10">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <WeipMark />
            <p className="mt-6 max-w-xs text-sm leading-relaxed text-muted-foreground">
              Women's Evidence Intelligence Platform. A scientific operating
              system for clinical evidence.
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
          <span>© {new Date().getFullYear()} WEIP. All rights reserved.</span>
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
        <Problem />
        <Vision />
        <Platform />
        <FuturePlatform />
        <Architecture />
        <WhyWeip />
        <Inspirational />
        <FinalCTA />
      </main>
      <Footer />
    </div>
  );
}
