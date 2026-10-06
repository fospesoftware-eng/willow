"use client";

import { Reveal } from "@/components/ui/Reveal";
import { booking } from "@/data/site";
import { CTAButton } from "@/components/ui/CTAButton";
import { defaultPages } from "@/lib/cms/defaults";

type Group = { id: string; title: string; items: string[] };
type Pregnancy = {
  title: string;
  text: string;
  links: { label: string; href: string }[];
};
export type SafetyContentData = {
  notice: string;
  groups: Group[];
  pregnancy: Pregnancy;
};

const D = defaultPages.find((p) => p.slug === "health-safety")!.content as unknown as SafetyContentData;

export function SafetyContent({ c }: { c?: Partial<SafetyContentData> }) {
  const notice = c?.notice ?? D.notice;
  const groups = c?.groups ?? D.groups;
  const pregnancy = c?.pregnancy ?? D.pregnancy;

  return (
    <section className="bg-ivory py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        {/* Top notice */}
        <Reveal>
          <div className="p-6 md:p-8 bg-gold/10 border-l-4 border-gold mb-16">
            <p className="text-sm uppercase tracking-[0.2em] text-earth-700 font-semibold mb-2">
              Important
            </p>
            <p className="text-forest-800 text-lg font-serif">{notice}</p>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Sticky nav */}
          <nav className="lg:col-span-3">
            <div className="sticky top-28">
              <p className="text-[11px] uppercase tracking-[0.25em] text-forest-600 mb-4">
                On this page
              </p>
              <ul className="space-y-1">
                {groups.map((s) => (
                  <li key={s.id}>
                    <a
                      href={`#${s.id}`}
                      className="block py-2 text-sm text-forest-700 hover:text-forest-900 transition-colors border-b border-forest-900/5"
                    >
                      {s.title}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </nav>

          {/* Sections */}
          <div className="lg:col-span-9 space-y-16">
            {groups.map((s, i) => (
              <Reveal key={s.id} delay={i * 0.05}>
                <section id={s.id} className="scroll-mt-32">
                  <h2 className="font-serif text-3xl md:text-4xl text-forest-900 mb-6">
                    {s.title}
                  </h2>
                  <ul className="space-y-3">
                    {s.items.map((item, j) => (
                      <li
                        key={j}
                        className="flex items-start gap-4 text-forest-700 leading-relaxed"
                      >
                        <span className="mt-2 block h-1.5 w-1.5 bg-gold shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </section>
              </Reveal>
            ))}

            {/* Pregnancy notice */}
            <Reveal>
              <section className="p-8 bg-forest-900 text-ivory">
                <h2 className="font-serif text-3xl mb-4">{pregnancy.title}</h2>
                <p className="text-sage-200 leading-relaxed">{pregnancy.text}</p>
                <div className="mt-6 flex flex-wrap gap-3">
                  {pregnancy.links.map((l) => (
                    <a
                      key={l.label}
                      href={l.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-gold hover:text-gold-light underline underline-offset-4"
                    >
                      {l.label} →
                    </a>
                  ))}
                </div>
              </section>
            </Reveal>

            {/* CTA */}
            <Reveal>
              <div className="flex flex-wrap gap-4 pt-4">
                <CTAButton href={booking.saunaDip} variant="primary">
                  Complete SENTINAL Form
                </CTAButton>
                <CTAButton href="/contact" variant="outline">
                  Contact Us
                </CTAButton>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
