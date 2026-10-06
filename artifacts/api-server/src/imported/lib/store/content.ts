import { migrationLogger as log } from "@/migration-logger";
import { unstable_cache } from "@/cache";
import { supabaseAdmin } from "@/imported/lib/supabase";
import {
  experiences as staticExperiences,
  lakes as staticLakes,
  contact as staticContact,
  site as staticSite,
  type Experience,
  type Lake,
} from "@/imported/data/site";

// ---------- Row mapping ----------

type ExperienceRow = {
  slug: string;
  name: string;
  accent: string | null;
  category: string | null;
  description: string | null;
  image: string | null;
  gallery: string[];
  intro: string[];
  highlights: { title: string; detail: string }[];
  note: string | null;
  cta: string | null;
  href: string | null;
  booking_url: string | null;
  booking_label: string | null;
  booking_external: boolean;
  in_house_href: string | null;
  in_house_label: string | null;
  seo_title: string | null;
  seo_description: string | null;
  og_image: string | null;
  active: boolean;
  sort: number;
};

type LakeRow = {
  slug: string;
  number: string | null;
  name: string;
  tagline: string | null;
  category: string | null;
  description: string | null;
  image: string | null;
  species: string[];
  features: string[];
  status: "open" | "renovation";
  status_note: string | null;
  booking_url: string | null;
  booking_label: string | null;
  seo_title: string | null;
  seo_description: string | null;
  og_image: string | null;
  sort: number;
};

function mapExperience(r: ExperienceRow): Experience {
  return {
    slug: r.slug,
    name: r.name,
    accent: r.accent ?? "",
    category: r.category ?? "",
    description: r.description ?? "",
    image: r.image ?? "",
    gallery: r.gallery ?? [],
    intro: r.intro ?? [],
    highlights: r.highlights ?? [],
    note: r.note ?? undefined,
    cta: r.cta ?? "",
    href: r.href ?? `/experiences/${r.slug}`,
    bookingUrl: r.booking_url ?? undefined,
    bookingLabel: r.booking_label ?? undefined,
    bookingExternal: r.booking_external,
    inHouseHref: r.in_house_href ?? undefined,
    inHouseLabel: r.in_house_label ?? undefined,
    seoTitle: r.seo_title ?? undefined,
    seoDescription: r.seo_description ?? undefined,
    ogImage: r.og_image ?? undefined,
  };
}

function mapLake(r: LakeRow): Lake {
  return {
    slug: r.slug,
    number: r.number ?? "",
    name: r.name,
    tagline: r.tagline ?? "",
    category: r.category ?? "",
    description: r.description ?? "",
    image: r.image ?? "",
    species: r.species ?? [],
    features: r.features ?? [],
    status: r.status,
    statusNote: r.status_note ?? undefined,
    bookingUrl: r.booking_url ?? undefined,
    bookingLabel: r.booking_label ?? undefined,
    seoTitle: r.seo_title ?? undefined,
    seoDescription: r.seo_description ?? undefined,
    ogImage: r.og_image ?? undefined,
  };
}

// ---------- Public reads (with static fallback) ----------

export async function getExperiences(): Promise<Experience[]> {
  try {
    const { data } = await supabaseAdmin()
      .from("experiences")
      .select("*")
      .eq("active", true)
      .order("sort");
    if (data && data.length > 0) return (data as ExperienceRow[]).map(mapExperience);
  } catch (err) {
    log.warn("[content] experiences fallback to static", err);
  }
  return staticExperiences;
}

export async function getExperience(slug: string): Promise<Experience | null> {
  const all = await getExperiences();
  return all.find((e) => e.slug === slug) ?? null;
}

export async function getLakes(): Promise<Lake[]> {
  try {
    const { data } = await supabaseAdmin()
      .from("lakes")
      .select("*")
      .order("sort");
    if (data && data.length > 0) return (data as LakeRow[]).map(mapLake);
  } catch (err) {
    log.warn("[content] lakes fallback to static", err);
  }
  return staticLakes;
}

export async function getLake(slug: string): Promise<Lake | null> {
  const all = await getLakes();
  return all.find((l) => l.slug === slug) ?? null;
}

export type SiteSettings = {
  phone: string;
  phoneHref: string;
  whatsappHref: string;
  email: string;
  eventsEmail: string;
  address: string;
  mapsUrl: string;
  what3words: string;
  noticeEnabled: boolean;
  noticeText: string;
  seoTitle: string;
  seoDescription: string;
  seoOgImage: string;
};

