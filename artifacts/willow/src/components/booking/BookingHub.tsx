"use client";

import Link from "@/lib/next/link";
import { motion } from "framer-motion";
import { contact } from "@/data/site";
import { Reveal } from "@/components/ui/Reveal";
import { CTAButton } from "@/components/ui/CTAButton";
import { OptimizedImage } from "@/components/ui/OptimizedImage";
import { defaultPages } from "@/lib/cms/defaults";

type BookingOption = {
  title: string;
  description: string;
  image: string;
  cta: string;
  href: string;
  note?: string;
  altHref?: string;
  altLabel?: string;
};
type BookingHubData = {
  eyebrow: string;
  title: string;
  accent: string;
  subtitle: string;
  options: BookingOption[];
};

const D = defaultPages.find((p) => p.slug === "book")!.content.hub as unknown as BookingHubData;

export function BookingHub({ c }: { c?: Partial<BookingHubData> }) {
  const t = { ...D, ...c, options: c?.options ?? D.options };
  const options = t.options;
  return (
    <section className="bg-ivory py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <div className="mb-16">
          <Reveal>
            <span className="inline-flex items-center gap-3 text-[11px] font-medium uppercase tracking-[0.32em] text-forest-600 mb-6">
              <span className="h-px w-8 bg-current" />
              {t.eyebrow}
            </span>
          </Reveal>
          <Reveal delay={0.1}>
            <h1 className="font-display font-extrabold uppercase text-forest-900 text-4xl md:text-6xl leading-[1] tracking-[-0.02em] max-w-3xl">
              {t.title}
              <br />
              <span className="font-serif font-medium italic normal-case text-forest-600">
                {t.accent}
              </span>
            </h1>
          </Reveal>
          <Reveal delay={0.2}>
            <p className="mt-6 text-forest-700/80 max-w-xl text-lg leading-relaxed">
              {t.subtitle}
            </p>
          </Reveal>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          {options.map((opt, i) => (
            <Reveal key={opt.title} delay={i * 0.08}>
              <div className="group relative h-full bg-cream rounded-[1.75rem] overflow-hidden border border-forest-900/5 shadow-card hover:shadow-soft transition-shadow duration-500">
                <div className="aspect-[16/9] overflow-hidden">
                  <motion.div
                    className="w-full h-full"
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <OptimizedImage
                      src={opt.image}
                      alt={opt.title}
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                  </motion.div>
                </div>
                <div className="p-8">
                  <h2 className="font-serif text-3xl text-forest-900">
                    {opt.title}
                  </h2>
                  <p className="mt-3 text-forest-700/80 leading-relaxed">
                    {opt.description}
                  </p>
                  {opt.note && (
                    <div className="mt-4 flex items-start justify-between gap-3 p-3 bg-gold/10 border-l-2 border-gold">
                      <p className="text-xs text-earth-700 font-medium">
                        {opt.note}
                      </p>
                      {opt.altHref && opt.altLabel && (
                        opt.altHref.startsWith("http") ? (
                          <a
                            href={opt.altHref}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="shrink-0 text-[11px] font-semibold uppercase tracking-wide text-forest-800 underline underline-offset-2 hover:text-forest-600"
                          >
                            {opt.altLabel}
                          </a>
                        ) : (
                          <Link
                            href={opt.altHref}
                            className="shrink-0 text-[11px] font-semibold uppercase tracking-wide text-forest-800 underline underline-offset-2 hover:text-forest-600"
                          >
                            {opt.altLabel}
                          </Link>
                        )
                      )}
                    </div>
                  )}
                  <div className="mt-6">
                    <CTAButton href={opt.href} variant="primary" external={opt.href.startsWith("http")}>
                      {opt.cta}
                    </CTAButton>
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        {/* Safety banner */}
        <Reveal>
          <div className="mt-16 p-8 md:p-10 bg-forest-900 text-ivory">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div>
                <h3 className="font-serif text-2xl mb-2">
                  Booking temporarily unavailable?
                </h3>
                <p className="text-sage-300 text-sm">
                  Please contact Willow Garth directly on{" "}
                  <a
                    href={contact.phoneHref}
                    className="text-gold hover:text-gold-light"
                  >
                    {contact.phone}
                  </a>{" "}
                  or via WhatsApp.
                </p>
              </div>
              <div className="flex gap-3">
                <a
                  href={contact.phoneHref}
                  className="inline-flex items-center gap-2 px-6 py-3 text-[12px] uppercase tracking-[0.18em] border border-ivory/30 text-ivory hover:bg-ivory hover:text-forest-900 transition-colors"
                >
                  Call
                </a>
                <a
                  href={contact.whatsappHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 text-[12px] uppercase tracking-[0.18em] bg-gold text-forest-950 hover:bg-gold-light transition-colors"
                >
                  WhatsApp
                </a>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
