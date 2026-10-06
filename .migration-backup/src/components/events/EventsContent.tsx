"use client";

import { Reveal } from "@/components/ui/Reveal";
import { ParallaxImage } from "@/components/ui/ParallaxImage";
import { CTAButton } from "@/components/ui/CTAButton";
import { defaultPages } from "@/lib/cms/defaults";

type Lead = {
  image: string;
  imageAlt: string;
  eyebrow: string;
  title: string;
  accent: string;
  text: string;
  quote: string;
};
type Cards = { title: string; items: { title: string; body: string }[] };
type Workshops = {
  eyebrow: string;
  title: string;
  accent: string;
  items: { title: string; body: string }[];
};
type Support = {
  eyebrow: string;
  title: string;
  accent: string;
  text: string;
  facilities: string[];
  managerTitle: string;
  managerName: string;
  managerEmail: string;
};
type Cta = {
  eyebrow: string;
  title: string;
  accent: string;
  primaryLabel: string;
  primaryHref: string;
  secondaryLabel: string;
  secondaryHref: string;
};
export type EventsContentData = {
  lead: Lead;
  community: Cards;
  workshops: Workshops;
  support: Support;
  cta: Cta;
};

const D = defaultPages.find((p) => p.slug === "events")!.content as unknown as EventsContentData;

export function EventsContent({ c }: { c?: Partial<EventsContentData> }) {
  const lead = c?.lead ?? D.lead;
  const community = c?.community ?? D.community;
  const workshops = c?.workshops ?? D.workshops;
  const support = c?.support ?? D.support;
  const cta = c?.cta ?? D.cta;

  return (
    <div className="bg-ivory">
      {/* Ecological Learning Centre */}
      <section className="py-24 md:py-32">
        <div className="mx-auto max-w-7xl px-5 md:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-6">
              <Reveal>
                <ParallaxImage
                  src={lead.image}
                  alt={lead.imageAlt}
                  className="aspect-[4/5] w-full"
                />
              </Reveal>
            </div>
            <div className="lg:col-span-6">
              <Reveal>
                <span className="text-[11px] uppercase tracking-[0.3em] text-forest-600">
                  {lead.eyebrow}
                </span>
              </Reveal>
              <Reveal delay={0.1}>
                <h2 className="mt-4 font-serif text-4xl md:text-5xl text-forest-900 leading-[1.08]">
                  {lead.title}
                  <br />
                  <span className="italic font-light">{lead.accent}</span>
                </h2>
              </Reveal>
              <Reveal delay={0.2}>
                <p className="mt-6 text-forest-700/80 leading-relaxed">
                  {lead.text}
                </p>
              </Reveal>
              <Reveal delay={0.3}>
                <blockquote className="mt-8 border-l-2 border-gold pl-6">
                  <p className="font-serif text-xl md:text-2xl text-forest-800 italic">
                    {lead.quote}
                  </p>
                </blockquote>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* Community programmes */}
      <section className="bg-forest-950 text-ivory py-24 md:py-32 relative overflow-hidden">
        <div className="grain absolute inset-0 pointer-events-none" />
        <div className="relative mx-auto max-w-7xl px-5 md:px-8">
          <Reveal>
            <h2 className="font-serif text-4xl md:text-5xl leading-[1.08] max-w-2xl">
              {community.title}
            </h2>
          </Reveal>
          <div className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-px bg-ivory/10">
            {community.items.map((card, i) => (
              <Reveal key={card.title} delay={i * 0.08}>
                <div className="bg-forest-950 p-8 h-full">
                  <span className="text-gold font-serif text-2xl">
                    0{i + 1}
                  </span>
                  <h3 className="mt-4 font-serif text-2xl">{card.title}</h3>
                  <p className="mt-3 text-sage-200 text-sm leading-relaxed">
                    {card.body}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Workshops */}
      <section className="py-24 md:py-32">
        <div className="mx-auto max-w-7xl px-5 md:px-8">
          <Reveal>
            <div className="max-w-2xl">
              <span className="text-[11px] uppercase tracking-[0.3em] text-forest-600">
                {workshops.eyebrow}
              </span>
              <h2 className="mt-4 font-serif text-4xl md:text-5xl text-forest-900 leading-[1.08]">
                {workshops.title}
                <br />
                <span className="italic font-light">{workshops.accent}</span>
              </h2>
            </div>
          </Reveal>

          <div className="mt-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {workshops.items.map((w, i) => (
              <Reveal key={w.title} delay={i * 0.06}>
                <div className="h-full p-8 bg-cream border border-forest-900/5 hover:border-forest-600 transition-colors">
                  <h3 className="font-serif text-xl text-forest-900">
                    {w.title}
                  </h3>
                  <p className="mt-3 text-sm text-forest-700/80 leading-relaxed">
                    {w.body}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Delivery support */}
      <section className="bg-cream py-24 md:py-32">
        <div className="mx-auto max-w-7xl px-5 md:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            <div className="lg:col-span-6">
              <Reveal>
                <span className="text-[11px] uppercase tracking-[0.3em] text-forest-600">
                  {support.eyebrow}
                </span>
              </Reveal>
              <Reveal delay={0.1}>
                <h2 className="mt-4 font-serif text-4xl md:text-5xl text-forest-900 leading-[1.08]">
                  {support.title}
                  <br />
                  <span className="italic font-light">{support.accent}</span>
                </h2>
              </Reveal>
              <Reveal delay={0.2}>
                <p className="mt-6 text-forest-700/80 leading-relaxed">
                  {support.text}
                </p>
              </Reveal>
            </div>
            <div className="lg:col-span-6">
              <Reveal delay={0.1}>
                <div className="p-8 bg-forest-900 text-ivory">
                  <ul className="space-y-4">
                    {support.facilities.map((f) => (
                      <li key={f} className="flex items-start gap-3">
                        <span className="mt-1.5 block h-1.5 w-1.5 bg-gold shrink-0" />
                        <span className="text-sage-200">{f}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-8 pt-6 border-t border-ivory/10">
                    <p className="text-xs uppercase tracking-[0.2em] text-sage-400">
                      {support.managerTitle}
                    </p>
                    <p className="mt-1 font-serif text-xl">{support.managerName}</p>
                    <a
                      href={`mailto:${support.managerEmail}`}
                      className="mt-2 block text-sm text-gold hover:text-gold-light"
                    >
                      {support.managerEmail}
                    </a>
                  </div>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* Plan your event CTA */}
      <section className="bg-forest-900 text-ivory py-24 md:py-32 relative overflow-hidden">
        <div className="grain absolute inset-0 pointer-events-none" />
        <div className="relative mx-auto max-w-4xl px-5 md:px-8 text-center">
          <Reveal>
            <span className="text-[11px] uppercase tracking-[0.3em] text-sage-400">
              {cta.eyebrow}
            </span>
          </Reveal>
          <Reveal delay={0.1}>
            <h2 className="mt-6 font-serif text-4xl md:text-6xl leading-[1.05]">
              {cta.title}
              <br />
              <span className="italic font-light">{cta.accent}</span>
            </h2>
          </Reveal>
          <Reveal delay={0.2}>
            <div className="mt-12 flex flex-wrap justify-center gap-4">
              <CTAButton
                href={cta.primaryHref}
                variant="primary"
                external
              >
                {cta.primaryLabel}
              </CTAButton>
              <a
                href={cta.secondaryHref}
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
