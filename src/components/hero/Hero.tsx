"use client";

import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
} from "framer-motion";
import { useRef } from "react";
import { OptimizedImage } from "@/components/ui/OptimizedImage";
import { defaultPages } from "@/lib/cms/defaults";

const EASE = [0.16, 1, 0.3, 1] as const;

type HeroContent = {
  image: string;
  imageAlt: string;
  badge: string;
  line1: string;
  line2: string;
  subtitle: string;
  metaLeft: string;
  metaRight: string;
  tags: string[];
  ctaPrimaryLabel: string;
  ctaPrimaryHref: string;
  ctaSecondaryLabel: string;
  ctaSecondaryHref: string;
  wordmark: string;
};

const H = defaultPages.find((p) => p.slug === "home")!.content.hero as HeroContent;

const line = {
  hidden: { y: "115%" },
  show: { y: "0%", transition: { duration: 1.1, ease: EASE } },
};

const lineDelayed = {
  hidden: { y: "115%" },
  show: { y: "0%", transition: { duration: 1.1, ease: EASE, delay: 0.12 } },
};

export function Hero({ c }: { c?: Partial<HeroContent> }) {
  const t = { ...H, ...c };
  const ref = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "16%"]);
  const scale = useTransform(scrollYProgress, [0, 1], [1.05, 1.16]);
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "32%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.78], [1, 0]);

  return (
    <section
      ref={ref}
      className="relative h-[100svh] min-h-[620px] w-full overflow-hidden"
    >
      {/* Full-bleed aerial — scroll parallax + slow Ken Burns pan (L → R → B → T) */}
      <motion.div style={{ y, scale }} className="absolute inset-0 will-change-transform">
        <motion.div
          className="absolute inset-0 will-change-transform"
          initial={false}
          animate={
            reduceMotion
              ? undefined
              : {
                  // Tour all four corners; keyframes close the loop seamlessly
                  x: ["-1.8%", "1.8%", "1.8%", "-1.8%", "-1.8%"],
                  y: ["-1.8%", "-1.8%", "1.8%", "1.8%", "-1.8%"],
                }
          }
          transition={{
            duration: 34,
            ease: "easeInOut",
            repeat: Infinity,
          }}
        >
          {/* Inner 1.12 scale guarantees the pan never reveals an edge */}
          <div className="absolute inset-0 scale-[1.12]">
            <OptimizedImage
              src={t.image}
              alt={t.imageAlt}
              priority
              sizes="100vw"
              className="object-center"
            />
          </div>
        </motion.div>
      </motion.div>

      {/* Cinematic grade */}
      <div className="absolute inset-0 bg-gradient-to-t from-forest-950/80 via-forest-950/10 to-forest-950/45" />
      <div className="absolute inset-0 [background:radial-gradient(130%_95%_at_50%_44%,rgba(18,42,31,0.08)_0%,rgba(18,42,31,0.02)_42%,rgba(10,28,20,0.55)_100%)]" />

      {/* Vertical location meta */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 1 }}
        className="absolute left-8 top-1/2 hidden -translate-y-1/2 [writing-mode:vertical-rl] rotate-180 text-[10px] font-medium uppercase tracking-[0.4em] text-ivory/55 xl:block"
      >
        {t.metaLeft}
      </motion.p>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 1 }}
        className="absolute right-8 top-1/2 hidden -translate-y-1/2 [writing-mode:vertical-rl] text-[10px] font-medium uppercase tracking-[0.4em] text-ivory/55 xl:block"
      >
        {t.metaRight}
      </motion.p>

      {/* Centre editorial block */}
      <motion.div
        style={{ y: textY, opacity }}
        className="absolute inset-0 z-10 flex flex-col items-center justify-center px-6 pt-16 text-center"
      >
        <motion.span
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.45, ease: EASE }}
          className="inline-flex items-center gap-2.5 rounded-full border border-ivory/30 bg-forest-950/25 px-4 py-2 backdrop-blur-md"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-gold" />
          <span className="text-[9px] font-semibold uppercase tracking-[0.3em] text-ivory sm:text-[10px]">
            {t.badge}
          </span>
        </motion.span>

        <h1 className="mt-5 font-display font-extrabold uppercase leading-[0.95] tracking-[-0.02em] text-ivory [font-size:clamp(2.3rem,min(10vw,11.5svh),7.5rem)] md:mt-7">
          <span className="block overflow-hidden">
            <motion.span variants={line} initial="hidden" animate="show" className="block drop-shadow-[0_2px_30px_rgba(8,26,18,0.45)]">
              {t.line1}
            </motion.span>
          </span>
          <span className="block overflow-hidden">
            <motion.span
              variants={lineDelayed}
              initial="hidden"
              animate="show"
              className="block drop-shadow-[0_2px_30px_rgba(8,26,18,0.45)]"
            >
              <span className="font-serif font-medium italic normal-case tracking-tight text-gold-light">
                {t.line2}
              </span>
            </motion.span>
          </span>
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 1, ease: EASE }}
          className="mt-5 max-w-md text-[13px] leading-relaxed text-ivory/85 md:mt-6 md:text-[15px]"
        >
          {t.subtitle}
        </motion.p>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.15 }}
          className="mt-5 hidden items-center gap-3 text-[10px] font-medium uppercase tracking-[0.32em] text-ivory/60 md:flex"
        >
          {t.tags.map((tag, i) => (
            <span key={tag} className="contents">
              {i > 0 && <span className="h-1 w-1 rounded-full bg-gold" />}
              {tag}
            </span>
          ))}
        </motion.p>
      </motion.div>

      {/* Bottom CTA row */}
      <motion.div
        style={{ opacity }}
        className="absolute inset-x-0 bottom-0 z-10 flex flex-col items-center gap-5 px-6 pb-7 sm:px-10 md:flex-row md:justify-between md:pb-9"
      >
        <motion.p
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.9, delay: 1.25, ease: EASE }}
          className="order-2 text-center text-[10px] uppercase tracking-[0.3em] text-ivory/60 md:order-1 md:text-left"
        >
          {t.wordmark.split("\n").map((line2, i) => (
            <span key={i}>
              {line2}
              {i === 0 && <br className="hidden md:block" />}
            </span>
          ))}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 1.2, ease: EASE }}
          className="order-1 flex flex-wrap items-center justify-center gap-3"
        >
          <a
            href={t.ctaPrimaryHref}
            className="group inline-flex items-center gap-3 rounded-full bg-ivory py-2 pl-6 pr-2 text-[13px] font-semibold tracking-wide text-forest-950 shadow-pill transition-colors duration-300 hover:bg-gold"
          >
            {t.ctaPrimaryLabel}
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-forest-900 text-ivory transition-transform duration-500 group-hover:rotate-45">
              →
            </span>
          </a>
          <a
            href={t.ctaSecondaryHref}
            className="inline-flex items-center rounded-full border border-ivory/35 bg-ivory/10 px-6 py-4 text-[13px] font-semibold tracking-wide text-ivory backdrop-blur-md transition-colors duration-300 hover:bg-ivory/20"
          >
            {t.ctaSecondaryLabel}
          </a>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.9, delay: 1.35, ease: EASE }}
          className="order-3 hidden items-center gap-3 md:flex"
        >
          <span className="text-[10px] uppercase tracking-[0.3em] text-ivory/60">
            Scroll
          </span>
          <span className="block h-px w-12 overflow-hidden bg-ivory/25">
            <span className="block h-full w-4 animate-scroll-dot bg-ivory" />
          </span>
        </motion.div>
      </motion.div>
    </section>
  );
}
