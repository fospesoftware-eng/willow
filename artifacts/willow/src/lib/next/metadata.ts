export type Metadata = {
  title?: string | { default?: string; template?: string; absolute?: string };
  description?: string;
  keywords?: string[];
  alternates?: { canonical?: string };
  openGraph?: Record<string, unknown> & { images?: { url: string; width?: number; height?: number; alt?: string }[] };
  twitter?: Record<string, unknown> & { images?: string[] };
  [k: string]: unknown;
};
const TEMPLATE = "%s · Willow Garth Country Park";

function meta(attr: "name" | "property", key: string, content?: string) {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (content === undefined || content === "") {
    el?.remove();
    return;
  }
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

export function applyMetadata(md: Metadata | undefined, base?: Metadata) {
  const m: Metadata = { ...(base ?? {}), ...(md ?? {}) };
  const t = m.title;
  let title = "";
  if (typeof t === "string") title = (base && typeof base.title === "object" && base.title.template ? base.title.template : TEMPLATE).replace("%s", t);
  else if (t) title = t.absolute ?? t.default ?? "";
  if (title) document.title = title;
  meta("name", "description", m.description);
  meta("name", "keywords", m.keywords?.join(", "));
  const og = m.openGraph ?? {};
  meta("property", "og:title", og.title as string | undefined);
  meta("property", "og:description", og.description as string | undefined);
  meta("property", "og:url", og.url as string | undefined);
  meta("property", "og:site_name", og.siteName as string | undefined);
  meta("property", "og:type", og.type as string | undefined);
  meta("property", "og:locale", og.locale as string | undefined);
  meta("property", "og:image", og.images?.[0]?.url);
  const tw = m.twitter ?? {};
  meta("name", "twitter:card", tw.card as string | undefined);
  meta("name", "twitter:title", tw.title as string | undefined);
  meta("name", "twitter:description", tw.description as string | undefined);
  meta("name", "twitter:image", tw.images?.[0]);
  let link = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  const canon = m.alternates?.canonical;
  if (!canon) link?.remove();
  else {
    if (!link) {
      link = document.createElement("link");
      link.rel = "canonical";
      document.head.appendChild(link);
    }
    link.href = canon;
  }
}
