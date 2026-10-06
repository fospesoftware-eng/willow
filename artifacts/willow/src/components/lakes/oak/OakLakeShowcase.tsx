"use client";

import Link from "@/lib/next/link";
import { motion } from "framer-motion";
import { Reveal } from "@/components/ui/Reveal";
import { OptimizedImage } from "@/components/ui/OptimizedImage";
import type { Lake } from "@/data/site";

/* ---------------------------------- data --------------------------------- */

const CATCHES = [
  {
    src: "/images/carp-800.jpg",
    name: "Specimen Carp",
    latin: "Cyprinus carpio",
    weight: "30lb",
    blurb:
      "Common, Leather and Mirror carp — heavy, old, careful fish for the patient angler.",
    badge: "Common · Leather · Mirror",
  },
  {
    src: "/images/pike-800.jpg",
    name: "Predator Pike",
    latin: "Esox lucius",
    weight: "28lb",
    blurb:
      "Big freshwater predators patrolling the reed margins — dead-bait and lure water.",
    badge: "Pike",
  },
];

const SPECIES = ["Common carp", "Leather carp", "Mirror carp", "Pike"];

const OTHER = [
  {
    title: "Fishing",
    detail: "Specimen carp and predator angling on pegs 1–4 while remedial work continues.",
    icon: (
      <>
        <path d="M6.5 12c.94-3.46 4.94-6 8.5-6 3.56 0 6.06 2.54 7 6-.94 3.47-3.44 6-7 6s-7.56-2.53-8.5-6Z" />
        <path d="M18 12v.5" />
        <path d="M7 10.67C7 8 5.58 5.97 2.73 5.5c-1 1.53-1 5.53 0 7.1 1.65.56 4.27-.33 4.27-1.93Z" />
      </>
    ),
  },
  {
    title: "Plunge Pool",
    detail: "Cold-water dipping at Pine Lake, a short walk along the site paths.",
    icon: (
      <>
        <path d="M2 6c.6.5 1.2 1 2.5 1C7 7 7 5 9.5 5c2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1" />
        <path d="M2 12c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1" />
        <path d="M2 18c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1" />
      </>
    ),
  },
  {
    title: "Workshops & Events",
    detail: "Coaching days, volunteer sessions and Geo-dome hire across the park.",
    icon: (
      <>
        <rect x="3" y="4.5" width="18" height="16" rx="2.5" />
        <path d="M3 9.5h18M8 2.5v4M16 2.5v4" />
        <path d="m11.5 15.2.85-1.85 1.85-.85-1.85-.85-.85-1.85-.85 1.85-1.85.85 1.85.85Z" />
      </>
    ),
  },
  {
    title: "Walking Trails Nearby",
    detail: "Quiet meadow and woodland trails winding through six secluded acres.",
    icon: (
      <>
        <circle cx="6" cy="19" r="2.6" />
        <circle cx="18" cy="5" r="2.6" />
        <path d="M8.6 19H15a3.5 3.5 0 0 0 0-7H9a3.5 3.5 0 0 1 0-7h6.4" />
      </>
    ),
  },
];

const COLLAGE = [
  {
    src: "/images/site-walks.jpg",
    alt: "Aerial view of the three lakes and walking trails",
    label: "From above",
    sub: "Three lakes across six secluded acres",
    span: "sm:col-span-2",
    ratio: "aspect-[16/8.5]",
  },
  {
    src: "/images/match-home.jpg",
    alt: "Anglers lined up on a match day at Willow Garth",
    label: "Match days",
    sub: "Friendly club matches",
    span: "",
    ratio: "aspect-square",
  },
  {
    src: "/images/cold-swim.jpg",
    alt: "Wild swimmer in the plunge pool",
    label: "Cold-water dip",
    sub: "Pine Lake, a short walk",
    span: "",
    ratio: "aspect-square",
  },
  {
    src: "/images/fishing-coaching.jpg",
    alt: "Coach guiding a junior angler on the platform",
    label: "Coaching & juniors",
    sub: "Guided sessions on the bank",
    span: "sm:col-span-2",
    ratio: "aspect-[16/8]",
  },
];

const TIMELINE = [
  {
    phase: "Now",
    title: "Pegs 1–4 open",
    detail: "Specimen and predator fishing continues on the first four swims.",
    state: "open" as const,
  },
  {
    phase: "2026",
    title: "Remedial works",
    detail: "Banks, swims and habitat being restored across the rest of the lake.",
    state: "work" as const,
  },
  {
    phase: "November",
    title: "Full reopening",
    detail: "Every peg back online — we promise it will be worth the wait.",
    state: "soon" as const,
  },
];

