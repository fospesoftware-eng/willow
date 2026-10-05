"use client";

import { motion } from "framer-motion";
import { CTAButton } from "@/components/ui/CTAButton";
import { Reveal } from "@/components/ui/Reveal";
import { OptimizedImage } from "@/components/ui/OptimizedImage";
import type { Lake } from "@/data/site";

export function LakeDetail({ lake }: { lake: Lake }) {
  return (
    <article className="bg-ivory">
      {/* Hero */}
      <section className="relative h-[70vh] min-h-[500px] flex items-end overflow-hidden">
        <motion.div
          initial={{ scale: 1.12 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.8, ease: [0.16, 1, 0.3, 1] }}
          className="absolute inset-0"
        >
          <OptimizedImage
            src={lake.image}
            alt={lake.name}
            priority
            sizes="100vw"
          />
        </motion.div>
        <div className="absolute inset-0 bg-gradient-to-t from-forest-950 via-forest-950/40 to-transparent" />
        <div className="relative z-10 mx-auto max-w-7xl w-full px-5 md:px-8 pb-16">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-[11px] uppercase tracking-[0.3em] text-sage-300 mb-4"
          >
            Lake {lake.number} · {lake.category}
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="font-display font-extrabold uppercase text-ivory text-6xl md:text-8xl leading-[0.9] tracking-[-0.02em]"
          >
            {lake.name}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="mt-4 text-sage-200 italic text-lg"
          >
            {lake.tagline}
          </motion.p>
        </div>
      </section>

      {/* Content */}
      <section className="py-24 md:py-32">
        <div className="mx-auto max-w-7xl px-5 md:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            <div className="lg:col-span-7">
              <Reveal>
                <p className="text-xl md:text-2xl leading-relaxed text-forest-800 font-serif">
                  {lake.description}
                </p>
              </Reveal>

              {lake.statusNote && (
                <Reveal delay={0.1}>
                  <div className="mt-10 p-6 bg-gold/10 border-l-4 border-gold">
                    <p className="text-sm uppercase tracking-[0.2em] text-earth-700 font-semibold mb-2">
                      Current status
                    </p>
                    <p className="text-forest-800">{lake.statusNote}</p>
                  </div>
                </Reveal>
              )}

              <Reveal delay={0.15}>
                <div className="mt-12">
                  <h2 className="text-[11px] uppercase tracking-[0.3em] text-forest-600 mb-6">
                    What you'll find
                  </h2>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {lake.features.map((f) => (
                      <li
                        key={f}
                        className="flex items-start gap-3 p-4 bg-cream/60 border border-forest-900/5"
                      >
                        <span className="mt-1.5 block h-1.5 w-1.5 bg-gold shrink-0" />
                        <span className="text-forest-800">{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>

              {lake.species && (
                <Reveal delay={0.2}>
                  <div className="mt-12">
                    <h2 className="text-[11px] uppercase tracking-[0.3em] text-forest-600 mb-6">
                      Species
                    </h2>
                    <div className="flex flex-wrap gap-3">
                      {lake.species.map((s) => (
                        <span
                          key={s}
                          className="px-4 py-2 text-sm border border-forest-900/15 text-forest-700 bg-ivory"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                </Reveal>
              )}

              <Reveal delay={0.25}>
                <div className="mt-12 flex flex-wrap gap-4">
                  {lake.bookingUrl && (
                    <CTAButton href={lake.bookingUrl} variant="primary" external>
                      {lake.bookingLabel}
                    </CTAButton>
                  )}
                  <CTAButton href="/book" variant="outline">
                    View All Experiences
                  </CTAButton>
                </div>
              </Reveal>
            </div>

            {/* Sidebar */}
            <aside className="lg:col-span-5">
              <Reveal delay={0.1}>
                <div className="sticky top-28 bg-forest-900 text-ivory p-8 md:p-10">
                  <p className="text-[11px] uppercase tracking-[0.3em] text-sage-400 mb-4">
                    Lake {lake.number}
                  </p>
                  <h3 className="font-serif text-3xl mb-6">{lake.name}</h3>
                  <p className="text-sage-200 text-sm leading-relaxed mb-8">
                    {lake.category}
                  </p>
                  <div className="border-t border-ivory/10 pt-6">
                    <p className="text-xs uppercase tracking-[0.2em] text-sage-400 mb-3">
                      Booking
                    </p>
                    <p className="text-sm text-sage-200 leading-relaxed">
                      {lake.status === "renovation"
                        ? "This lake is currently under renovation. Please check back or contact us for the latest updates."
                        : lake.bookingUrl
                        ? "Bookings are managed through our partner platform."
                        : "Contact us to arrange your visit."}
                    </p>
                  </div>
                  <a
                    href="tel:+447951138579"
                    className="block mt-6 text-sm text-gold hover:text-gold-light transition-colors"
                  >
                    Call +44 7951 138579
                  </a>
                </div>
              </Reveal>
            </aside>
          </div>
        </div>
      </section>
    </article>
  );
}
