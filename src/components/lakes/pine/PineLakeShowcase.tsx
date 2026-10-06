"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Reveal } from "@/components/ui/Reveal";
import { OptimizedImage } from "@/components/ui/OptimizedImage";
import type { Lake } from "@/data/site";

/* ---------------------------------- data --------------------------------- */

const PASSES = [
  {
    name: "Single Visit",
    price: "£10",
    unit: "per person",
    note: "Sauna & plunge together",
    extra: "Plunge only — £5",
    featured: true,
  },
  {
    name: "Weekly Pass",
    price: "£20",
    unit: "per week",
    note: "Sauna & plunge, return all week",
    extra: "Best for regular dippers",
    featured: false,
  },
  {
    name: "Monthly Pass",
    price: "£60",
    unit: "per month",
    note: "Unlimited sauna & plunge access",
    extra: "The full cold-water routine",
    featured: false,
  },
];

const GALLERY = [
  {
    src: "/images/pine-sauna-jetty.webp",
    alt: "Wood-fired barrel sauna on a wooden jetty over a misty lake at sunrise",
    caption: "Wood-fired sauna · private jetty",
    span: "lg:col-span-7",
    ratio: "aspect-[16/10]",
  },
  {
    src: "/images/pine-sunset.webp",
    alt: "Pink and gold sunset reflected across Pine Lake with silhouetted trees",
    caption: "Golden hour on the dip lake",
    span: "lg:col-span-5",
    ratio: "aspect-[16/10]",
  },
  {
    src: "/images/pine-swim-gold.webp",
    alt: "Wild swimmer in a cap and goggles in amber-coloured open water",
    caption: "Bathing 7am–7pm, seven days",
    span: "lg:col-span-5",
    ratio: "aspect-[16/10]",
  },
  {
    src: "/images/pine-swim-float.webp",
    alt: "Woman floating peacefully on her back in clear turquoise lake water",
    caption: "Float, breathe and reset",
    span: "lg:col-span-7",
    ratio: "aspect-[16/10]",
  },
];

const INFO = [
  {
    title: "Group Bookings",
    detail: "Any-time availability for groups of five — add the Geo-dome and wood-fired sauna to your gathering.",
    icon: (
      <>
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </>
    ),
  },
  {
    title: "Safe Bathing",
    detail: "Our health & safety page covers everything you need before you enter the water.",
    icon: (
      <>
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" />
        <path d="m9 12 2 2 4-4" />
      </>
    ),
  },
  {
    title: "Availability",
    detail: "Bathing 7am to 7pm, seven days. Sauna currently Thursday, Saturday & Sunday.",
    icon: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v5l3 2" />
      </>
    ),
  },
  {
    title: "Contraindications",
    detail: "The health declaration completed onsite covers health and medication support before you enter the water.",
    icon: (
      <>
        <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.29 1.51 4.04 3 5.5l7 7Z" />
      </>
    ),
  },
  {
    title: "Traffic-Light Steps",
    detail: "Check your availability slot, then complete our Traffic Light Safety Steps before booking.",
    icon: (
      <>
        <rect x="7" y="2" width="10" height="20" rx="5" />
        <circle cx="12" cy="7" r="1.4" />
        <circle cx="12" cy="12" r="1.4" />
        <circle cx="12" cy="17" r="1.4" />
      </>
    ),
  },
];

