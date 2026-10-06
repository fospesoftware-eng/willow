"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { defaultPages, type PageRecord } from "@/lib/cms/defaults";
import { ImagePicker } from "./ImagePicker";

// ----------------------------- labels --------------------------------------

const SECTION_TITLES: Record<string, string> = {
  hero: "Hero / banner",
  statement: "Opening statement",
  feature: "Feature panel",
  cta: "Call to action band",
  faq: "Frequently asked questions",
  intro: "Intro section",
  rules: "Codes of conduct",
  facilities: "On-site facilities",
  local: "Surrounding area",
  lead: "Lead section",
  community: "Community programmes",
  workshops: "Workshops & events",
  support: "Delivery support",
  groups: "Safety sections",
  pregnancy: "Pregnancy guidance",
  notice: "Important notice",
  panel: "Contact panel",
  hub: "Booking options",
  sections: "Page sections",
};

const FIELD_LABELS: Record<string, string> = {
  eyebrow: "Eyebrow / kicker",
  title: "Title",
  titleBefore: "Title lead-in",
  titleAfter: "Title ending",
  accent: "Accent text",
  subtitle: "Subtitle",
  text: "Body text",
  paragraph: "Paragraph",
  paragraphs: "Paragraphs",
  image: "Image",
  imageAlt: "Image description (alt text)",
  imagePosition: "Image focal point",
  badge: "Badge",
  line1: "Headline line 1",
  line2: "Headline line 2",
  metaLeft: "Side note (left)",
  metaRight: "Side note (right)",
  tags: "Tags",
  chips: "Chips / badges",
  wordmark: "Wordmark (use a new line for two lines)",
  q: "Question",
  a: "Answer",
  name: "Name",
  desc: "Description",
  body: "Text",
  href: "Link URL",
  label: "Link text",
  url: "URL",
  items: "Items",
  highlights: "Highlights",
  facilities: "Facilities list",
  links: "Links",
  options: "Booking options",
  variant: "Hero style",
  align: "Text alignment",
  ctaLabel: "Button text",
  ctaHref: "Button link",
  secondaryLabel: "Second button text",
  secondaryHref: "Second button link",
  primaryLabel: "Primary button text",
  primaryHref: "Primary button link",
  statValue: "Stat value",
  statLabel: "Stat label",
  quote: "Quote",
  id: "Section anchor id",
  updated: "Last updated label",
  heading: "Heading",
  bullets: "Bullet points",
  mapNote: "Map note",
  successTitle: "Success title",
  successText: "Success message",
  avatars: "Thumbnail images",
  avatarBadge: "Avatar badge text",
  managerTitle: "Manager role label",
  managerName: "Manager name",
  managerEmail: "Manager email",
  note: "Note",
  altHref: "Secondary link URL",
  altLabel: "Secondary link text",
  ogImage: "Social share image",
};

const LONG_KEYS = new Set([
  "text",
  "paragraph",
  "a",
  "body",
  "desc",
  "subtitle",
  "quote",
  "wordmark",
  "successText",
  "mapNote",
  "notice",
]);

const IMAGEISH = /(image|avatar|ogimage|^image$)/i;
const isImageKey = (k: string) => IMAGEISH.test(k);
const humanize = (k: string) =>
  FIELD_LABELS[k] ??
  k
    .replace(/([A-Z])/g, " $1")
    .replace(/[_-]+/g, " ")
    .replace(/^\w/, (c) => c.toUpperCase());

// --------------------------- state types -----------------------------------

type LoadedPage = PageRecord & { updatedAt?: string };

// --------------------------- helpers ---------------------------------------

function blankOf(value: unknown): unknown {
  if (Array.isArray(value)) {
    if (value.length === 0) return [];
    const first = value[0];
    if (typeof first === "object" && first !== null) return [blankOf(first)];
    return [];
  }
  if (typeof value === "object" && value !== null) {
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(value as Record<string, unknown>)) out[k] = blankOf(v);
    return out;
  }
  return "";
}

// --------------------------- field controls --------------------------------

function FieldShell({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.14em] text-forest-600">
        {label}
      </label>
      {children}
      {hint && <p className="mt-1 text-[11px] text-forest-600/70">{hint}</p>}
    </div>
  );
}

const inputCls =
  "w-full rounded-lg border border-forest-900/15 px-3 py-2 text-sm text-forest-900 focus:border-gold focus:outline-none";

