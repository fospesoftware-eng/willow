"use client";

import type { ReactNode } from "react";
import Link from "@/lib/next/link";
import { motion } from "framer-motion";
import { Reveal } from "./Reveal";
import { OptimizedImage } from "./OptimizedImage";

type Cta = { label: string; href: string; external?: boolean };

type Props = {
  variant?: "cinematic" | "split" | "solid";
  eyebrow?: string;
  title: ReactNode;
  accent?: ReactNode;
  subtitle?: string;
  image?: string;
  imageAlt?: string;
  imagePosition?: string;
  align?: "left" | "center";
  chips?: string[];
  cta?: Cta;
  secondaryCta?: Cta;
  stat?: { value: string; label: string };
};

const EASE = [0.16, 1, 0.3, 1] as const;

const OBJECT_POSITIONS: Record<string, string> = {
  center: "object-center",
  top: "object-top",
  bottom: "object-bottom",
  "center 35%": "object-[center_35%]",
  "center 70%": "object-[center_70%]",
  "30% center": "object-[30%_center]",
  "70% center": "object-[70%_center]",
};

function Eyebrow({ children, dark = false }: { children: ReactNode; dark?: boolean }) {
  return (
    <span
      className={`inline-flex items-center gap-3 rounded-full pl-2 pr-4 py-1.5 mb-7 ${
        dark
          ? "bg-forest-900/[0.06] border border-forest-900/10"
          : "bg-ivory/15 backdrop-blur-md border border-ivory/25"
      }`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-gold" />
      <span
        className={`text-[10px] md:text-[11px] font-semibold uppercase tracking-[0.28em] ${
          dark ? "text-forest-700" : "text-ivory"
        }`}
      >
        {children}
      </span>
    </span>
  );
}

function CtaButton({ cta, variant = "solid" }: { cta: Cta; variant?: "solid" | "ghost" }) {
  const cls =
    variant === "solid"
      ? "group inline-flex items-center gap-3 rounded-full bg-ivory py-2.5 pl-6 pr-2 text-[13px] font-semibold tracking-wide text-forest-950 shadow-pill hover:bg-gold transition-colors duration-300"
      : "inline-flex items-center rounded-full border px-6 py-4 text-[13px] font-semibold tracking-wide transition-colors duration-300";
  const ghostCls = "border-ivory/35 bg-ivory/10 text-ivory backdrop-blur-md hover:bg-ivory/20";
  const content = (
    <>
      {cta.label}
      {variant === "solid" && (
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-forest-900 text-ivory transition-transform duration-500 group-hover:rotate-45">
          →
        </span>
      )}
    </>
  );
  if (cta.external) {
    return (
      <a href={cta.href} target="_blank" rel="noopener noreferrer" className={`${cls} ${variant === "ghost" ? ghostCls : ""}`}>
        {content}
      </a>
    );
  }
  return (
    <Link href={cta.href} className={`${cls} ${variant === "ghost" ? ghostCls : ""}`}>
      {content}
    </Link>
  );
}

function Title({
  title,
  accent,
  tone = "light",
}: {
  title: ReactNode;
  accent?: ReactNode;
  tone?: "light" | "dark";
}) {
  return (
    <h1
      className={`font-display font-extrabold uppercase leading-[0.95] tracking-[-0.02em] text-5xl md:text-7xl lg:text-8xl ${
        tone === "light" ? "text-ivory" : "text-forest-900"
      }`}
    >
      {title}
      {accent && (
        <>
          {" "}
          <span className="font-serif font-medium italic normal-case tracking-tight text-gold-light">
            {accent}
          </span>
        </>
      )}
    </h1>
  );
}

export function PageHero({
  variant = "cinematic",
  eyebrow,
  title,
  accent,
  subtitle,
  image,
  imageAlt = "",
  imagePosition = "center",
  align = "left",
  chips,
  cta,
  secondaryCta,
  stat,
}: Props) {
  if (variant === "split") {
    return (
      <section className="relative overflow-hidden bg-ivory">
        <div className="mx-auto grid max-w-[1440px] grid-cols-1 items-center gap-10 px-5 pb-16 pt-36 md:px-10 md:pb-24 md:pt-44 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
        {/* Text column */}
        <div>
          <Reveal>
            <div className="mb-7 flex items-center gap-4">
              <span className="block h-px w-10 bg-gold" />
              <span className="text-[10px] md:text-[11px] font-semibold uppercase tracking-[0.28em] text-forest-700">
                {eyebrow}
              </span>
            </div>
          </Reveal>
          <Reveal delay={0.08}>
            <h1 className="font-display font-extrabold uppercase leading-[0.95] tracking-[-0.02em] text-forest-900 [font-size:clamp(2.6rem,5.6vw,5.25rem)]">
              {title}{" "}
              {accent && (
                <span className="font-serif font-medium italic normal-case tracking-tight text-forest-600">
                  {accent}
                </span>
              )}
            </h1>
          </Reveal>
          {subtitle && (
            <Reveal delay={0.16}>
              <p className="mt-7 max-w-xl text-base leading-relaxed text-forest-700/80 md:text-lg">
                {subtitle}
              </p>
            </Reveal>
          )}
          {(cta || secondaryCta) && (
            <Reveal delay={0.24}>
              <div className="mt-9 flex flex-wrap items-center gap-3">
                {cta && <CtaButtonDark cta={cta} />}
                {secondaryCta && <CtaGhostDark cta={secondaryCta} />}
              </div>
            </Reveal>
          )}
        </div>

        {/* Image panel */}
        <Reveal delay={0.15}>
          <div className="relative h-[52vh] min-h-[380px] overflow-hidden rounded-[2rem] shadow-soft md:h-[68vh]">
            {image && (
              <motion.div
                initial={{ scale: 1.12 }}
                animate={{ scale: 1 }}
                transition={{ duration: 1.8, ease: EASE }}
                className="absolute inset-0"
              >
                <OptimizedImage src={image} alt={imageAlt} priority sizes="(max-width:1024px) 100vw, 700px" className={OBJECT_POSITIONS[imagePosition] ?? "object-center"} />
              </motion.div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-forest-950/60 via-transparent to-forest-950/10" />
            {chips && (
              <div className="absolute inset-x-5 bottom-5 flex flex-wrap gap-2">
                {chips.map((chip) => (
                  <span
                    key={chip}
                    className="rounded-full bg-ivory/92 px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-forest-900 backdrop-blur-md"
                  >
                    {chip}
                  </span>
                ))}
              </div>
            )}
            {stat && (
              <div className="absolute right-5 top-5 rounded-2xl bg-forest-950/55 px-5 py-4 text-right backdrop-blur-md">
                <p className="font-display text-3xl font-extrabold text-ivory">{stat.value}</p>
                <p className="mt-1 text-[10px] uppercase tracking-[0.2em] text-ivory/70">{stat.label}</p>
              </div>
            )}
          </div>
        </Reveal>
        </div>
      </section>
    );
  }

  if (variant === "solid") {
    return (
      <section className="relative overflow-hidden bg-forest-950">
        <div className="grain pointer-events-none absolute inset-0" />
        <div className="pointer-events-none absolute -top-1/3 left-1/2 h-[70vh] w-[70vh] -translate-x-1/2 rounded-full bg-gold/10 blur-[120px]" />
        <div className="relative mx-auto flex min-h-[58vh] max-w-[1440px] flex-col items-center justify-center px-5 pb-20 pt-40 text-center md:px-10">
          {eyebrow && (
            <Reveal>
              <Eyebrow>{eyebrow}</Eyebrow>
            </Reveal>
          )}
          <Reveal delay={0.1}>
            <div className="[font-size:clamp(2.4rem,6vw,5rem)]">
              <Title title={title} accent={accent} />
            </div>
          </Reveal>
          {subtitle && (
            <Reveal delay={0.2}>
              <p className="mt-7 max-w-2xl text-base leading-relaxed text-sage-200 md:text-lg">
                {subtitle}
              </p>
            </Reveal>
          )}
          {chips && (
            <Reveal delay={0.28}>
              <div className="mt-9 flex flex-wrap justify-center gap-2">
                {chips.map((chip) => (
                  <span
                    key={chip}
                    className="rounded-full border border-ivory/20 bg-ivory/5 px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-ivory/80 backdrop-blur-md"
                  >
                    {chip}
                  </span>
                ))}
              </div>
            </Reveal>
          )}
        </div>
      </section>
    );
  }

  // cinematic (full-bleed)
  return (
    <section
      className={`relative flex min-h-[62vh] overflow-hidden ${
        align === "center" ? "items-center justify-center text-center" : "items-end"
      }`}
    >
      {image && (
        <motion.div
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.6, ease: EASE }}
          className="absolute inset-0"
        >
          <OptimizedImage src={image} alt={imageAlt} priority sizes="100vw" className={OBJECT_POSITIONS[imagePosition] ?? "object-center"} />
        </motion.div>
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-forest-950 via-forest-950/35 to-forest-950/25" />
      <div className="absolute inset-0 bg-gradient-to-r from-forest-950/30 to-transparent" />

      <div
        className={`relative z-10 mx-auto w-full max-w-[1440px] px-5 pb-14 pt-32 md:px-10 md:pb-20 ${
          align === "center" ? "flex flex-col items-center" : ""
        }`}
      >
        {eyebrow && (
          <Reveal>
            <Eyebrow>{eyebrow}</Eyebrow>
          </Reveal>
        )}
        <Reveal delay={0.1}>
          <div className="max-w-5xl">
            <Title title={title} accent={accent} />
          </div>
        </Reveal>
        {subtitle && (
          <Reveal delay={0.2}>
            <p className={`mt-6 text-base leading-relaxed text-sage-200 md:text-xl ${align === "center" ? "mx-auto max-w-2xl" : "max-w-2xl"}`}>
              {subtitle}
            </p>
          </Reveal>
        )}
        {(chips || cta || secondaryCta) && (
          <Reveal delay={0.28}>
            <div className={`mt-8 flex flex-wrap gap-2 ${align === "center" ? "justify-center" : ""}`}>
              {chips?.map((chip) => (
                <span
                  key={chip}
                  className="rounded-full border border-ivory/20 bg-ivory/10 px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-ivory/85 backdrop-blur-md"
                >
                  {chip}
                </span>
              ))}
            </div>
          </Reveal>
        )}
        {(cta || secondaryCta) && (
          <Reveal delay={0.34}>
            <div className={`mt-7 flex flex-wrap gap-3 ${align === "center" ? "justify-center" : ""}`}>
              {cta && <CtaButton cta={cta} />}
              {secondaryCta && <CtaButton cta={secondaryCta} variant="ghost" />}
            </div>
          </Reveal>
        )}
      </div>
    </section>
  );
}

function CtaButtonDark({ cta }: { cta: Cta }) {
  const inner = (
    <>
      {cta.label}
      <span className="flex h-9 w-9 items-center justify-center rounded-full bg-ivory text-forest-900 transition-transform duration-500 group-hover:rotate-45">
        →
      </span>
    </>
  );
  const cls =
    "group inline-flex items-center gap-3 rounded-full bg-forest-900 py-2.5 pl-6 pr-2 text-[13px] font-semibold tracking-wide text-ivory hover:bg-forest-700 transition-colors duration-300";
  return cta.external ? (
    <a href={cta.href} target="_blank" rel="noopener noreferrer" className={cls}>{inner}</a>
  ) : (
    <Link href={cta.href} className={cls}>{inner}</Link>
  );
}

function CtaGhostDark({ cta }: { cta: Cta }) {
  const cls =
    "inline-flex items-center rounded-full border border-forest-900/25 px-6 py-4 text-[13px] font-semibold tracking-wide text-forest-900 hover:bg-forest-900 hover:text-ivory transition-colors duration-300";
  return cta.external ? (
    <a href={cta.href} target="_blank" rel="noopener noreferrer" className={cls}>{cta.label}</a>
  ) : (
    <Link href={cta.href} className={cls}>{cta.label}</Link>
  );
}