const PASTIMES = [
  {
    title: "Fishing",
    detail: "Willow and Oak lakes offer coarse, match and specimen angling.",
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
    detail: "Natural cold-water dipping with ladders, jetties and pontoons.",
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
    alt: "Wild swimmer entering the lake",
    label: "Cold-water dip",
    sub: "Open-water bathing",
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

const EASE = [0.16, 1, 0.3, 1] as const;

/* ------------------------------- component ------------------------------- */

export function PineLakeShowcase({ lake: _lake }: { lake: Lake }) {
  return (
    <>
      {/* --------------- 1 · Intro + passes / pricing -------------------- */}
      <section className="relative overflow-hidden bg-ivory py-24 md:py-36">
        <div className="mx-auto max-w-[1440px] px-5 md:px-10">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-5 lg:pt-2">
              <Reveal>
                <span className="inline-flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.32em] text-forest-600">
                  <span className="h-px w-8 bg-gold" />
                  Sauna &amp; plunge lake
                </span>
              </Reveal>
              <Reveal delay={0.08}>
                <h2 className="mt-6 font-display text-4xl font-extrabold uppercase leading-[1.02] tracking-[-0.02em] text-forest-900 md:text-6xl">
                  Hot sauna
                  <span className="block font-serif font-medium normal-case italic text-forest-600">
                    or cold plunge.
                  </span>
                </h2>
              </Reveal>
              <Reveal delay={0.14}>
                <p className="mt-5 font-serif text-lg italic text-earth-600">
                  We have it all.
                </p>
              </Reveal>
              <Reveal delay={0.2}>
                <p className="mt-6 max-w-md text-[15px] leading-relaxed text-forest-700/80">
                  In recent years, the benefits of cold-water plunging have
                  become well known and evidenced — a healthy pastime more
                  people are considering. We provide a safe and welcoming
                  experience with membership options available. As safety is
                  key, everyone completes a short health &amp; safety
                  declaration onsite before entering the water.
                </p>
              </Reveal>
              <Reveal delay={0.26}>
                <p className="mt-4 max-w-md text-[13px] leading-relaxed text-forest-700/60">
                  Our facility is relatively new, so is our booking system —
                  please bear with us while we simplify things.
                </p>
              </Reveal>

              <Reveal delay={0.32}>
                <div className="mt-10 flex flex-wrap gap-3">
                  <span className="inline-flex items-center gap-2 rounded-full border border-forest-900/12 bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.1em] text-forest-800 shadow-card">
                    <ClockIcon /> Bathing 7am–7pm · 7 days
                  </span>
                  <span className="inline-flex items-center gap-2 rounded-full border border-forest-900/12 bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.1em] text-forest-800 shadow-card">
                    <FlameIcon /> Sauna Thu · Sat · Sun
                  </span>
                </div>
              </Reveal>
            </div>

            {/* Pass cards */}
            <div className="lg:col-span-7">
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-3 sm:gap-4">
                {PASSES.map((pass, i) => (
                  <Reveal key={pass.name} delay={0.1 + i * 0.1}>
                    <motion.div
                      whileHover={{ y: -6 }}
                      transition={{ duration: 0.7, ease: EASE }}
                      className={`relative flex h-full flex-col rounded-[1.75rem] border p-7 ${
                        pass.featured
                          ? "border-gold/50 bg-forest-950 text-ivory shadow-soft sm:-translate-y-3"
                          : "border-forest-900/10 bg-white text-forest-900 shadow-card"
                      }`}
                    >
                      {pass.featured && (
                        <span className="absolute -top-3 left-7 rounded-full bg-gold px-3 py-1 text-[9px] font-bold uppercase tracking-[0.2em] text-forest-950">
                          Most popular
                        </span>
                      )}
                      <p
                        className={`text-[10px] font-bold uppercase tracking-[0.24em] ${
                          pass.featured ? "text-sage-300" : "text-forest-600"
                        }`}
                      >
                        {pass.name}
                      </p>
                      <p className="mt-5 flex items-baseline gap-2">
                        <span
                          className={`font-display text-5xl font-extrabold leading-none ${
                            pass.featured ? "text-gold-light" : "text-forest-900"
                          }`}
                        >
                          {pass.price}
                        </span>
                        <span
                          className={`text-[11px] ${
                            pass.featured ? "text-sage-300" : "text-forest-700/60"
                          }`}
                        >
                          {pass.unit}
                        </span>
                      </p>
                      <div
                        className={`my-5 h-px ${
                          pass.featured ? "bg-ivory/15" : "bg-forest-900/10"
                        }`}
                      />
                      <p
                        className={`text-[13px] leading-snug ${
                          pass.featured ? "text-sage-200" : "text-forest-700/80"
                        }`}
                      >
                        {pass.note}
                      </p>
                      <p
                        className={`mt-auto pt-5 font-serif text-sm italic ${
                          pass.featured ? "text-gold-light/90" : "text-earth-600"
                        }`}
                      >
                        {pass.extra}
                      </p>
                    </motion.div>
                  </Reveal>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ----------------------- 2 · Gallery ----------------------------- */}
      <section className="relative overflow-hidden bg-cream py-24 md:py-32">
        <div className="mx-auto max-w-[1440px] px-5 md:px-10">
          <div className="mb-12 flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <Reveal>
                <span className="inline-flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.32em] text-forest-600">
                  <span className="h-px w-8 bg-gold" />
                  On the water
                </span>
              </Reveal>
              <Reveal delay={0.08}>
                <h2 className="mt-6 max-w-xl font-display text-4xl font-extrabold uppercase leading-[1.02] tracking-[-0.02em] text-forest-900 md:text-5xl">
                  Fire, steam
                  <span className="font-serif font-medium normal-case italic text-forest-600">
                    {" "}
                    &amp; clear water.
                  </span>
                </h2>
              </Reveal>
            </div>
            <Reveal delay={0.14}>
              <p className="max-w-xs text-[13px] leading-relaxed text-forest-700/70">
                A wood-fired barrel sauna on its own jetty, a ladder straight
                into the lake — and a sky worth turning up early for.
              </p>
            </Reveal>
          </div>

          <div className="grid grid-cols-1 gap-5 lg:grid-cols-12">
            {GALLERY.map((g, i) => (
              <Reveal key={g.src} delay={0.06 * i} className={g.span}>
                <motion.figure
                  whileHover={{ scale: 1.015 }}
                  transition={{ duration: 0.8, ease: EASE }}
                  className={`group relative ${g.ratio} overflow-hidden rounded-[1.75rem] shadow-soft`}
                >
                  <OptimizedImage
                    src={g.src}
                    alt={g.alt}
                    sizes="(max-width: 1024px) 92vw, 46vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-forest-950/75 via-transparent to-transparent opacity-90" />
                  <figcaption className="absolute bottom-5 left-6 right-6 flex translate-y-1 items-center gap-2 text-[11px] font-bold uppercase tracking-[0.18em] text-ivory opacity-95 transition-all duration-500 group-hover:translate-y-0">
                    <span className="h-1 w-6 bg-gold" />
                    {g.caption}
                  </figcaption>
                </motion.figure>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- 3 · Know before you book ---------------------- */}
      <section className="relative overflow-hidden bg-ivory py-24 md:py-36">
        <div className="mx-auto max-w-[1440px] px-5 md:px-10">
          <Reveal>
            <span className="inline-flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.32em] text-forest-600">
              <span className="h-px w-8 bg-gold" />
              Good to know
            </span>
          </Reveal>
          <Reveal delay={0.08}>
            <h2 className="mt-6 max-w-2xl font-display text-4xl font-extrabold uppercase leading-[1.02] tracking-[-0.02em] text-forest-900 md:text-6xl">
              Before you
              <span className="font-serif font-medium normal-case italic text-forest-600">
                {" "}
                book.
              </span>
            </h2>
          </Reveal>

          <ul className="mt-14 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {INFO.map((item, i) => (
              <Reveal key={item.title} delay={0.06 * i}>
                <li className="group flex h-full flex-col rounded-[1.5rem] border border-forest-900/10 bg-white p-6 shadow-card transition-all duration-500 hover:-translate-y-1 hover:border-gold/40 hover:shadow-soft">
                  <span className="flex h-11 w-11 items-center justify-center rounded-full border border-gold/45 text-earth-600 transition-all duration-500 group-hover:border-gold group-hover:bg-gold group-hover:text-forest-950">
                    <svg
                      width="20"
                      height="20"
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
                  <p className="mt-5 font-display text-[15px] font-bold uppercase leading-tight tracking-tight text-forest-900">
                    {item.title}
                  </p>
                  <p className="mt-2 text-[12px] leading-relaxed text-forest-700/70">
                    {item.detail}
                  </p>
                </li>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      {/* ---------------- 4 · Booking band + screening ------------------ */}
      <section className="relative overflow-hidden bg-forest-950 py-24 md:py-32">
        <div className="grain pointer-events-none absolute inset-0" />
        <div
          className="pointer-events-none absolute -left-40 top-0 h-[420px] w-[680px] rounded-full bg-gold/10 blur-[140px]"
          aria-hidden
        />
        <div className="relative mx-auto max-w-[1440px] px-5 md:px-10">
          <div className="mx-auto max-w-2xl text-center">
            <Reveal>
              <span className="inline-flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.32em] text-sage-300">
                <span className="h-px w-8 bg-gold" />
                Make a booking
                <span className="h-px w-8 bg-gold" />
              </span>
            </Reveal>
            <Reveal delay={0.08}>
              <h2 className="mt-6 font-display text-4xl font-extrabold uppercase leading-[1.02] tracking-[-0.02em] text-ivory md:text-6xl">
                Sauna &amp; dip,
                <span className="block font-serif font-medium normal-case italic text-gold-light">
                  or dip alone.
                </span>
              </h2>
            </Reveal>
          </div>

          <div className="mx-auto mt-14 grid max-w-4xl grid-cols-1 gap-5 md:grid-cols-2">
            <Reveal>
              <BookingCard
                eyebrow="The full ritual"
                title="Sauna & Plunge"
                price="£10"
                bullets={[
                  "Wood-fired sauna session",
                  "Natural lake plunge",
                  "Health declaration completed onsite",
                ]}
                ctaLabel="Book Now"
                href="/book/sauna"
                featured
              />
            </Reveal>
            <Reveal delay={0.1}>
              <BookingCard
                eyebrow="Open-water bathing"
                title="Water Dip Only"
                price="£5"
                bullets={[
                  "Cold-water dip, no sauna",
                  "12 hourly slots, 7am–6pm",
                  "Buoyancy equipment provided",
                ]}
                ctaLabel="Book Water Dip Only"
                href="/book/swim"
              />
            </Reveal>
          </div>

          <Reveal delay={0.2}>
            <div className="mx-auto mt-10 flex max-w-4xl items-start gap-4 rounded-2xl border border-gold/35 bg-gold/[0.07] p-6">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gold/20 text-gold-light">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 9v4M12 17h.01" />
                  <path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z" />
                </svg>
              </span>
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-gold-light">
                  Notice · Health &amp; safety declaration for sauna &amp; dip
                </p>
                <p className="mt-2 text-[13px] leading-relaxed text-sage-200">
                  Everyone must complete a short health &amp; safety declaration{" "}
                  <strong className="text-ivory">onsite, before entering the
                  water</strong> — it is not required to make a booking. Arrive
                  a few minutes early, or complete it now to save time.
                </p>
                <Link
                  href="/sentinal"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 inline-flex items-center gap-2 text-[12px] font-bold uppercase tracking-[0.16em] text-ivory underline decoration-gold decoration-2 underline-offset-4 transition-colors hover:text-gold-light"
                >
                  Complete the form
                  <span aria-hidden>↗</span>
                </Link>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ---------------------- 5 · Other pastimes ---------------------- */}
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
                    pastimes.
                  </span>
                </h2>
              </Reveal>

              <ul className="mt-12 grid grid-cols-1 gap-3 sm:grid-cols-2">
                {PASTIMES.map((item, i) => (
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
                    7
                  </span>
                  <span className="mt-0.5 text-[7px] font-bold uppercase tracking-[0.14em] text-sage-200">
                    days a week
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

function BookingCard({
  eyebrow,
  title,
  price,
  bullets,
  ctaLabel,
  href,
  featured = false,
}: {
  eyebrow: string;
  title: string;
  price: string;
  bullets: string[];
  ctaLabel: string;
  href: string;
  featured?: boolean;
}) {
  return (
    <motion.div
      whileHover={{ y: -6 }}
      transition={{ duration: 0.7, ease: EASE }}
      className={`flex h-full flex-col rounded-[1.75rem] border p-8 ${
        featured
          ? "border-gold/50 bg-ivory/[0.06]"
          : "border-ivory/12 bg-ivory/[0.03]"
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-sage-300">
            {eyebrow}
          </p>
          <p className="mt-2 font-display text-2xl font-bold uppercase text-ivory">
            {title}
          </p>
        </div>
        <p className="font-display text-4xl font-extrabold text-gold-light">
          {price}
        </p>
      </div>
      <div className="my-6 h-px bg-ivory/10" />
      <ul className="space-y-2.5 text-[13px] text-sage-300">
        {bullets.map((b) => (
          <li key={b} className="flex items-center gap-3">
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-gold/20 text-[10px] text-gold-light">
              ✓
            </span>
            {b}
          </li>
        ))}
      </ul>
      <Link
        href={href}
        className={`group mt-8 flex items-center justify-between gap-3 rounded-full px-6 py-4 text-[12px] font-bold uppercase tracking-[0.14em] transition-colors ${
          featured
            ? "bg-gold text-forest-950 hover:bg-gold-light"
            : "bg-ivory text-forest-950 hover:bg-gold"
        }`}
      >
        {ctaLabel}
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-forest-900 text-ivory transition-transform duration-500 group-hover:rotate-45">
          →
        </span>
      </Link>
    </motion.div>
  );
}

function ClockIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="text-earth-600">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </svg>
  );
}

function FlameIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="text-earth-600">
      <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5Z" />
    </svg>
  );
}
