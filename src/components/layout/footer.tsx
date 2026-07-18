import { Link } from "@tanstack/react-router";
import { FOOTER_SECTIONS } from "@/constants/navigation";
import { SITE } from "@/constants/site";
import { WeipMark } from "./weip-mark";
import { Container } from "./container";

export function Footer() {
  return (
    <footer className="border-t border-hairline bg-secondary/40 py-16">
      <Container>
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <WeipMark />
            <p className="mt-6 max-w-sm text-sm leading-relaxed text-muted-foreground">
              {SITE.description}
            </p>
          </div>
          <div className="grid grid-cols-2 gap-8 md:grid-cols-3 lg:col-span-7">
            {FOOTER_SECTIONS.map((section) => (
              <div key={section.title}>
                <div className="font-mono text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
                  {section.title}
                </div>
                <ul className="mt-4 space-y-3 text-sm">
                  {section.items.map((item) => (
                    <li key={item.to}>
                      <Link
                        to={item.to as never}
                        className="text-foreground/80 transition-colors hover:text-foreground"
                      >
                        {item.label}
                      </Link>
                    </li>

                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-14 flex flex-col items-start justify-between gap-4 border-t border-hairline pt-6 text-xs text-muted-foreground md:flex-row md:items-center">
          <div>© {SITE.year} {SITE.name}. All rights reserved.</div>
          <div className="font-mono uppercase tracking-[0.2em]">
            {SITE.tagline}
          </div>
        </div>
      </Container>
    </footer>
  );
}
