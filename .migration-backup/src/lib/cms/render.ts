import type { CmsHero } from "./defaults";

export type PageHeroProps = {
  variant?: "cinematic" | "split" | "solid";
  eyebrow?: string;
  title: string;
  accent?: string;
  subtitle?: string;
  image?: string;
  imageAlt?: string;
  imagePosition?: string;
  align?: "left" | "center";
  chips?: string[];
  cta?: { label: string; href: string; external?: boolean };
  secondaryCta?: { label: string; href: string; external?: boolean };
  stat?: { value: string; label: string };
};

const isExternal = (href: string) => /^https?:|^mailto:|^tel:/.test(href);

export function heroProps(h: Partial<CmsHero> | undefined): PageHeroProps {
  if (!h) return { title: "" };
  return {
    variant: h.variant ?? "cinematic",
    align: h.align ?? "left",
    eyebrow: h.eyebrow,
    title: h.title ?? "",
    accent: h.accent,
    subtitle: h.subtitle,
    image: h.image || undefined,
    imageAlt: h.imageAlt,
    imagePosition: h.imagePosition || undefined,
    chips: h.chips?.length ? h.chips : undefined,
    cta: h.ctaLabel && h.ctaHref ? { label: h.ctaLabel, href: h.ctaHref, external: isExternal(h.ctaHref) } : undefined,
    secondaryCta: h.secondaryLabel && h.secondaryHref
      ? { label: h.secondaryLabel, href: h.secondaryHref, external: isExternal(h.secondaryHref) }
      : undefined,
    stat: h.statValue && h.statLabel ? { value: h.statValue, label: h.statLabel } : undefined,
  };
}
