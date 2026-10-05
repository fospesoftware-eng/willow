"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { Reveal } from "@/components/ui/Reveal";
import { OptimizedImage } from "@/components/ui/OptimizedImage";
import { defaultPages } from "@/lib/cms/defaults";

type FeatureContent = {
  image: string;
  imageAlt: string;
  tag: string;
  title: string;
  accent: string;
  caption: string;
  ctaLabel: string;
  ctaHref: string;
};

const D = defaultPages.find((p) => p.slug === "home")!.content.feature as FeatureContent;

export function FeaturePanel({ c }: { c?: Partial<FeatureContent> }) {
  const t = { ...D, ...c };
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], ["-6%", "6%"]);

  return (
    <section className="bg-ivory pb-20 md:pb-32">
      <div className="mx-auto max-w-[1440px] px-5 md:px-10">
        <Reveal>
          <div
            ref={ref}
            className="relative h-[60vh] md:h-[80vh] min-h-[460px] rounded-[2rem] md:rounded-[2.5rem] overflow-hidden shadow-soft"
          >
            <motion.div style={{ y, scale: 1.12 }} className="absolute inset-0">
              <OptimizedImage
                src={t.image}
                alt={t.imageAlt}
                sizes="(max-width: 1440px) 100vw, 1400px"
              />
            </motion.div>

            <div className="absolute inset-0 bg-gradient-to-t from-forest-950/80 via-forest-950/15 to-forest-950/25" />

            {/* Top tag */}
            <div className="absolute top-6 left-6 md:top-10 md:left-10">
              <span className="inline-flex items-center gap-2 rounded-full bg-ivory/15 backdrop-blur-md border border-ivory/25 px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.24em] text-ivory">
                <span className="w-1.5 h-1.5 rounded-full bg-gold" />
                {t.tag}
              </span>
            </div>

            {/* Bottom caption */}
            <div className="absolute inset-x-0 bottom-0 p-6 md:p-12">
              <Reveal delay={0.1}>
                <h3 className="font-display font-extrabold text-ivory text-3xl sm:text-5xl md:text-6xl leading-[1.02] tracking-[-0.02em] max-w-4xl uppercase">
                  {t.title}
                  <br />
                  <span className="font-serif font-medium italic normal-case text-gold-light">
                    {t.accent}
                  </span>
                </h3>
              </Reveal>
              <Reveal delay={0.25}>
                <div className="mt-6 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-5">
                  <p className="text-sage-200 text-sm md:text-base max-w-md leading-relaxed">
                    {t.caption}
                  </p>
                  <a
                    href={t.ctaHref}
                    className="group shrink-0 inline-flex items-center gap-3 rounded-full bg-ivory text-forest-950 pl-6 pr-2 py-2 text-[12px] font-semibold uppercase tracking-[0.14em] hover:bg-gold transition-colors duration-300"
                  >
                    {t.ctaLabel}
                    <span className="flex items-center justify-center w-9 h-9 rounded-full bg-forest-900 text-ivory group-hover:rotate-45 transition-transform duration-500">
                      →
                    </span>
                  </a>
                </div>
              </Reveal>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
