"use client";

import { Reveal } from "@/components/ui/Reveal";
import { ParallaxImage } from "@/components/ui/ParallaxImage";
import { CTAButton } from "@/components/ui/CTAButton";
import { defaultPages } from "@/lib/cms/defaults";

type Intro = {
  eyebrow: string;
  title: string;
  accent: string;
  paragraphs: string[];
  image: string;
  imageAlt: string;
};
type Rules = { eyebrow: string; title: string; accent: string; text: string; items: string[] };
type Cards = {
  eyebrow: string;
  title: string;
  accent: string;
  items: { title: string; body: string }[];
};
type Local = {
  eyebrow: string;
  title: string;
  accent: string;
  text: string;
  highlights: { name: string; desc: string }[];
};
type Cta = {
  title: string;
  accent: string;
  text: string;
  primaryLabel: string;
  primaryHref: string;
  secondaryLabel: string;
  secondaryHref: string;
};
export type AboutContentData = {
  intro: Intro;
  rules: Rules;
  facilities: Cards;
  local: Local;
  cta: Cta;
};

const D = defaultPages.find((p) => p.slug === "about")!.content as unknown as AboutContentData;

export function AboutContent({ c }: { c?: Partial<AboutContentData> }) {
  const intro = c?.intro ?? D.intro;
  const rules = c?.rules ?? D.rules;
  const facilities = c?.facilities ?? D.facilities;
  const local = c?.local ?? D.local;
  const cta = c?.cta ?? D.cta;

  return (
    <div className="bg-ivory">
      {/* Driven by Nature */}
      <section className="py-24 md:py-32">
        <div className="mx-auto max-w-7xl px-5 md:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-6 order-2 lg:order-1">
              <Reveal>
                <span className="text-[11px] uppercase tracking-[0.3em] text-forest-600">
                  {intro.eyebrow}
                </span>
              </Reveal>
              <Reveal delay={0.1}>
                <h2 className="mt-4 font-serif text-4xl md:text-5xl text-forest-900 leading-[1.08]">
                  {intro.title}
                  <br />
                  <span className="italic font-light">{intro.accent}</span>
                </h2>
              </Reveal>
              {intro.paragraphs.map((p, i) => (
                <Reveal key={i} delay={0.2 + i * 0.1}>
                  <p className="mt-6 text-forest-700/80 leading-relaxed">{p}</p>
                </Reveal>
              ))}
            </div>
            <div className="lg:col-span-6 order-1 lg:order-2">
              <Reveal>
                <ParallaxImage
                  src={intro.image}
                  alt={intro.imageAlt}
                  className="aspect-[4/5] w-full"
                />
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* Codes of conduct */}
      <section className="bg-forest-950 text-ivory py-24 md:py-32 relative overflow-hidden">
        <div className="grain absolute inset-0 pointer-events-none" />
        <div className="relative mx-auto max-w-7xl px-5 md:px-8">
          <div className="max-w-3xl">
            <Reveal>
              <span className="text-[11px] uppercase tracking-[0.3em] text-sage-400">
                {rules.eyebrow}
              </span>
            </Reveal>
            <Reveal delay={0.1}>
              <h2 className="mt-4 font-serif text-4xl md:text-5xl leading-[1.08]">
                {rules.title}
                <br />
                <span className="italic font-light">{rules.accent}</span>
              </h2>
            </Reveal>
            <Reveal delay={0.2}>
              <p className="mt-6 text-sage-200 leading-relaxed">{rules.text}</p>
            </Reveal>
          </div>

          <div className="mt-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-ivory/10">
            {rules.items.map((rule, i) => (
              <Reveal key={rule} delay={i * 0.05}>
                <div className="bg-forest-950 p-8">
                  <span className="text-gold font-serif text-2xl">
                    0{i + 1}
                  </span>
                  <p className="mt-4 text-ivory">{rule}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Retail & Facilities */}
      <section className="py-24 md:py-32">
        <div className="mx-auto max-w-7xl px-5 md:px-8">
          <Reveal>
            <div className="max-w-2xl">
              <span className="text-[11px] uppercase tracking-[0.3em] text-forest-600">
                {facilities.eyebrow}
              </span>
              <h2 className="mt-4 font-serif text-4xl md:text-5xl text-forest-900 leading-[1.08]">
                {facilities.title}
                <br />
                <span className="italic font-light">{facilities.accent}</span>
              </h2>
            </div>
          </Reveal>

          <div className="mt-14 grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            {facilities.items.map((item, i) => (
              <Reveal key={item.title} delay={i * 0.08}>
                <div className="h-full p-8 bg-cream border border-forest-900/5">
                  <h3 className="font-serif text-2xl text-forest-900">
                    {item.title}
                  </h3>
                  <p className="mt-3 text-forest-700/80 leading-relaxed">
                    {item.body}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Local attractions */}
      <section className="bg-cream py-24 md:py-32">
        <div className="mx-auto max-w-7xl px-5 md:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            <div className="lg:col-span-5">
              <Reveal>
                <span className="text-[11px] uppercase tracking-[0.3em] text-forest-600">
                  {local.eyebrow}
                </span>
              </Reveal>
              <Reveal delay={0.1}>
                <h2 className="mt-4 font-serif text-4xl md:text-5xl text-forest-900 leading-[1.08]">
                  {local.title}
                  <br />
                  <span className="italic font-light">{local.accent}</span>
                </h2>
              </Reveal>
              <Reveal delay={0.2}>
                <p className="mt-6 text-forest-700/80 leading-relaxed">
                  {local.text}
                </p>
              </Reveal>
            </div>

            <div className="lg:col-span-7">
              <Reveal delay={0.1}>
                <div className="p-8 bg-forest-900 text-ivory">
                  <h3 className="font-serif text-2xl mb-6">Local highlights</h3>
                  <ul className="space-y-4">
                    {local.highlights.map((h) => (
                      <li key={h.name} className="border-t border-ivory/10 pt-4 first:border-0 first:pt-0">
                        <p className="text-gold font-medium">{h.name}</p>
                        <p className="mt-1 text-sm text-sage-200">{h.desc}</p>
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 md:py-32 bg-forest-900 text-ivory relative overflow-hidden">
        <div className="grain absolute inset-0 pointer-events-none" />
        <div className="relative mx-auto max-w-3xl px-5 md:px-8 text-center">
          <Reveal>
            <h2 className="font-serif text-4xl md:text-6xl leading-[1.05]">
              {cta.title}
              <br />
              <span className="italic font-light">{cta.accent}</span>
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mt-6 text-sage-200">{cta.text}</p>
          </Reveal>
          <Reveal delay={0.2}>
            <div className="mt-10 flex flex-wrap justify-center gap-4">
              <CTAButton href={cta.primaryHref} variant="primary">
                {cta.primaryLabel}
              </CTAButton>
              <a
                href={cta.secondaryHref}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-7 py-3.5 text-[13px] font-medium uppercase tracking-[0.18em] border border-ivory/30 text-ivory hover:bg-ivory hover:text-forest-900 transition-colors"
              >
                {cta.secondaryLabel}
              </a>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
