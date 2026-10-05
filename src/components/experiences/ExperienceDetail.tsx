"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Reveal } from "@/components/ui/Reveal";
import { OptimizedImage } from "@/components/ui/OptimizedImage";
import { CTASection } from "@/components/home/CTASection";
import type { Experience } from "@/data/site";
import { experiences } from "@/data/site";

const EASE = [0.16, 1, 0.3, 1] as const;

function BookingLink({
  experience,
  variant = "solid",
}: {
  experience: Experience;
  variant?: "solid" | "ghost";
}) {
  if (!experience.bookingUrl || !experience.bookingLabel) return null;
  const external = experience.bookingExternal ?? experience.bookingUrl.startsWith("http");
  const solid =
    "group inline-flex items-center gap-3 rounded-full bg-ivory py-2.5 pl-6 pr-2 text-[13px] font-semibold tracking-wide text-forest-950 shadow-pill hover:bg-gold transition-colors duration-300";
  const ghost =
    "inline-flex items-center rounded-full border border-ivory/35 bg-ivory/10 px-6 py-4 text-[13px] font-semibold tracking-wide text-ivory backdrop-blur-md hover:bg-ivory/20 transition-colors duration-300";
  const inner = (
    <>
      {experience.bookingLabel}
      {variant === "solid" && (
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-forest-900 text-ivory transition-transform duration-500 group-hover:rotate-45">
          →
        </span>
      )}
    </>
  );
  return external ? (
    <a
      href={experience.bookingUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={variant === "solid" ? solid : ghost}
    >
      {inner}
    </a>
  ) : (
    <Link href={experience.bookingUrl} className={variant === "solid" ? solid : ghost}>
      {inner}
    </Link>
  );
}

export function ExperienceDetail({ experience }: { experience: Experience }) {
  const others = experiences.filter(
    (e) => e.slug !== experience.slug && e.slug !== "events"
  );
  const index = experiences.findIndex((e) => e.slug === experience.slug) + 1;

  return (
    <>
      {/* ---------- Cinematic experience hero ---------- */}
      <section className="relative flex min-h-[72vh] items-end overflow-hidden">
        <motion.div
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.8, ease: EASE }}
          className="absolute inset-0"
        >
          <OptimizedImage
            src={experience.image}
            alt={`${experience.name} at Willow Garth Country Park`}
            priority
            sizes="100vw"
          />
        </motion.div>
        <div className="absolute inset-0 bg-gradient-to-t from-forest-950 via-forest-950/40 to-forest-950/25" />

        {/* Giant ghost index */}
        <span className="pointer-events-none absolute right-4 top-28 hidden select-none font-display text-[16rem] font-extrabold leading-none text-ivory/[0.07] md:block lg:text-[22rem]">
          {String(index).padStart(2, "0")}
        </span>

        <div className="relative z-10 mx-auto w-full max-w-[1440px] px-5 pb-14 pt-36 md:px-10 md:pb-20">
          <Reveal>
            <Link
              href="/experiences"
              className="mb-8 inline-flex items-center gap-2 rounded-full border border-ivory/25 bg-ivory/10 px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.22em] text-ivory/80 backdrop-blur-md transition-colors hover:bg-ivory/20"
            >
              ← All experiences
            </Link>
          </Reveal>
          <Reveal delay={0.08}>
            <span className="inline-flex items-center gap-2.5 rounded-full border border-ivory/30 bg-forest-950/25 px-4 py-2 backdrop-blur-md">
              <span className="h-1.5 w-1.5 rounded-full bg-gold" />
              <span className="text-[10px] font-semibold uppercase tracking-[0.28em] text-ivory">
                {experience.category}
              </span>
            </span>
          </Reveal>
          <Reveal delay={0.16}>
            <h1 className="mt-6 max-w-4xl font-display font-extrabold uppercase leading-[0.94] tracking-[-0.02em] text-ivory [font-size:clamp(2.8rem,7vw,6.5rem)]">
              {experience.name}{" "}
              <span className="font-serif font-medium italic normal-case tracking-tight text-gold-light">
                {experience.accent}
              </span>
            </h1>
          </Reveal>
          <Reveal delay={0.24}>
            <p className="mt-6 max-w-2xl text-base leading-relaxed text-sage-200 md:text-xl">
              {experience.description}
            </p>
          </Reveal>
          <Reveal delay={0.32}>
            <div className="mt-9 flex flex-wrap items-center gap-3">
              {experience.inHouseHref && experience.inHouseLabel && (
                <Link
                  href={experience.inHouseHref}
                  className="group inline-flex items-center gap-3 rounded-full bg-gold py-2.5 pl-6 pr-2 text-[13px] font-semibold tracking-wide text-forest-950 shadow-pill hover:bg-gold-light transition-colors duration-300"
                >
                  {experience.inHouseLabel}
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-forest-950 text-ivory transition-transform duration-500 group-hover:rotate-45">
                    →
                  </span>
                </Link>
              )}
              {experience.bookingUrl && <BookingLink experience={experience} variant="ghost" />}
              <Link
                href="/contact"
                className="inline-flex items-center rounded-full border border-ivory/35 bg-ivory/10 px-6 py-4 text-[13px] font-semibold tracking-wide text-ivory backdrop-blur-md transition-colors duration-300 hover:bg-ivory/20"
              >
                Ask a Question
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ---------- Intro + note ---------- */}
      <section className="bg-ivory py-20 md:py-28">
        <div className="mx-auto grid max-w-[1440px] grid-cols-1 gap-12 px-5 md:px-10 lg:grid-cols-[0.35fr_0.65fr] lg:gap-20">
          <div>
            <Reveal>
              <div className="flex items-center gap-4">
                <span className="block h-px w-10 bg-gold" />
                <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-forest-700">
                  The experience
                </span>
              </div>
            </Reveal>
            <Reveal delay={0.1}>
              <h2 className="mt-6 font-display text-3xl font-extrabold uppercase leading-[1] tracking-[-0.01em] text-forest-900 md:text-4xl">
                What to
                <br />
                <span className="font-serif font-medium italic normal-case text-gold">
                  expect.
                </span>
              </h2>
            </Reveal>
          </div>

          <div>
            {experience.intro.map((para, i) => (
              <Reveal key={i} delay={0.08 * i}>
                <p
                  className={`text-lg leading-relaxed text-forest-800/85 ${
                    i > 0 ? "mt-6" : ""
                  }`}
                >
                  {para}
                </p>
              </Reveal>
            ))}

            {experience.note && (
              <Reveal delay={0.2}>
                <div className="mt-10 rounded-[1.5rem] border border-gold/30 bg-cream/70 p-7 md:p-8">
                  <p className="flex gap-4 text-sm leading-relaxed text-forest-900">
                    <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gold text-xs font-bold text-forest-950">
                      !
                    </span>
                    {experience.note}
                  </p>
                </div>
              </Reveal>
            )}
          </div>
        </div>
      </section>

      {/* ---------- Highlights ---------- */}
      <section className="bg-cream py-20 md:py-28">
        <div className="mx-auto max-w-[1440px] px-5 md:px-10">
          <Reveal>
            <div className="mb-12 flex items-end justify-between gap-6 md:mb-16">
              <h2 className="font-display text-3xl font-extrabold uppercase leading-none tracking-[-0.01em] text-forest-900 md:text-5xl">
                Highlights
              </h2>
              <span className="hidden text-[10px] font-bold uppercase tracking-[0.3em] text-forest-700 md:block">
                {String(experience.highlights.length).padStart(2, "0")} details
              </span>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {experience.highlights.map((h, i) => (
              <Reveal key={h.title} delay={i * 0.08}>
                <div className="group flex h-full flex-col rounded-[1.5rem] bg-ivory p-7 transition-all duration-500 hover:-translate-y-1.5 hover:shadow-soft">
                  <span className="font-display text-sm font-extrabold text-gold">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="mt-5 font-display text-lg font-bold uppercase tracking-tight text-forest-900">
                    {h.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-forest-700/80">
                    {h.detail}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- Gallery mosaic ---------- */}
      <section className="bg-ivory py-20 md:py-28">
        <div className="mx-auto max-w-[1440px] px-5 md:px-10">
          <div className="grid grid-cols-2 grid-rows-2 gap-3 md:gap-5 [&>div:first-child]:row-span-2 [&>div:first-child]:h-auto">
            {experience.gallery.map((src, i) => (
              <Reveal key={src} delay={i * 0.1}>
                <div
                  className={`relative overflow-hidden rounded-[1.25rem] md:rounded-[1.75rem] ${
                    i === 0 ? "h-full min-h-[320px] md:min-h-[560px]" : "h-[155px] md:h-[270px]"
                  }`}
                >
                  <OptimizedImage
                    src={src}
                    alt=""
                    sizes={i === 0 ? "(max-width:1024px) 100vw, 700px" : "(max-width:1024px) 50vw, 460px"}
                  />
                  <div className="absolute inset-0 bg-forest-950/10 transition-colors duration-500 group-hover:bg-forest-950/0" />
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- Other experiences ---------- */}
      <section className="bg-forest-950 py-20 md:py-28">
        <div className="mx-auto max-w-[1440px] px-5 md:px-10">
          <Reveal>
            <div className="mb-12 flex items-end justify-between gap-6 md:mb-16">
              <h2 className="font-display text-3xl font-extrabold uppercase leading-none tracking-[-0.01em] text-ivory md:text-5xl">
                More to{" "}
                <span className="font-serif font-medium italic normal-case text-gold-light">
                  explore.
                </span>
              </h2>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {others.map((other, i) => (
              <Reveal key={other.slug} delay={i * 0.1}>
                <Link
                  href={other.slug === "events" ? "/events" : `/experiences/${other.slug}`}
                  className="group relative block h-[380px] overflow-hidden rounded-[1.75rem]"
                >
                  <OptimizedImage
                    src={other.image}
                    alt={other.name}
                    sizes="(max-width:768px) 100vw, 460px"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-forest-950/85 via-forest-950/20 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-6">
                    <p className="text-[9px] font-bold uppercase tracking-[0.26em] text-gold-light">
                      {other.category}
                    </p>
                    <div className="mt-2 flex items-center justify-between gap-3">
                      <h3 className="font-display text-2xl font-extrabold uppercase text-ivory">
                        {other.name}
                      </h3>
                      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-ivory text-forest-950 transition-transform duration-500 group-hover:rotate-45">
                        →
                      </span>
                    </div>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <CTASection />
    </>
  );
}