function StringField({ k, value, onChange }: { k: string; value: string; onChange: (v: string) => void }) {
  const label = humanize(k);
  if (k === "variant") {
    return (
      <FieldShell label={label}>
        <select value={value} onChange={(e) => onChange(e.target.value)} className={inputCls}>
          <option value="cinematic">Cinematic (full-width photo)</option>
          <option value="split">Split (text + photo side by side)</option>
          <option value="solid">Solid (no photo)</option>
        </select>
      </FieldShell>
    );
  }
  if (k === "align") {
    return (
      <FieldShell label={label}>
        <select value={value} onChange={(e) => onChange(e.target.value)} className={inputCls}>
          <option value="left">Left</option>
          <option value="center">Centred</option>
        </select>
      </FieldShell>
    );
  }
  if (isImageKey(k) && k !== "imagePosition") {
    return <ImagePicker label={label} value={value} onChange={onChange} />;
  }
  const long = LONG_KEYS.has(k) || value.length > 90;
  return (
    <FieldShell label={label} hint={k === "wordmark" ? "Press Enter between the two lines" : undefined}>
      {long ? (
        <textarea
          value={value}
          rows={k === "wordmark" ? 2 : 3}
          onChange={(e) => onChange(e.target.value)}
          className={`${inputCls} resize-y`}
        />
      ) : (
        <input value={value} onChange={(e) => onChange(e.target.value)} className={inputCls} />
      )}
    </FieldShell>
  );
}

