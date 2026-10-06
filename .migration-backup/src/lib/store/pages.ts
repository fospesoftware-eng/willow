import type { Metadata } from "next";
import { supabaseAdmin } from "@/lib/supabase";
import { defaultPages, getDefaultPage, type PageRecord, type SeoFields } from "@/lib/cms/defaults";

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

// ---------- Reads ----------

export async function listPagesFromDb(): Promise<
  Pick<PageRow, "slug" | "label" | "path" | "updated_at">[]
> {
  const { data } = await supabaseAdmin()
    .from("pages")
    .select("slug,label,path,updated_at")
    .order("label");
  return (
    (data as Pick<PageRow, "slug" | "label" | "path" | "updated_at">[] | null) ?? []
  );
}

async function getPageRow(slug: string): Promise<PageRow | null> {
  const { data } = await supabaseAdmin()
    .from("pages")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();
  return (data as PageRow | null) ?? null;
}

/**
 * Returns the fully-merged page (CMS overrides on top of bundled defaults).
 * Never throws — falls back to defaults if Supabase is unavailable.
 */
export async function getPage(slug: string): Promise<ResolvedPage> {
  const fallback = getDefaultPage(slug);
  if (!fallback) throw new Error(`Unknown page: ${slug}`);

  try {
    const row = await getPageRow(slug);
    if (!row) return fallback;

    const seo: SeoFields = {
      seoTitle: row.seo_title || fallback.seo.seoTitle,
      seoDescription: row.seo_description || fallback.seo.seoDescription,
      ogImage: row.og_image || fallback.seo.ogImage,
    };
    const content =
      row.content && Object.keys(row.content).length > 0
        ? deepMerge(fallback.content, row.content)
        : fallback.content;

    return { ...fallback, seo, content, updatedAt: row.updated_at };
  } catch (err) {
    console.warn(`[cms] page "${slug}" fallback to defaults`, err);
    return fallback;
  }
}

// ---------- Writes ----------

export async function savePage(
  slug: string,
  patch: {
    seoTitle?: string;
    seoDescription?: string;
    ogImage?: string;
    content?: Record<string, unknown>;
  }
): Promise<void> {
  const def = getDefaultPage(slug);
  if (!def) throw new Error("Unknown page");

  const update: Record<string, unknown> = { updated_at: new Date().toISOString() };
  if (patch.seoTitle !== undefined) update.seo_title = patch.seoTitle;
  if (patch.seoDescription !== undefined) update.seo_description = patch.seoDescription;
  if (patch.ogImage !== undefined) update.og_image = patch.ogImage;
  if (patch.content !== undefined) update.content = patch.content;

  const { error } = await supabaseAdmin()
    .from("pages")
    .update(update)
    .eq("slug", slug);

  if (error) {
    if (/No rows|0 rows/i.test(error.message)) {
      // Row missing — upsert with full identity
      const { error: insErr } = await supabaseAdmin()
        .from("pages")
        .upsert({
          slug,
          label: def.label,
          path: def.path,
          seo_title: patch.seoTitle ?? def.seo.seoTitle,
          seo_description: patch.seoDescription ?? def.seo.seoDescription,
          og_image: patch.ogImage ?? def.seo.ogImage,
          content: patch.content ?? {},
        });
      if (insErr) throw new Error(insErr.message);
      return;
    }
    throw new Error(error.message);
  }
}

/** Ensure all known pages exist (called by admin list view harmlessly). */
export async function ensurePageRows(): Promise<void> {
  const rows = defaultPages.map((p) => ({
    slug: p.slug,
    label: p.label,
    path: p.path,
    seo_title: p.seo.seoTitle,
    seo_description: p.seo.seoDescription,
    og_image: p.seo.ogImage,
    content: {},
  }));
  const { error } = await supabaseAdmin().from("pages").upsert(rows, {
    onConflict: "slug",
    ignoreDuplicates: true,
  });
  if (error) console.warn("[cms] ensurePageRows", error.message);
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
