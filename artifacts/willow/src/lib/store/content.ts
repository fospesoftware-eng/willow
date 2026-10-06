import { getBootstrap } from "@/lib/store/bootstrap";
import {
  experiences as staticExperiences,
  lakes as staticLakes,
  contact as staticContact,
  type Experience,
  type Lake,
} from "@/data/site";

// ---------- Public reads (with static fallback) ----------

export async function getExperiences(): Promise<Experience[]> {
  const b = getBootstrap().experiences;
  return b && b.length > 0 ? b : staticExperiences;
}

export async function getExperience(slug: string): Promise<Experience | null> {
  const all = await getExperiences();
  return all.find((e) => e.slug === slug) ?? null;
}

export async function getLakes(): Promise<Lake[]> {
  const b = getBootstrap().lakes;
  return b && b.length > 0 ? b : staticLakes;
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

export const getSettings = async (): Promise<SiteSettings> => getSettingsSync();
export const getCachedSettings = getSettings;

export function getSettingsSync(): SiteSettings {
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
  return { ...fallback, ...(getBootstrap().settings ?? {}) };
}
