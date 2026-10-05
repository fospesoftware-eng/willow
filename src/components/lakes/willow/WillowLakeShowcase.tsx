"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Reveal } from "@/components/ui/Reveal";
import { OptimizedImage } from "@/components/ui/OptimizedImage";
import type { Lake } from "@/data/site";

/* ---------------------------------- data --------------------------------- */

const SPECIES_LINE = "Carp · Tench · Bream · Ide · Roach · Rudd · Perch";

const GALLERY = [
  {
    src: "/images/fishing-home.jpg",
    label: "Pleasure angling",
    sub: "A quiet day on the pole",
    span: "lg:mt-0",
  },
  {
    src: "/images/fishing-coaching.jpg",
    label: "Coaching & juniors",
    sub: "Education sessions on the platform",
    span: "lg:-mt-8",
  },
  {
    src: "/images/match-home.jpg",
    label: "Match days",
    sub: "Pegged for silvers and bream",
    span: "lg:mt-6",
  },
];

const GOODIES = [
  {
    no: "01",
    src: "/images/fire-pit-home.jpg",
    title: "Fire Circle",
    blurb:
      "Drum circles and storytelling around the flames once the rods are rested for the night.",
  },
  {
    no: "02",
    src: "/images/camp-fire-day.jpg",
    title: "Community Gatherings",
    blurb:
      "Open days, cook-outs and easy get-togethers on the bank with fellow visitors.",
  },
  {
    no: "03",
    src: "/images/dome-space.jpg",
    title: "Meditation Groups",
    blurb:
      "Sound baths and quiet practice inside the candle-lit Geo-dome in the trees.",
  },
  {
    no: "04",
    src: "/images/outdoor-kitchen.jpg",
    title: "Outdoor Kitchen",
    blurb:
      "Wood-fired feasts and communal cooking in the open air, just back from the water.",
  },
];

