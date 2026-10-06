import type { Experience, Lake } from "@/data/site";
import type { SiteSettings } from "@/lib/store/content";

export type Bootstrap = {
  settings?: SiteSettings;
  lakes?: Lake[];
  experiences?: Experience[];
  pages?: Record<string, unknown>;
};

let data: Bootstrap = {};

export function getBootstrap(): Bootstrap {
  return data;
}

export async function loadBootstrap(): Promise<Bootstrap> {
  try {
    const res = await fetch("/api/content/bootstrap", { cache: "no-store" });
    if (!res.ok) throw new Error(`Content service returned ${res.status}`);
    data = (await res.json()) as Bootstrap;
  } catch (err) {
    console.warn("[content] bootstrap unavailable, using bundled defaults", err);
  }
  return data;
}
