"use client";

import Link from "next/link";
import { Reveal } from "@/components/ui/Reveal";
import { OptimizedImage } from "@/components/ui/OptimizedImage";
import { defaultPages } from "@/lib/cms/defaults";

type StatementContent = {
  eyebrow: string;
  ctaLabel: string;
  ctaHref: string;
  avatars: string[];
  avatarBadge: string;
  titleBefore: string;
  accent: string;
  titleAfter: string;
  paragraph: string;
};

const D = defaultPages.find((p) => p.slug === "home")!.content.statement as StatementContent;

export function Statement({ c }: { c?: Partial<StatementContent> }) {
  const t = { ...D, ...c };
  return (
    <section className="relative bg-ivory py-20 md:py-32">
      <div className="mx-auto max-w-[1440px] px-5 md:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">
          {/* Left meta column */}
          <div className="lg:col-span-4 flex lg:flex-col justify-between lg:justify-start gap-8">
            <Reveal>
              <span className="inline-flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.32em] text-forest-600">
                <span className="h-px w-8 bg-gold" />
                {t.eyebrow}
              </span>
            </Reveal>

            <Reveal delay={0.15}>
              <Link
                href={t.ctaHref}
                className="group inline-flex items-center gap-3 rounded-full border border-forest-900/15 pl-5 pr-2 py-2 text-[12px] font-semibold uppercase tracking-[0.14em] text-forest-900 hover:bg-forest-900 hover:text-ivory transition-colors duration-300"
              >
                {t.ctaLabel}
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-forest-900 text-ivory group-hover:bg-gold group-hover:text-forest-950 transition-colors duration-300">
                  →
                </span>
              </Link>
            </Reveal>

            {/* Circular image cluster */}
            <Reveal delay={0.25}>
              <div className="hidden lg:flex items-center -space-x-4">
                {t.avatars.map((src, i) => (
                  <span
                    key={i}
                    className="relative block w-16 h-16 rounded-full overflow-hidden border-2 border-ivory shadow-card"
                  >
                    <OptimizedImage
                      src={src}
                      alt=""
                      sizes="64px"
                    />
                  </span>
                ))}
                <span className="relative flex items-center justify-center w-16 h-16 rounded-full bg-forest-900 text-ivory border-2 border-ivory text-[9px] font-bold uppercase tracking-wider text-center leading-tight">
                  {t.avatarBadge}
                </span>
              </div>
            </Reveal>
          </div>

          {/* Right statement */}
          <div className="lg:col-span-8">
            <Reveal delay={0.1}>
              <h2 className="font-display font-extrabold text-forest-900 text-4xl sm:text-5xl md:text-6xl lg:text-[4.4rem] leading-[1.04] tracking-[-0.02em]">
                {t.titleBefore}{" "}
                <span className="font-serif font-medium italic text-forest-600">
                  {t.accent}
                </span>
                {t.titleAfter}
              </h2>
            </Reveal>
            <Reveal delay={0.25}>
              <p className="mt-8 md:mt-10 text-lg leading-relaxed text-forest-700/80 max-w-2xl">
                {t.paragraph}
              </p>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