const INVOLVED = [
  {
    title: "Fishing",
    detail: "Pleasure, match and night fishing — seven species across the match lake.",
    icon: (
      <>
        <path d="M6.5 12c.94-3.46 4.94-6 8.5-6 3.56 0 6.06 2.54 7 6-.94 3.47-3.44 6-7 6s-7.56-2.53-8.5-6Z" />
        <path d="M18 12v.5" />
        <path d="M16 17.93a9.77 9.77 0 0 1 0-11.86" />
        <path d="M7 10.67C7 8 5.58 5.97 2.73 5.5c-1 1.53-1 5.53 0 7.1 1.65.56 4.27-.33 4.27-1.93Z" />
      </>
    ),
  },
  {
    title: "Plunge Pool",
    detail: "Cold-water dipping at Pine Lake, a short walk from the Willow pegs.",
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
    detail: "Coaching, volunteer days and private hire in the off-grid Geo-dome.",
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
    detail: "Meadow and woodland paths winding through six secluded acres.",
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
  { src: "/images/match-home.jpg", alt: "Anglers lined up for a match on Willow Lake", cls: "lg:translate-y-6" },
  { src: "/images/site-walks.jpg", alt: "Aerial view of Willow Garth lakes and walking trails", cls: "" },
  { src: "/images/cold-swim.jpg", alt: "Wild swimmer in the Pine Lake plunge pool", cls: "" },
  { src: "/images/fishing-coaching.jpg", alt: "Coach guiding a junior angler on the platform", cls: "lg:-translate-y-6" },
];

const EASE = [0.16, 1, 0.3, 1] as const;

/* ------------------------------- component ------------------------------- */

export function WillowLakeShowcase({ lake }: { lake: Lake }) {
  const bookingHref = lake.bookingUrl ?? "#";

  return (
    <>
      {/* ----------------------- 1 · Mixed species ----------------------- */}
      <section className="relative overflow-hidden bg-ivory py-24 md:py-36">
        <div className="mx-auto max-w-[1440px] px-5 md:px-10">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-10">
            <div className="lg:col-span-5 lg:pt-4">
              <Reveal>
                <span className="inline-flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.32em] text-forest-600">
                  <span className="h-px w-8 bg-gold" />
                  The match lake
                </span>
              </Reveal>
              <Reveal delay={0.08}>
                <h2 className="mt-6 font-display text-4xl font-extrabold uppercase leading-[1.02] tracking-[-0.02em] text-forest-900 md:text-6xl">
                  Willow
                  <span className="block font-serif font-medium normal-case italic text-forest-600">
                    mixed species.
                  </span>
                </h2>
              </Reveal>
              <Reveal delay={0.14}>
                <p className="mt-5 font-serif text-lg italic text-earth-600 md:text-xl">
                  {SPECIES_LINE}
                </p>
              </Reveal>
              <Reveal delay={0.2}>
                <p className="mt-6 max-w-md text-[15px] leading-relaxed text-forest-700/80">
                  {lake.description}
                </p>
              </Reveal>

              {/* Species pills */}
              <Reveal delay={0.26}>
                <ul className="mt-8 flex flex-wrap gap-2">
                  {lake.species?.map((s) => (
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
                <div className="mt-10 flex items-center gap-6">
                  <Stat value="07" label="Species stocked" />
                  <span className="h-10 w-px bg-forest-900/15" />
                  <Stat value="£10" label="Day ticket" />
                  <span className="h-10 w-px bg-forest-900/15" />
                  <Stat value="£20" label="Night fishing" />
                </div>
              </Reveal>
            </div>

            {/* Triptych */}
            <div className="lg:col-span-7">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-5">
                {GALLERY.map((g, i) => (
                  <Reveal key={g.src} delay={0.1 + i * 0.1} className={g.span}>
                    <motion.figure
                      whileHover={{ y: -6 }}
                      transition={{ duration: 0.7, ease: EASE }}
                      className="group relative aspect-[3/4] overflow-hidden rounded-[1.5rem] shadow-soft"
                    >
                      <motion.div
                        className="absolute inset-0"
                        whileHover={{ scale: 1.07 }}
                        transition={{ duration: 1.1, ease: EASE }}
                      >
                        <OptimizedImage
                          src={g.src}
                          alt={`${g.label} at Willow Lake, Willow Garth Country Park`}
                          sizes="(max-width: 640px) 92vw, (max-width: 1024px) 30vw, 360px"
                        />
                      </motion.div>
                      <div className="absolute inset-0 bg-gradient-to-t from-forest-950/85 via-forest-950/5 to-transparent" />
                      <figcaption className="absolute inset-x-0 bottom-0 p-5">
                        <span className="font-display text-[10px] font-bold uppercase tracking-[0.3em] text-gold-light">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <p className="mt-1 font-display text-lg font-bold uppercase leading-tight text-ivory">
                          {g.label}
                        </p>
                        <p className="text-[11px] text-sage-200">{g.sub}</p>
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
          className="pointer-events-none absolute -top-40 left-1/2 h-[480px] w-[820px] -translate-x-1/2 rounded-full bg-gold/10 blur-[140px]"
          aria-hidden
        />
        <div className="relative mx-auto max-w-[1440px] px-5 md:px-10">
          <div className="grid grid-cols-1 items-center gap-14 lg:grid-cols-2">
            <div>
              <Reveal>
                <span className="inline-flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.32em] text-sage-300">
                  <span className="h-px w-8 bg-gold" />
                  Book with Swimbooker
                </span>
              </Reveal>
              <Reveal delay={0.08}>
                <h2 className="mt-6 font-display text-4xl font-extrabold uppercase leading-[1.02] tracking-[-0.02em] text-ivory md:text-6xl">
                  Choose your
                  <span className="block font-serif font-medium normal-case italic text-gold-light">
                  day on the bank.
                  </span>
                </h2>
              </Reveal>
              <Reveal delay={0.16}>
                <p className="mt-6 max-w-md text-[15px] leading-relaxed text-sage-300">
                  Pegs are booked instantly through Swimbooker — pick your
                  swim, pay securely and turn up ready to fish. Night anglers can
                  pair their ticket with a wild camping pitch or motorhome
                  hard-standing.
                </p>
              </Reveal>
              <Reveal delay={0.24}>
                <div className="mt-9 flex flex-wrap items-center gap-4">
                  <a
                    href={bookingHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group inline-flex items-center gap-3 rounded-full bg-ivory py-2 pl-2 pr-2.5 text-[13px] font-bold uppercase tracking-[0.12em] text-forest-950 shadow-card transition-colors hover:bg-gold"
                  >
                    <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[#1e5fa8] text-white">
                      <SwimbookerFish />
                    </span>
                    Book on Swimbooker
                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-forest-900 text-ivory transition-transform duration-500 group-hover:rotate-45">
                      →
                    </span>
                  </a>
                  <Link
                    href="/experiences/camping"
                    className="inline-flex items-center rounded-full border border-ivory/25 px-7 py-4 text-[12px] font-bold uppercase tracking-[0.14em] text-ivory transition-colors hover:border-gold hover:text-gold-light"
                  >
                    Stay overnight
                  </Link>
                </div>
              </Reveal>
            </div>

            {/* Price cards */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <PriceCard
                tag="Day ticket"
                price="£10"
                note="Full day's fishing on Willow — pleasure or match pegs."
                featured
                delay={0.1}
              />
              <PriceCard
                tag="Night fishing"
                price="£20"
                note="Evening through to dawn, with camping pitches alongside."
                delay={0.2}
              />
            </div>
          </div>
        </div>
      </section>

      {/* ------------------- 3 · Mixed bag of goodies ------------------- */}
      <section className="relative overflow-hidden bg-cream py-24 md:py-36">
        <div className="mx-auto max-w-[1440px] px-5 md:px-10">
          <div className="mb-14 flex flex-col justify-between gap-8 md:mb-20 md:flex-row md:items-end">
            <div className="max-w-2xl">
              <Reveal>
                <span className="inline-flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.32em] text-forest-600">
                  <span className="h-px w-8 bg-gold" />
                  Beyond the swim
                </span>
              </Reveal>
              <Reveal delay={0.08}>
                <h2 className="mt-6 font-display text-4xl font-extrabold uppercase leading-[1.02] tracking-[-0.02em] text-forest-900 md:text-6xl">
                  A mixed bag
                  <span className="block font-serif font-medium normal-case italic text-forest-600">
                    of goodies.
                  </span>
                </h2>
              </Reveal>
            </div>
            <Reveal delay={0.16}>
              <p className="max-w-sm text-sm leading-relaxed text-forest-700/75 md:text-right">
                Whether it&apos;s pleasure fishing, night fishing or staging a
                match, there is plenty here to keep you &lsquo;reeling in&rsquo;
                lots of fun off the bank too.
              </p>
            </Reveal>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 md:gap-6">
            {GOODIES.map((g, i) => (
              <Reveal key={g.title} delay={i * 0.08}>
                <motion.article
                  whileHover={{ y: -8 }}
                  transition={{ duration: 0.6, ease: EASE }}
                  className="group relative flex h-full flex-col overflow-hidden rounded-[1.75rem] border border-forest-900/8 bg-white shadow-card"
                >
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <motion.div
                      className="absolute inset-0"
                      whileHover={{ scale: 1.07 }}
                      transition={{ duration: 1.2, ease: EASE }}
                    >
                      <OptimizedImage
                        src={g.src}
                        alt={`${g.title} at Willow Garth Country Park`}
                        sizes="(max-width: 640px) 92vw, (max-width: 1024px) 45vw, 23vw"
                      />
                    </motion.div>
                    <span className="absolute left-4 top-4 font-display text-3xl font-extrabold italic text-ivory drop-shadow-[0_2px_12px_rgba(0,0,0,0.45)]">
                      {g.no}
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-t from-forest-950/40 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                  </div>
                  <div className="flex flex-1 flex-col p-6">
                    <h3 className="font-display text-xl font-bold uppercase tracking-tight text-forest-900">
                      {g.title}
                    </h3>
                    <span className="mt-3 h-px w-8 bg-gold transition-all duration-500 group-hover:w-14" />
                    <p className="mt-3 text-[13px] leading-relaxed text-forest-700/75">
                      {g.blurb}
                    </p>
                  </div>
                </motion.article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* --------------------- 4 · Actively involved -------------------- */}
      <section className="relative overflow-hidden bg-ivory py-24 md:py-36">
        <div className="mx-auto max-w-[1440px] px-5 md:px-10">
          <div className="grid grid-cols-1 items-center gap-14 lg:grid-cols-2 lg:gap-20">
            {/* Icon list */}
            <div>
              <Reveal>
                <span className="inline-flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.32em] text-forest-600">
                  <span className="h-px w-8 bg-gold" />
                  Six acres, one escape
                </span>
              </Reveal>
              <Reveal delay={0.08}>
                <h2 className="mt-6 font-display text-4xl font-extrabold uppercase leading-[1.02] tracking-[-0.02em] text-forest-900 md:text-6xl">
                  Actively
                  <span className="block font-serif font-medium normal-case italic text-forest-600">
                    involved.
                  </span>
                </h2>
              </Reveal>

              <ul className="mt-12 space-y-3">
                {INVOLVED.map((item, i) => (
                  <Reveal key={item.title} delay={0.1 + i * 0.08}>
                    <li className="group flex items-center gap-5 rounded-[1.25rem] border border-transparent p-4 transition-all duration-500 hover:border-forest-900/10 hover:bg-white hover:shadow-card">
                      <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-gold/45 text-earth-600 transition-all duration-500 group-hover:border-gold group-hover:bg-gold group-hover:text-forest-950">
                        <svg
                          width="26"
                          height="26"
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
                        <p className="font-display text-lg font-bold uppercase tracking-tight text-forest-900">
                          {item.title}
                        </p>
                        <p className="text-[13px] leading-snug text-forest-700/70">
                          {item.detail}
                        </p>
                      </div>
                      <span className="ml-auto font-display text-xl text-forest-900/20 transition-all duration-500 group-hover:translate-x-1 group-hover:text-gold">
                        →
                      </span>
                    </li>
                  </Reveal>
                ))}
              </ul>
            </div>

            {/* Collage */}
            <Reveal delay={0.15}>
              <div className="grid grid-cols-2 gap-4 md:gap-5">
                {COLLAGE.map((c) => (
                  <motion.figure
                    key={c.src}
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.7, ease: EASE }}
                    className={`relative aspect-square overflow-hidden rounded-[1.5rem] shadow-soft ${c.cls}`}
                  >
                    <OptimizedImage
                      src={c.src}
                      alt={c.alt}
                      sizes="(max-width: 1024px) 46vw, 280px"
                    />
                    <div className="absolute inset-0 ring-1 ring-inset ring-forest-950/10" />
                  </motion.figure>
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </section>
    </>
  );
}

/* -------------------------------- pieces --------------------------------- */

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <p className="font-display text-3xl font-extrabold text-forest-900">
        {value}
      </p>
      <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.18em] text-forest-600">
        {label}
      </p>
    </div>
  );
}

function PriceCard({
  tag,
  price,
  note,
  featured,
  delay,
}: {
  tag: string;
  price: string;
  note: string;
  featured?: boolean;
  delay: number;
}) {
  return (
    <Reveal delay={delay}>
      <div
        className={`relative flex h-full flex-col overflow-hidden rounded-[1.75rem] border p-8 ${
          featured
            ? "border-gold/40 bg-gradient-to-br from-gold/[0.14] to-ivory/[0.03]"
            : "border-ivory/12 bg-ivory/[0.04]"
        }`}
      >
        {featured && (
          <span className="absolute right-6 top-6 rounded-full bg-gold px-3 py-1 text-[9px] font-bold uppercase tracking-[0.2em] text-forest-950">
            Popular
          </span>
        )}
        <TicketIcon />
        <p className="mt-6 text-[10px] font-bold uppercase tracking-[0.28em] text-sage-300">
          {tag}
        </p>
        <p className="mt-3 font-display text-6xl font-extrabold leading-none text-gold-light">
          {price}
        </p>
        <p className="mt-5 text-[13px] leading-relaxed text-sage-300/90">
          {note}
        </p>
      </div>
    </Reveal>
  );
}

function TicketIcon() {
  return (
    <span className="flex h-12 w-12 items-center justify-center rounded-full border border-gold/40 text-gold-light">
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
        <path d="M4 8.5A2.5 2.5 0 0 1 6.5 6h11A2.5 2.5 0 0 1 20 8.5V10a2 2 0 0 0 0 4v1.5a2.5 2.5 0 0 1-2.5 2.5h-11A2.5 2.5 0 0 1 4 15.5V14a2 2 0 0 0 0-4V8.5Z" />
        <path d="M14 6v12" strokeDasharray="2 2" />
      </svg>
    </span>
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
