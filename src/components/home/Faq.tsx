"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Reveal } from "@/components/ui/Reveal";
import { defaultPages } from "@/lib/cms/defaults";

type FaqContent = {
  eyebrow: string;
  title1: string;
  title2: string;
  accent: string;
  subtext: string;
  ctaLabel: string;
  ctaHref: string;
  items: { q: string; a: string }[];
};

const D = defaultPages.find((p) => p.slug === "home")!.content.faq as FaqContent;

export function Faq({ c }: { c?: Partial<FaqContent> }) {
  const t = { ...D, ...c, items: c?.items ?? D.items };
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className="bg-cream py-20 md:py-32">
      <div className="mx-auto max-w-[1440px] px-5 md:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-4">
            <Reveal>
              <span className="inline-flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.32em] text-forest-600 mb-6">
                <span className="h-px w-8 bg-gold" />
                {t.eyebrow}
              </span>
            </Reveal>
            <Reveal delay={0.1}>
              <h2 className="font-display font-extrabold text-forest-900 text-4xl md:text-5xl leading-[1.04] tracking-[-0.02em] uppercase">
                {t.title1}
                <br />
                {t.title2}
                <br />
                <span className="font-serif font-medium italic normal-case text-forest-600">
                  {t.accent}
                </span>
              </h2>
            </Reveal>
            <Reveal delay={0.2}>
              <p className="mt-6 text-forest-700/70 text-sm leading-relaxed max-w-xs">
                {t.subtext}
              </p>
            </Reveal>
          </div>

          <div className="lg:col-span-8">
            <div className="divide-y divide-forest-900/10 border-y border-forest-900/10">
              {t.items.map((item, i) => {
                const isOpen = open === i;
                return (
                  <Reveal key={i} delay={i * 0.05}>
                    <div>
                      <button
                        onClick={() => setOpen(isOpen ? null : i)}
                        aria-expanded={isOpen}
                        className="w-full flex items-center justify-between gap-6 py-6 text-left group"
                      >
                        <span className="font-display font-bold text-lg md:text-xl text-forest-900 group-hover:text-forest-600 transition-colors">
                          {item.q}
                        </span>
                        <span
                          className={`shrink-0 flex items-center justify-center w-10 h-10 rounded-full border transition-all duration-300 ${
                            isOpen
                              ? "bg-forest-900 border-forest-900 text-ivory rotate-45"
                              : "border-forest-900/20 text-forest-900"
                          }`}
                        >
                          +
                        </span>
                      </button>
                      <AnimatePresence initial={false}>
                        {isOpen && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                            className="overflow-hidden"
                          >
                            <p className="pb-7 pr-16 text-forest-700/80 leading-relaxed max-w-2xl">
                              {item.a}
                            </p>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </Reveal>
                );
              })}
            </div>

            <Reveal delay={0.2}>
              <a
                href={t.ctaHref}
                className="group mt-8 inline-flex items-center gap-3 rounded-full bg-forest-900 text-ivory pl-6 pr-2 py-2 text-[12px] font-bold uppercase tracking-[0.12em] hover:bg-forest-700 transition-colors duration-300"
              >
                {t.ctaLabel}
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-ivory/15 group-hover:bg-gold group-hover:text-forest-950 transition-colors duration-300">
                  →
                </span>
              </a>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
