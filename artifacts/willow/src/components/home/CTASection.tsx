"use client";

import { Reveal } from "@/components/ui/Reveal";
import { OptimizedImage } from "@/components/ui/OptimizedImage";
import { defaultPages } from "@/lib/cms/defaults";

type CtaContent = {
  image: string;
  eyebrow: string;
  title: string;
  accent: string;
  text: string;
  primaryLabel: string;
  primaryHref: string;
  secondaryLabel: string;
  secondaryHref: string;
};

const D = defaultPages.find((p) => p.slug === "home")!.content.cta as CtaContent;

export function CTASection({ c }: { c?: Partial<CtaContent> }) {
  const t = { ...D, ...c };
  return (
    <section className="bg-forest-950 py-20 md:py-32 relative overflow-hidden">
      <div className="grain absolute inset-0 pointer-events-none" />
      <div className="absolute inset-0 opacity-25">
        <OptimizedImage
          src={t.image}
          alt=""
          sizes="100vw"
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-b from-forest-950 via-forest-950/85 to-forest-950" />

      <div className="relative mx-auto max-w-[1440px] px-5 md:px-10">
        <div className="rounded-[2rem] md:rounded-[2.5rem] border border-ivory/10 px-8 py-16 md:px-20 md:py-24 text-center backdrop-blur-sm bg-forest-900/40">
          <Reveal>
            <span className="inline-flex items-center gap-2 rounded-full bg-ivory/10 border border-ivory/20 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.28em] text-sage-300">
              <span className="w-1.5 h-1.5 rounded-full bg-gold" />
              {t.eyebrow}
            </span>
          </Reveal>
          <Reveal delay={0.1}>
            <h2 className="mt-8 font-display font-extrabold text-ivory text-4xl md:text-6xl lg:text-7xl leading-[0.98] tracking-[-0.02em] uppercase">
              {t.title}
              <br />
              <span className="font-serif font-medium italic normal-case text-gold-light">
                {t.accent}
              </span>
            </h2>
          </Reveal>
          <Reveal delay={0.2}>
            <p className="mt-8 text-sage-200 text-base md:text-lg max-w-xl mx-auto leading-relaxed">
              {t.text}
            </p>
          </Reveal>
          <Reveal delay={0.3}>
            <div className="mt-12 flex flex-wrap items-center justify-center gap-3">
              <a
                href={t.primaryHref}
                className="group inline-flex items-center gap-3 rounded-full bg-ivory text-forest-950 pl-7 pr-2 py-2 text-[13px] font-bold uppercase tracking-[0.12em] hover:bg-gold transition-colors duration-300"
              >
                {t.primaryLabel}
                <span className="flex items-center justify-center w-9 h-9 rounded-full bg-forest-900 text-ivory group-hover:rotate-45 transition-transform duration-500">
                  →
                </span>
              </a>
              <a
                href={t.secondaryHref}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-ivory/30 text-ivory px-7 py-4 text-[13px] font-semibold tracking-wide hover:bg-ivory/10 transition-colors duration-300"
              >
                {t.secondaryLabel}
              </a>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
