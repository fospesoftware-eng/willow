"use client";

import Link from "@/lib/next/link";
import { motion } from "framer-motion";
import { experiences, type Experience } from "@/data/site";
import { Reveal } from "@/components/ui/Reveal";
import { OptimizedImage } from "@/components/ui/OptimizedImage";

export function Experiences({
  items,
  eyebrow = "What we offer",
  title = "An easy escape",
  accent = "by the water.",
  intro = "From the patience of angling to the clarity of cold water — four ways to spend your day at Willow Garth.",
  anchor = true,
  bg = "cream",
}: {
  items?: Experience[];
  eyebrow?: string;
  title?: string;
  accent?: string;
  intro?: string;
  anchor?: boolean;
  bg?: "cream" | "ivory";
}) {
  const list = items ?? experiences;
  return (
    <section
      id={anchor ? "experiences" : undefined}
      className={`relative ${bg === "ivory" ? "bg-ivory" : "bg-cream"} py-20 md:py-32`}
    >
      <div className="mx-auto max-w-[1440px] px-5 md:px-10">
        {/* Heading */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12 md:mb-16">
          <div>
            <Reveal>
              <span className="inline-flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.32em] text-forest-600 mb-6">
                <span className="h-px w-8 bg-gold" />
                {eyebrow}
              </span>
            </Reveal>
            <Reveal delay={0.1}>
              <h2 className="font-display font-extrabold text-forest-900 text-4xl md:text-6xl leading-[1.04] tracking-[-0.02em] uppercase">
                {title}
                <br />
                <span className="font-serif font-medium italic normal-case text-forest-600">
                  {accent}
                </span>
              </h2>
            </Reveal>
          </div>
          <Reveal delay={0.2}>
            <p className="text-forest-700/70 max-w-sm text-sm leading-relaxed md:text-right">
              {intro}
            </p>
          </Reveal>
        </div>

        {/* Card grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6">
          {list.map((exp, i) => (
            <Reveal key={exp.slug} delay={i * 0.08}>
              <ExperienceCard experience={exp} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function ExperienceCard({
  experience,
}: {
  experience: (typeof experiences)[number];
}) {
  const isExternal = experience.href.startsWith("http");
  const LinkTag: any = isExternal ? "a" : Link;
  const linkProps = isExternal
    ? { href: experience.href, target: "_blank", rel: "noopener noreferrer" }
    : { href: experience.href };

  return (
    <LinkTag
      {...linkProps}
      className="group relative block rounded-[1.5rem] overflow-hidden aspect-[3/4.2] shadow-card hover:shadow-soft transition-shadow duration-500"
    >
      <motion.div
        className="absolute inset-0"
        whileHover={{ scale: 1.06 }}
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
      >
        <OptimizedImage
          src={experience.image}
          alt={experience.name}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
        />
      </motion.div>
      <div className="absolute inset-0 bg-gradient-to-t from-forest-950/85 via-forest-950/10 to-forest-950/15" />

      {/* Top row: pin + category */}
      <div className="absolute top-4 inset-x-4 flex items-start justify-between gap-2">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-ivory/90 backdrop-blur px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-forest-900">
          <span className="w-1.5 h-1.5 rounded-full bg-gold" />
          {experience.category.split("·")[0]}
        </span>
        <span className="flex items-center justify-center w-8 h-8 rounded-full bg-ivory/20 backdrop-blur-md border border-ivory/30 text-ivory text-xs">
          ↑
        </span>
      </div>

      {/* Bottom content */}
      <div className="absolute inset-x-0 bottom-0 p-5">
        <h3 className="font-display font-bold text-ivory text-2xl tracking-tight">
          {experience.name}
        </h3>
        <p className="mt-2 text-sage-200 text-xs leading-relaxed line-clamp-2">
          {experience.description}
        </p>
        <span className="mt-4 inline-flex items-center gap-2 rounded-full bg-ivory text-forest-950 pl-4 pr-1.5 py-1.5 text-[11px] font-bold uppercase tracking-[0.1em] group-hover:bg-gold transition-colors duration-300">
          {isExternal ? "Book Now" : "Discover"}
          <span className="flex items-center justify-center w-7 h-7 rounded-full bg-forest-900 text-ivory">
            →
          </span>
        </span>
      </div>
    </LinkTag>
  );
}