function StringListField({ k, value, onChange }: { k: string; value: string[]; onChange: (v: string[]) => void }) {
  const imageList = isImageKey(k);
  return (
    <FieldShell label={humanize(k)}>
      <div className="space-y-2">
        {value.map((v, i) => (
          <div key={i} className="flex items-start gap-2">
            <div className="flex-1">
              {imageList ? (
                <ImagePicker value={v} onChange={(url) => onChange(value.map((x, j) => (j === i ? url : x)))} label="" />
              ) : (
                <input
                  value={v}
                  onChange={(e) => onChange(value.map((x, j) => (j === i ? e.target.value : x)))}
                  className={inputCls}
                />
              )}
            </div>
            <button
              type="button"
              onClick={() => onChange(value.filter((_, j) => j !== i))}
              className="mt-1 rounded-md px-2 py-1 text-sm text-red-700 hover:bg-red-50"
              aria-label="Remove"
            >
              ✕
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() => onChange([...value, ""])}
          className="rounded-lg border border-dashed border-forest-900/30 px-3 py-1.5 text-xs font-semibold text-forest-700 hover:bg-forest-900/5"
        >
          + Add item
        </button>
      </div>
    </FieldShell>
  );
}

function ObjectFields({
  value,
  onChange,
  depth,
}: {
  value: Record<string, unknown>;
  onChange: (v: Record<string, unknown>) => void;
  depth: number;
}) {
  return (
    <div className={depth > 0 ? "space-y-4" : "space-y-5"}>
      {Object.entries(value).map(([k, v]) => (
        <Field
          key={k}
          k={k}
          value={v}
          onChange={(nv) => onChange({ ...value, [k]: nv })}
          depth={depth}
        />
      ))}
    </div>
  );
}

function RepeaterField({
  k,
  value,
  onChange,
  depth,
}: {
  k: string;
  value: Record<string, unknown>[];
  onChange: (v: Record<string, unknown>[]) => void;
  depth: number;
}) {
  return (
    <div>
      <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-forest-600">
        {humanize(k)}
      </p>
      <div className="space-y-3">
        {value.map((item, i) => (
          <div key={i} className="rounded-xl border border-forest-900/10 bg-white p-4">
            <div className="mb-3 flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-widest text-forest-600">
                {String(item.title || item.name || item.q || item.heading || `Item ${i + 1}`)}
              </span>
              <div className="flex gap-1">
                <button
                  type="button"
                  disabled={i === 0}
                  onClick={() => onChange(value.map((x, j) => (j === i - 1 ? value[i] : j === i ? value[i - 1] : x)))}
                  className="rounded px-2 py-1 text-xs text-forest-600 enabled:hover:bg-forest-900/5 disabled:opacity-30"
                >
                  ↑
                </button>
                <button
                  type="button"
                  disabled={i === value.length - 1}
                  onClick={() => onChange(value.map((x, j) => (j === i + 1 ? value[i] : j === i ? value[i + 1] : x)))}
                  className="rounded px-2 py-1 text-xs text-forest-600 enabled:hover:bg-forest-900/5 disabled:opacity-30"
                >
                  ↓
                </button>
                <button
                  type="button"
                  onClick={() => onChange(value.filter((_, j) => j !== i))}
                  className="rounded px-2 py-1 text-xs text-red-700 hover:bg-red-50"
                >
                  ✕
                </button>
              </div>
            </div>
            <ObjectFields value={item} onChange={(nv) => onChange(value.map((x, j) => (j === i ? nv : x)))} depth={depth + 1} />
          </div>
        ))}
        <button
          type="button"
          onClick={() =>
            onChange([...value, blankOf(value[0] ?? {}) as Record<string, unknown>])
          }
          className="w-full rounded-xl border border-dashed border-forest-900/30 py-2.5 text-xs font-semibold text-forest-700 hover:bg-forest-900/5"
        >
          + Add {humanize(k).toLowerCase().replace(/s$/, "")}
        </button>
      </div>
    </div>
  );
}

function Field({
  k,
  value,
  onChange,
  depth,
}: {
  k: string;
  value: unknown;
  onChange: (v: unknown) => void;
  depth: number;
}) {
  if (typeof value === "string") {
    return <StringField k={k} value={value} onChange={onChange} />;
  }
  if (typeof value === "number" || typeof value === "boolean") {
    return (
      <FieldShell label={humanize(k)}>
        <input
          value={String(value)}
          onChange={(e) => onChange(e.target.value)}
          className={inputCls}
        />
      </FieldShell>
    );
  }
  if (Array.isArray(value)) {
    if (value.every((x) => typeof x === "string")) {
      return <StringListField k={k} value={value as string[]} onChange={onChange as (v: string[]) => void} />;
    }
    if (value.every((x) => typeof x === "object" && x !== null)) {
      return (
        <RepeaterField
          k={k}
          value={value as Record<string, unknown>[]}
          onChange={onChange as (v: Record<string, unknown>[]) => void}
          depth={depth}
        />
      );
    }
  }
  if (typeof value === "object" && value !== null) {
    return (
      <div className={`rounded-xl ${depth > 0 ? "bg-cream/60 p-3" : ""}`}>
        <ObjectFields
          value={value as Record<string, unknown>}
          onChange={onChange as (v: Record<string, unknown>) => void}
          depth={depth}
        />
      </div>
    );
  }
  return null;
}

// --------------------------- SEO preview -----------------------------------

function SerpPreview({ title, description, path }: { title: string; description: string; path: string }) {
  return (
    <div className="rounded-xl border border-forest-900/10 bg-white p-5">
      <p className="text-xs text-forest-600">
        {typeof window !== "undefined" ? window.location.host : "willowgarthcountrypark.co.uk"}
        {path === "/" ? "" : path}
      </p>
      <p
        className={`mt-1 text-lg leading-snug text-[#1a0dab] ${title.length > 60 ? "line-clamp-1" : ""}`}
      >
        {title || "Page title"}
      </p>
      <p className={`mt-1 text-sm text-[#4d5156] ${description.length > 160 ? "line-clamp-2" : ""}`}>
        {description || "Page description shown in search results."}
      </p>
      <div className="mt-3 flex gap-4 text-[11px]">
        <span className={title.length > 60 ? "font-semibold text-amber-700" : "text-forest-600"}>
          Title: {title.length}/60
        </span>
        <span className={description.length > 160 ? "font-semibold text-amber-700" : "text-forest-600"}>
          Description: {description.length}/155
        </span>
      </div>
    </div>
  );
}

// --------------------------- main panel ------------------------------------

export function PagesPanel() {
  const [slug, setSlug] = useState(defaultPages[0].slug);
  const [page, setPage] = useState<LoadedPage | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<{ kind: "ok" | "err"; text: string } | null>(null);

  const load = useCallback(async (s: string) => {
    setLoading(true);
    setMsg(null);
    const res = await fetch(`/api/admin/pages/${s}`, { cache: "no-store" });
    if (res.status === 401) {
      window.location.href = "/admin/login";
      return;
    }
    const data = await res.json();
    setPage(data.page as LoadedPage);
    setLoading(false);
  }, []);

  useEffect(() => {
    load(slug);
  }, [slug, load]);

  const sortedRegistry = useMemo(
    () => [...defaultPages].sort((a, b) => a.label.localeCompare(b.label)),
    []
  );

  function updateContent(key: string, value: unknown) {
    setPage((p) => (p ? { ...p, content: { ...p.content, [key]: value } } : p));
  }

  async function save(reset = false) {
    if (!page) return;
    setSaving(true);
    setMsg(null);
    const body = reset
      ? { content: {}, seoTitle: "", seoDescription: "", ogImage: "" }
      : {
          content: page.content,
          seoTitle: page.seo.seoTitle,
          seoDescription: page.seo.seoDescription,
          ogImage: page.seo.ogImage,
        };
    const res = await fetch(`/api/admin/pages/${page.slug}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    setSaving(false);
    if (res.ok) {
      setMsg({ kind: "ok", text: reset ? "Reset to default content." : "Saved — changes are live." });
      await load(page.slug);
    } else {
      const d = await res.json().catch(() => ({}));
      setMsg({ kind: "err", text: d.error || "Save failed" });
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[220px_1fr]">
      {/* Page list */}
      <div>
        <h2 className="mb-3 font-display text-lg font-bold text-forest-900">Pages</h2>
        <nav className="space-y-1">
          {sortedRegistry.map((p) => (
            <button
              key={p.slug}
              onClick={() => setSlug(p.slug)}
              className={`block w-full rounded-lg px-3 py-2 text-left text-sm transition ${
                slug === p.slug
                  ? "bg-forest-900 font-semibold text-ivory"
                  : "text-forest-800 hover:bg-forest-900/5"
              }`}
            >
              {p.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Editor */}
      <div>
        {loading || !page ? (
          <p className="py-10 text-center text-sm text-forest-600">Loading page…</p>
        ) : (
          <div className="space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="font-display text-xl font-bold text-forest-900">{page.label}</h2>
                <a
                  href={page.path}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs text-forest-600 underline hover:text-gold"
                >
                  View page ↗
                </a>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    if (confirm("Reset this page to the original default content? Your changes will be lost."))
                      save(true);
                  }}
                  className="rounded-lg border border-forest-900/20 px-4 py-2 text-xs font-semibold text-forest-800 hover:bg-forest-900/5"
                >
                  Reset to defaults
                </button>
                <button
                  onClick={() => save(false)}
                  disabled={saving}
                  className="rounded-lg bg-gold px-6 py-2 text-xs font-bold uppercase tracking-widest text-forest-950 hover:bg-gold-light disabled:opacity-50"
                >
                  {saving ? "Saving…" : "Save changes"}
                </button>
              </div>
            </div>

            {msg && (
              <p
                className={`rounded-lg p-3 text-sm ${
                  msg.kind === "ok"
                    ? "border border-green-200 bg-green-50 text-green-800"
                    : "border border-red-200 bg-red-50 text-red-800"
                }`}
              >
                {msg.text}
              </p>
            )}

            {/* Content sections */}
            {Object.entries(page.content).map(([key, value]) => (
              <details key={key} open={key === "hero"} className="group overflow-hidden rounded-2xl border border-forest-900/10 bg-white shadow-card">
                <summary className="flex cursor-pointer list-none items-center justify-between px-6 py-4 hover:bg-cream/50">
                  <span className="font-display text-sm font-bold uppercase tracking-[0.12em] text-forest-900">
                    {SECTION_TITLES[key] ?? humanize(key)}
                  </span>
                  <span className="text-xs text-forest-600 group-open:rotate-180 transition-transform">▾</span>
                </summary>
                <div className="border-t border-forest-900/10 p-6">
                  <Field k={key} value={value} onChange={(nv) => updateContent(key, nv)} depth={0} />
                </div>
              </details>
            ))}

            {/* SEO */}
            <details className="overflow-hidden rounded-2xl border-2 border-gold/40 bg-white shadow-card">
              <summary className="flex cursor-pointer list-none items-center justify-between px-6 py-4 hover:bg-cream/50">
                <span className="font-display text-sm font-bold uppercase tracking-[0.12em] text-forest-900">
                  Search engine listing (SEO)
                </span>
                <span className="text-xs text-forest-600">▾</span>
              </summary>
              <div className="space-y-5 border-t border-forest-900/10 p-6">
                <SerpPreview
                  title={page.seo.seoTitle}
                  description={page.seo.seoDescription}
                  path={page.path}
                />
                <StringField
                  k="seoTitle"
                  value={page.seo.seoTitle}
                  onChange={(v) => setPage({ ...page, seo: { ...page.seo, seoTitle: v } })}
                />
                <StringField
                  k="seoDescription"
                  value={page.seo.seoDescription}
                  onChange={(v) => setPage({ ...page, seo: { ...page.seo, seoDescription: v } })}
                />
                <ImagePicker
                  label="Social share image (1200×630 recommended)"
                  value={page.seo.ogImage}
                  onChange={(v) => setPage({ ...page, seo: { ...page.seo, ogImage: v } })}
                />
              </div>
            </details>

            <div className="flex justify-end pb-10">
              <button
                onClick={() => save(false)}
                disabled={saving}
                className="rounded-lg bg-gold px-8 py-3 text-xs font-bold uppercase tracking-widest text-forest-950 hover:bg-gold-light disabled:opacity-50"
              >
                {saving ? "Saving…" : "Save changes"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
