import type { Metadata } from "@/lib/next/metadata";
import { getBootstrap } from "@/lib/store/bootstrap";
import { getDefaultPage, type PageRecord, type SeoFields } from "@/lib/cms/defaults";

// ---------- Deep merge (arrays are replaced, not concatenated) -----------

function isPlainObject(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null && !Array.isArray(v);
}

export function deepMerge<T>(base: T, override: unknown): T {
  if (!isPlainObject(base) || !isPlainObject(override)) {
    return (override === undefined ? base : (override as T));
  }
  const out: Record<string, unknown> = { ...(base as Record<string, unknown>) };
  for (const key of Object.keys(override)) {
    const b = (base as Record<string, unknown>)[key];
    const o = override[key];
    out[key] = isPlainObject(b) && isPlainObject(o) ? deepMerge(b, o) : o;
  }
  return out as T;
}

// ---------- Types ----------

export type PageRow = {
  slug: string;
  label: string;
  path: string;
  seo_title: string | null;
  seo_description: string | null;
  og_image: string | null;
  content: Record<string, unknown>;
  updated_at: string;
};

export type ResolvedPage = PageRecord & { updatedAt?: string };

export async function getPage(slug: string): Promise<ResolvedPage> {
  const boot = getBootstrap().pages?.[slug] as ResolvedPage | undefined;
  if (boot) return boot;
  const fallback = getDefaultPage(slug);
  if (!fallback) throw new Error(`Unknown page: ${slug}`);
  return fallback;
}

// ---------- Metadata ----------

const SITE_URL = "https://willowgarthcountrypark.co.uk";

export function absoluteUrl(src: string): string {
  if (!src) return "";
  if (src.startsWith("http")) return src;
  return `${SITE_URL}${src.startsWith("/") ? "" : "/"}${src}`;
}

export function pageMetadata(
  page: ResolvedPage,
  canonicalPath: string
): Metadata {
  const title = page.seo.seoTitle;
  const description = page.seo.seoDescription;
  const og = page.seo.ogImage ? absoluteUrl(page.seo.ogImage) : undefined;
  return {
    title: { absolute: title },
    description,
    alternates: { canonical: `${SITE_URL}${canonicalPath}` },
    openGraph: {
      title,
      description,
      url: `${SITE_URL}${canonicalPath}`,
      siteName: "Willow Garth Country Park",
      type: "website",
      ...(og ? { images: [{ url: og, width: 1200, height: 630, alt: title }] } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      ...(og ? { images: [og] } : {}),
    },
  };
}

/** Metadata for CMS-managed lakes/experiences, falling back to generated values. */
export function entityMetadata(
  canonicalPath: string,
  fallbackTitle: string,
  fallbackDescription: string,
  seo?: { seoTitle?: string; seoDescription?: string; ogImage?: string; fallbackImage?: string }
): Metadata {
  const title = seo?.seoTitle || fallbackTitle;
  const description = seo?.seoDescription || fallbackDescription;
  const img = seo?.ogImage || seo?.fallbackImage || "";
  const og = img ? absoluteUrl(img) : undefined;
  return {
    title: { absolute: title },
    description,
    alternates: { canonical: `${SITE_URL}${canonicalPath}` },
    openGraph: {
      title,
      description,
      url: `${SITE_URL}${canonicalPath}`,
      siteName: "Willow Garth Country Park",
      type: "website",
      ...(og ? { images: [{ url: og, width: 1200, height: 630, alt: title }] } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      ...(og ? { images: [og] } : {}),
    },
  };
}