const EASE = [0.16, 1, 0.3, 1] as const;

/* ------------------------------- component ------------------------------- */

export function OakLakeShowcase({ lake }: { lake: Lake }) {
  const bookingHref = lake.bookingUrl ?? "#";

  return (
    <>
      {/* ---------------------- 1 · Specimen catches --------------------- */}
      <section className="relative overflow-hidden bg-ivory py-24 md:py-36">
        <div className="mx-auto max-w-[1440px] px-5 md:px-10">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-10">
            {/* Editorial */}
            <div className="lg:col-span-5 lg:pt-4">
              <Reveal>
                <span className="inline-flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.32em] text-forest-600">
                  <span className="h-px w-8 bg-gold" />
                  The specimen water
                </span>
              </Reveal>
              <Reveal delay={0.08}>
                <h2 className="mt-6 font-display text-4xl font-extrabold uppercase leading-[1.02] tracking-[-0.02em] text-forest-900 md:text-6xl">
                  Carp &amp;
                  <span className="block font-serif font-medium normal-case italic text-forest-600">
                    predator lake.
                  </span>
                </h2>
              </Reveal>
              <Reveal delay={0.14}>
                <p className="mt-5 font-serif text-lg italic text-earth-600 md:text-xl">
                  Specimen carp up to 30lb &amp; pike up to 28lb
                </p>
              </Reveal>
              <Reveal delay={0.2}>
                <p className="mt-6 max-w-md text-[15px] leading-relaxed text-forest-700/80">
                  {lake.description}
                </p>
              </Reveal>

              <Reveal delay={0.26}>
                <ul className="mt-8 flex flex-wrap gap-2">
                  {SPECIES.map((s) => (
                    <li
                      key={s}
                      className="inline-flex items-center gap-2 rounded-full border border-forest-900/12 bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.1em] text-forest-800 shadow-card"
                    >
                      <MiniFish />
                      {s}
                    </li>
                  ))}
                </ul>
              </Reveal>

              <Reveal delay={0.32}>
                <dl className="mt-10 grid grid-cols-3 gap-4">
                  <CatchStat value="30lb" label="Top carp" />
                  <CatchStat value="28lb" label="Top pike" />
                  <CatchStat value="04" label="Pegs open" />
                </dl>
              </Reveal>
            </div>

            {/* Two tall catch portraits */}
            <div className="lg:col-span-7">
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6">
                {CATCHES.map((fish, i) => (
                  <Reveal key={fish.src} delay={0.1 + i * 0.12}>
                    <motion.figure
                      whileHover={{ y: -6 }}
                      transition={{ duration: 0.7, ease: EASE }}
                      className="group relative aspect-[3/4.1] overflow-hidden rounded-[1.75rem] shadow-soft"
                    >
                      <motion.div
                        className="absolute inset-0"
                        whileHover={{ scale: 1.06 }}
                        transition={{ duration: 1.2, ease: EASE }}
                      >
                        <OptimizedImage
                          src={fish.src}
                          alt={`${fish.name} caught at Oak Lake, Willow Garth Country Park`}
                          sizes="(max-width: 640px) 92vw, (max-width: 1024px) 46vw, 420px"
                        />
                      </motion.div>
                      <div className="absolute inset-0 bg-gradient-to-t from-forest-950/90 via-forest-950/10 to-forest-950/25" />

                      {/* Weight medallion */}
                      <div className="absolute right-5 top-5 flex h-20 w-20 flex-col items-center justify-center rounded-full border border-gold/60 bg-forest-950/55 text-center backdrop-blur-md md:h-24 md:w-24">
                        <span className="font-display text-2xl font-extrabold leading-none text-gold-light md:text-3xl">
                          {fish.weight}
                        </span>
                        <span className="mt-1 text-[8px] font-bold uppercase tracking-[0.24em] text-sage-200">
                          specimen
                        </span>
                      </div>

                      <figcaption className="absolute inset-x-0 bottom-0 p-6">
                        <span className="text-[10px] font-bold uppercase tracking-[0.28em] text-gold-light">
                          {fish.badge}
                        </span>
                        <h3 className="mt-2 font-display text-2xl font-bold uppercase leading-tight text-ivory">
                          {fish.name}
                        </h3>
                        <p className="font-serif text-xs italic text-sage-200">
                          {fish.latin}
                        </p>
                        <p className="mt-3 max-w-xs text-[12px] leading-relaxed text-sage-200/90">
                          {fish.blurb}
                        </p>
                      </figcaption>
                    </motion.figure>
                  </Reveal>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --------------------- 2 · Swimbooker band ---------------------- */}
      <section className="relative overflow-hidden bg-forest-950 py-24 md:py-32">
        <div className="grain pointer-events-none absolute inset-0" />
        <div
          className="pointer-events-none absolute -bottom-40 right-0 h-[440px] w-[760px] rounded-full bg-gold/10 blur-[140px]"
          aria-hidden
        />
        <div className="relative mx-auto max-w-[1440px] px-5 md:px-10">
          <div className="flex flex-col items-start justify-between gap-10 lg:flex-row lg:items-center">
            <div className="max-w-2xl">
              <Reveal>
                <span className="inline-flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.32em] text-sage-300">
                  <span className="h-px w-8 bg-gold" />
                  Make a booking
                </span>
              </Reveal>
              <Reveal delay={0.08}>
                <h2 className="mt-6 font-display text-4xl font-extrabold uppercase leading-[1.02] tracking-[-0.02em] text-ivory md:text-6xl">
                  Fish Oak
                  <span className="block font-serif font-medium normal-case italic text-gold-light">
                    while the work finishes.
                  </span>
                </h2>
              </Reveal>
              <Reveal delay={0.16}>
                <p className="mt-6 max-w-lg text-[15px] leading-relaxed text-sage-300">
                  Oak is currently in remedial work, so only pegs 1 to 4 are
                  available through Swimbooker. The full lake reopens in
                  November 2026 — the banks, swims and fish will all be the
                  better for the wait.
                </p>
              </Reveal>
            </div>

            <Reveal delay={0.2}>
              <div className="w-full max-w-sm rounded-[1.75rem] border border-ivory/12 bg-ivory/[0.04] p-8 backdrop-blur-sm">
                <div className="flex items-center gap-3">
                  <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[#1e5fa8] text-white">
                    <SwimbookerFish />
                  </span>
                  <div>
                    <p className="font-display text-xl font-bold text-ivory">
                      Swimbooker
                    </p>
                    <p className="text-[10px] uppercase tracking-[0.22em] text-sage-300">
                      Pegs 1–4 · live availability
                    </p>
                  </div>
                </div>
                <div className="my-6 h-px bg-ivory/10" />
                <ul className="space-y-2.5 text-[13px] text-sage-300">
                  {[
                    "Instant peg reservation",
                    "Secure card payment",
                    "Day & night sessions",
                  ].map((f) => (
                    <li key={f} className="flex items-center gap-3">
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-gold/20 text-gold-light">
                        ✓
                      </span>
                      {f}
                    </li>
                  ))}
                </ul>
                <a
                  href={bookingHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group mt-7 flex w-full items-center justify-between gap-3 rounded-full bg-ivory px-6 py-4 text-[12px] font-bold uppercase tracking-[0.14em] text-forest-950 transition-colors hover:bg-gold"
                >
                  Book pegs 1–4
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-forest-900 text-ivory transition-transform duration-500 group-hover:rotate-45">
                    →
                  </span>
                </a>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* -------------------- 3 · Get Active / works -------------------- */}
      <section className="relative overflow-hidden bg-cream py-24 md:py-36">
        <div className="mx-auto max-w-[1440px] px-5 md:px-10">
          <div className="grid grid-cols-1 items-center gap-14 lg:grid-cols-2 lg:gap-20">
            {/* Photo */}
            <Reveal className="order-2 lg:order-1">
              <div className="relative">
            <motion.figure
              whileHover={{ scale: 1.015 }}
              transition={{ duration: 0.9, ease: EASE }}
              className="relative aspect-[4/5] overflow-hidden rounded-[2rem] shadow-soft md:aspect-[5/5.4]"
            >
              <OptimizedImage
                src="/images/carp-night.jpg"
                alt="A night-caught common carp held by an Oak Lake angler"
                sizes="(max-width: 1024px) 92vw, 46vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-forest-950/70 via-transparent to-forest-950/15" />
              <figcaption className="absolute bottom-6 left-6 right-6">
                <p className="font-display text-2xl font-bold uppercase text-ivory">
                  Night sessions
                </p>
                <p className="text-[12px] text-sage-200">
                  The Oak carp feed after dark — and they feed well.
                </p>
              </figcaption>
            </motion.figure>
                <div className="absolute -right-3 -top-5 rotate-3 rounded-2xl border border-gold/40 bg-ivory px-6 py-4 shadow-card sm:-right-8">
                  <p className="font-serif text-base italic text-earth-600">
                    &ldquo;It will be worth the wait.&rdquo;
                  </p>
                </div>
              </div>
            </Reveal>

            {/* Copy + timeline */}
            <div className="order-1 lg:order-2">
              <Reveal>
                <span className="inline-flex items-center gap-3 rounded-full border border-gold/40 bg-gold/[0.08] px-4 py-2 text-[10px] font-bold uppercase tracking-[0.26em] text-earth-700">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-gold opacity-60" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-gold" />
                  </span>
                  Remedial works in progress
                </span>
              </Reveal>
              <Reveal delay={0.08}>
                <h2 className="mt-6 font-display text-4xl font-extrabold uppercase leading-[1.02] tracking-[-0.02em] text-forest-900 md:text-6xl">
                  Get
                  <span className="block font-serif font-medium normal-case italic text-forest-600">
                    active.
                  </span>
                </h2>
              </Reveal>
              <Reveal delay={0.14}>
                <p className="mt-6 max-w-md text-[15px] leading-relaxed text-forest-700/80">
                  Currently in the process of remedial work, so we can only
                  offer pegs 1 to 4. Work will be completed by Autumn 2026. We
                  promise it will be worth the wait.
                </p>
              </Reveal>

              <ol className="mt-10 space-y-0">
                {TIMELINE.map((step, i) => (
                  <Reveal key={step.title} delay={0.18 + i * 0.08}>
                    <li className="relative flex gap-5 pb-8 last:pb-0">
                      {i < TIMELINE.length - 1 && (
                        <span className="absolute left-[19px] top-11 h-[calc(100%-2.2rem)] w-px bg-forest-900/15" />
                      )}
                      <span
                        className={`relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border text-[10px] font-bold uppercase ${
                          step.state === "open"
                            ? "border-gold bg-gold text-forest-950"
                            : step.state === "work"
                            ? "border-earth-500/50 bg-cream text-earth-600"
                            : "border-forest-900 bg-forest-900 text-ivory"
                        }`}
                      >
                        {step.state === "open" ? "✓" : i + 1}
                      </span>
                      <div className="pt-1">
                        <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-forest-600">
                          {step.phase}
                        </p>
                        <p className="mt-1 font-display text-lg font-bold uppercase tracking-tight text-forest-900">
                          {step.title}
                        </p>
                        <p className="mt-1 text-[13px] leading-snug text-forest-700/70">
                          {step.detail}
                        </p>
                      </div>
                    </li>
                  </Reveal>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </section>

      {/* ----------------------- 4 · Other info ------------------------- */}
      <section className="relative overflow-hidden bg-ivory py-24 md:py-36">
        <div className="mx-auto max-w-[1440px] px-5 md:px-10">
          <div className="grid grid-cols-1 items-center gap-14 lg:grid-cols-2 lg:gap-20">
            <div>
              <Reveal>
                <span className="inline-flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.32em] text-forest-600">
                  <span className="h-px w-8 bg-gold" />
                  Around the park
                </span>
              </Reveal>
              <Reveal delay={0.08}>
                <h2 className="mt-6 font-display text-4xl font-extrabold uppercase leading-[1.02] tracking-[-0.02em] text-forest-900 md:text-6xl">
                  Other
                  <span className="block font-serif font-medium normal-case italic text-forest-600">
                    info.
                  </span>
                </h2>
              </Reveal>

              <ul className="mt-12 grid grid-cols-1 gap-3 sm:grid-cols-2">
                {OTHER.map((item, i) => (
                  <Reveal key={item.title} delay={0.1 + i * 0.08}>
                    <li className="group flex h-full items-start gap-4 rounded-[1.25rem] border border-transparent p-4 transition-all duration-500 hover:border-forest-900/10 hover:bg-white hover:shadow-card">
                      <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-gold/45 text-earth-600 transition-all duration-500 group-hover:border-gold group-hover:bg-gold group-hover:text-forest-950">
                        <svg
                          width="22"
                          height="22"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.6"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          {item.icon}
                        </svg>
                      </span>
                      <div className="min-w-0">
                        <p className="font-display text-base font-bold uppercase tracking-tight text-forest-900">
                          {item.title}
                        </p>
                        <p className="mt-0.5 text-[12px] leading-snug text-forest-700/70">
                          {item.detail}
                        </p>
                      </div>
                    </li>
                  </Reveal>
                ))}
              </ul>

              <Reveal delay={0.3}>
                <Link
                  href="/lakes"
                  className="group mt-10 inline-flex items-center gap-3 rounded-full bg-forest-900 py-2 pl-6 pr-2 text-[12px] font-bold uppercase tracking-[0.14em] text-ivory transition-colors hover:bg-forest-700"
                >
                  Compare all lakes
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-ivory/15 transition-transform duration-500 group-hover:rotate-45">
                    →
                  </span>
                </Link>
              </Reveal>
            </div>

            <Reveal delay={0.15}>
              <div className="relative">
                <div
                  aria-hidden
                  className="absolute -bottom-5 -left-5 right-10 top-10 rounded-[2.25rem] bg-forest-900/[0.05]"
                />
                <div
                  aria-hidden
                  className="absolute -right-5 -top-7 h-32 w-32 rounded-full bg-gold/10 blur-3xl"
                />
                <div className="relative rounded-[2rem] border border-forest-900/10 bg-white p-3 shadow-soft sm:p-4">
                  <div className="grid grid-cols-2 gap-3 sm:gap-4">
                    {COLLAGE.map((c) => (
                      <motion.figure
                        key={c.src}
                        whileHover={{ y: -4 }}
                        transition={{ duration: 0.7, ease: EASE }}
                        className={`group relative overflow-hidden rounded-[1.35rem] ${c.span} ${c.ratio}`}
                      >
                        <motion.div
                          className="absolute inset-0"
                          whileHover={{ scale: 1.06 }}
                          transition={{ duration: 1.1, ease: EASE }}
                        >
                          <OptimizedImage
                            src={c.src}
                            alt={c.alt}
                            sizes="(max-width: 640px) 92vw, 42vw"
                          />
                        </motion.div>
                        <div className="absolute inset-0 bg-gradient-to-t from-forest-950/75 via-forest-950/[0.06] to-transparent" />
                        <figcaption className="absolute inset-x-0 bottom-0 p-4">
                          <span className="block text-[9px] font-bold uppercase tracking-[0.26em] text-gold-light">
                            {c.label}
                          </span>
                          <span className="mt-0.5 block text-[11px] leading-tight text-sage-200">
                            {c.sub}
                          </span>
                        </figcaption>
                      </motion.figure>
                    ))}
                  </div>
                </div>
                <span className="absolute -right-2 -top-5 z-20 flex h-[4.5rem] w-[4.5rem] rotate-6 flex-col items-center justify-center rounded-full bg-forest-950 text-center shadow-soft ring-1 ring-gold/40 md:-right-5">
                  <span className="font-display text-xl font-extrabold leading-none text-gold-light">
                    04
                  </span>
                  <span className="mt-0.5 text-[8px] font-bold uppercase tracking-[0.22em] text-sage-200">
                    pegs open
                  </span>
                </span>
              </div>
            </Reveal>
          </div>
        </div>
      </section>
    </>
  );
}

/* -------------------------------- pieces --------------------------------- */

function CatchStat({ value, label }: { value: string; label: string }) {
  return (
    <div className="rounded-2xl border border-forest-900/10 bg-white px-4 py-4 shadow-card">
      <p className="font-display text-2xl font-extrabold text-forest-900 md:text-3xl">
        {value}
      </p>
      <p className="mt-1 text-[9px] font-bold uppercase tracking-[0.18em] text-forest-600">
        {label}
      </p>
    </div>
  );
}

function MiniFish() {
  return (
    <svg
      width="13"
      height="13"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="text-earth-600"
    >
      <path d="M6.5 12c.94-3.46 4.94-6 8.5-6 3.56 0 6.06 2.54 7 6-.94 3.47-3.44 6-7 6s-7.56-2.53-8.5-6Z" />
      <path d="M18 12v.5" />
      <path d="M7 10.67C7 8 5.58 5.97 2.73 5.5c-1 1.53-1 5.53 0 7.1 1.65.56 4.27-.33 4.27-1.93Z" />
    </svg>
  );
}

function SwimbookerFish() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M6.5 12c.94-3.46 4.94-6 8.5-6 3.56 0 6.06 2.54 7 6-.94 3.47-3.44 6-7 6s-7.56-2.53-8.5-6Z" />
      <path d="M18 12v.5" />
      <path d="M7 10.67C7 8 5.58 5.97 2.73 5.5c-1 1.53-1 5.53 0 7.1 1.65.56 4.27-.33 4.27-1.93Z" />
    </svg>
  );
}
