"use client";

import { motion } from "framer-motion";
import { lakes, type Lake } from "@/data/site";
import { Reveal } from "@/components/ui/Reveal";
import { OptimizedImage } from "@/components/ui/OptimizedImage";

export function LakesShowcase({ items }: { items?: Lake[] }) {
  const list = items ?? lakes;
  return (
    <section className="relative bg-ivory py-20 md:py-32">
      <div className="mx-auto max-w-[1440px] px-5 md:px-10">
        <div className="mb-14 md:mb-20 max-w-3xl">
          <Reveal>
            <span className="inline-flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.32em] text-forest-600 mb-6">
              <span className="h-px w-8 bg-gold" />
              The three lakes
            </span>
          </Reveal>
          <Reveal delay={0.1}>
            <h2 className="font-display font-extrabold text-forest-900 text-4xl md:text-7xl leading-[1.0] tracking-[-0.02em] uppercase">
              Three lakes.
              <br />
              <span className="font-serif font-medium italic normal-case text-forest-600">
                One escape.
              </span>
            </h2>
          </Reveal>
        </div>

        <div className="space-y-16 md:space-y-28">
          {list.map((lake, idx) => (
            <LakeRow key={lake.slug} lake={lake} reverse={idx % 2 === 1} />
          ))}
        </div>
      </div>
    </section>
  );
}

function LakeRow({
  lake,
  reverse,
}: {
  lake: (typeof lakes)[number];
  reverse: boolean;
}) {
  return (
    <article
      id={lake.slug}
      className={`grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center ${
        reverse ? "lg:[&>*:first-child]:order-2" : ""
      }`}
    >
      {/* Image panel */}
      <div className="lg:col-span-7">
        <Reveal>
          <div className="group relative rounded-[2rem] md:rounded-[2.5rem] overflow-hidden shadow-soft">
            <motion.div
              className="aspect-[16/11] w-full"
              whileHover={{ scale: 1.04 }}
              transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            >
              <OptimizedImage
                src={lake.image}
                alt={`${lake.name} — ${lake.tagline}`}
                sizes="(max-width: 1024px) 100vw, 58vw"
              />
            </motion.div>
            <div className="absolute inset-0 bg-gradient-to-t from-forest-950/25 to-transparent" />

            {/* Number badge */}
            <div className="absolute top-6 left-6 md:top-9 md:left-9 flex items-center gap-3">
              <span className="font-display font-extrabold text-5xl md:text-7xl text-ivory drop-shadow-lg tracking-tight">
                {lake.number}
              </span>
            </div>

            {lake.status === "renovation" && (
              <div className="absolute top-6 right-6 md:top-9 md:right-9 inline-flex items-center gap-2 rounded-full bg-gold px-4 py-2 text-[10px] font-bold uppercase tracking-[0.18em] text-forest-950">
                <span className="w-1.5 h-1.5 rounded-full bg-forest-950 animate-pulse" />
                Under renovation
              </div>
            )}
          </div>
        </Reveal>
      </div>

      {/* Content */}
      <div className="lg:col-span-5">
        <Reveal>
          <span className="inline-flex items-center gap-2 rounded-full bg-forest-900/5 px-4 py-1.5 text-[10px] font-bold uppercase tracking-[0.22em] text-forest-600">
            {lake.category}
          </span>
        </Reveal>
        <Reveal delay={0.1}>
          <h3 className="mt-5 font-display font-extrabold text-forest-900 text-4xl md:text-5xl leading-[1.02] tracking-[-0.02em]">
            {lake.name}
          </h3>
        </Reveal>
        <Reveal delay={0.15}>
          <p className="mt-2 font-serif italic text-lg text-forest-600">
            {lake.tagline}
          </p>
        </Reveal>
        <Reveal delay={0.2}>
          <p className="mt-6 text-forest-700/80 leading-relaxed">
            {lake.description}
          </p>
        </Reveal>

        {lake.species && (
          <Reveal delay={0.25}>
            <div className="mt-7">
              <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-forest-600 mb-3">
                Species
              </p>
              <div className="flex flex-wrap gap-2">
                {lake.species.map((s) => (
                  <span
                    key={s}
                    className="rounded-full px-3.5 py-1.5 text-xs font-medium border border-forest-900/12 text-forest-700"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>
          </Reveal>
        )}

        <Reveal delay={0.3}>
          <ul className="mt-7 space-y-2.5">
            {lake.features.map((f) => (
              <li
                key={f}
                className="flex items-start gap-3 text-sm text-forest-700"
              >
                <span className="mt-[7px] block h-1.5 w-1.5 rounded-full bg-gold shrink-0" />
                {f}
              </li>
            ))}
          </ul>
        </Reveal>

        {lake.statusNote && (
          <Reveal delay={0.35}>
            <div className="mt-7 rounded-2xl p-5 bg-gold/10 border border-gold/30">
              <p className="text-sm text-earth-700 font-medium">
                {lake.statusNote}
              </p>
            </div>
          </Reveal>
        )}

        <Reveal delay={0.4}>
          <div className="mt-9 flex flex-wrap gap-3">
            <a
              href={`/lakes/${lake.slug}`}
              className="group inline-flex items-center gap-3 rounded-full bg-forest-900 text-ivory pl-6 pr-2 py-2 text-[12px] font-bold uppercase tracking-[0.12em] hover:bg-forest-700 transition-colors duration-300"
            >
              Discover {lake.name.split(" ")[0]}
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-ivory/15 group-hover:bg-gold group-hover:text-forest-950 transition-colors duration-300">
                →
              </span>
            </a>
            {lake.bookingUrl && (
              <a
                href={lake.bookingUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center rounded-full border border-forest-900/20 px-6 py-3 text-[12px] font-bold uppercase tracking-[0.12em] text-forest-900 hover:bg-forest-900 hover:text-ivory transition-colors duration-300"
              >
                {lake.bookingLabel}
              </a>
            )}
          </div>
        </Reveal>
      </div>
    </article>
  );
}