export const DEFAULT_SEO = {
  title: "Willow Garth Country Park — Fishing, Sauna & Dip, Camping & Events near Doncaster",
  description:
    "Time to relax & unwind at Willow Garth — a 3-lake, 6-acre country park near Doncaster offering coarse & specimen fishing, wood-fired sauna & cold-water dip, wild camping and events.",
  ogImage: "/images/home-aerial.jpg",
};

export const getSettings = async (): Promise<SiteSettings> => getSettingsUncached();

/** Cached version for layouts/shared chrome — purged on settings save. */
export const getCachedSettings = unstable_cache(
  async () => getSettingsUncached(),
  ["site-settings"],
  { tags: ["site-settings"], revalidate: 3600 }
);

async function getSettingsUncached(): Promise<SiteSettings> {
  const fallback: SiteSettings = {
    phone: staticContact.phone,
    phoneHref: staticContact.phoneHref,
    whatsappHref: staticContact.whatsappHref,
    email: staticContact.general.email,
    eventsEmail: staticContact.events.email,
    address: staticContact.address.full,
    mapsUrl: staticContact.mapsUrl,
    what3words: staticContact.what3words,
    noticeEnabled: false,
    noticeText: "",
    seoTitle: DEFAULT_SEO.title,
    seoDescription: DEFAULT_SEO.description,
    seoOgImage: DEFAULT_SEO.ogImage,
  };

  try {
    const { data } = await supabaseAdmin()
      .from("site_settings")
      .select("key,value");
    if (!data) return fallback;
    const map = Object.fromEntries(data.map((r) => [r.key, r.value as Record<string, unknown>]));
    const c = map.contact ?? {};
    const n = map.notice ?? {};
    const s = map.seo ?? {};
    return {
      phone: (c.phone as string) ?? fallback.phone,
      phoneHref: (c.phoneHref as string) ?? fallback.phoneHref,
      whatsappHref: (c.whatsappHref as string) ?? fallback.whatsappHref,
      email: (c.email as string) ?? fallback.email,
      eventsEmail: (c.eventsEmail as string) ?? fallback.eventsEmail,
      address: (c.address as string) ?? fallback.address,
      mapsUrl: (c.mapsUrl as string) ?? fallback.mapsUrl,
      what3words: (c.what3words as string) ?? fallback.what3words,
      noticeEnabled: Boolean(n.enabled),
      noticeText: (n.text as string) ?? "",
      seoTitle: (s.title as string) || fallback.seoTitle,
      seoDescription: (s.description as string) || fallback.seoDescription,
      seoOgImage: (s.ogImage as string) || fallback.seoOgImage,
    };
  } catch (err) {
    log.warn("[content] settings fallback to static", err);
    return fallback;
  }
}

// ---------- Admin reads / writes ----------

export async function adminListExperiences(): Promise<ExperienceRow[]> {
  const { data } = await supabaseAdmin()
    .from("experiences")
    .select("*")
    .order("sort");
  return (data as ExperienceRow[]) ?? [];
}

export async function updateExperience(slug: string, patch: Partial<ExperienceRow>): Promise<void> {
  const { error } = await supabaseAdmin()
    .from("experiences")
    .update({ ...patch, updated_at: new Date().toISOString() })
    .eq("slug", slug);
  if (error) throw new Error(error.message);
}

export async function adminListLakes(): Promise<LakeRow[]> {
  const { data } = await supabaseAdmin().from("lakes").select("*").order("sort");
  return (data as LakeRow[]) ?? [];
}

export async function updateLake(slug: string, patch: Partial<LakeRow>): Promise<void> {
  const { error } = await supabaseAdmin()
    .from("lakes")
    .update({ ...patch, updated_at: new Date().toISOString() })
    .eq("slug", slug);
  if (error) throw new Error(error.message);
}

export async function adminGetSettingsRaw(): Promise<Record<string, Record<string, unknown>>> {
  const { data } = await supabaseAdmin().from("site_settings").select("key,value");
  return Object.fromEntries(
    ((data ?? []) as { key: string; value: Record<string, unknown> }[]).map((r) => [
      r.key,
      r.value,
    ])
  );
}

export async function setSetting(key: string, value: Record<string, unknown>): Promise<void> {
  const { error } = await supabaseAdmin()
    .from("site_settings")
    .upsert({ key, value, updated_at: new Date().toISOString() });
  if (error) throw new Error(error.message);
}
