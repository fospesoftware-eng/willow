"use client";

import { useEffect, useState } from "react";
import { ImagePicker } from "./ImagePicker";

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
  booking_url: string | null;
  booking_label: string | null;
  in_house_href: string | null;
  in_house_label: string | null;
  seo_title: string | null;
  seo_description: string | null;
  og_image: string | null;
  active: boolean;
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
};

const inputCls =
  "w-full rounded-lg border border-forest-900/15 bg-white px-3 py-2 text-sm text-forest-900 outline-none transition focus:border-gold";
const labelCls = "mb-1 block text-[0.65rem] font-bold uppercase tracking-wider text-forest-500";

export function ContentPanel() {
  const [kind, setKind] = useState<"experiences" | "lakes">("experiences");
  return (
    <div>
      <div className="mb-5 inline-flex rounded-full border border-forest-900/15 bg-white p-1">
        {(["experiences", "lakes"] as const).map((k) => (
          <button
            key={k}
            onClick={() => setKind(k)}
            className={`rounded-full px-5 py-1.5 text-xs font-bold uppercase tracking-wider transition ${
              kind === k ? "bg-forest-900 text-ivory" : "text-forest-700"
            }`}
          >
            {k}
          </button>
        ))}
      </div>
      {kind === "experiences" ? <ExperiencesEditor /> : <LakesEditor />}
    </div>
  );
}

function ExperiencesEditor() {
  const [rows, setRows] = useState<ExperienceRow[]>([]);
  const [open, setOpen] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/admin/experiences", { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : { experiences: [] }))
      .then((d) => setRows(d.experiences ?? []));
  }, []);

  return (
    <div className="space-y-3">
      {rows.map((r) => (
        <div key={r.slug} className="overflow-hidden rounded-xl border border-forest-900/10 bg-white shadow-card">
          <button
            onClick={() => setOpen(open === r.slug ? null : r.slug)}
            className="flex w-full items-center gap-4 px-5 py-4 text-left hover:bg-cream/40"
          >
            <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-lg bg-forest-100">
              {r.image?.startsWith("/") ? (
                <img src={r.image} alt="" className="h-full w-full object-cover" />
              ) : null}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-bold text-forest-900">{r.name}</p>
              <p className="truncate text-xs text-forest-500">/{r.slug} · {r.category}</p>
            </div>
            {!r.active && (
              <span className="rounded-full bg-stone-200 px-2.5 py-1 text-[0.6rem] font-bold uppercase tracking-wider text-stone-600">
                hidden
              </span>
            )}
            <span className="text-forest-400">{open === r.slug ? "▲" : "▼"}</span>
          </button>
          {open === r.slug && <ExperienceForm row={r} onSaved={() => {}} />}
        </div>
      ))}
    </div>
  );
}

function ExperienceForm({ row }: { row: ExperienceRow; onSaved: () => void }) {
  const [f, setF] = useState({
    ...row,
    galleryText: (row.gallery ?? []).join("\n"),
    introText: (row.intro ?? []).join("\n\n"),
    highlightsText: (row.highlights ?? []).map((h) => `${h.title} | ${h.detail}`).join("\n"),
  });
  const [state, setState] = useState<"idle" | "saving" | "saved" | "error">("idle");

  function set<K extends keyof typeof f>(k: K, v: (typeof f)[K]) {
    setF((p) => ({ ...p, [k]: v }));
  }

  async function save() {
    setState("saving");
    const payload = {
      slug: row.slug,
      name: f.name,
      accent: f.accent,
      category: f.category,
      description: f.description,
      image: f.image,
      note: f.note,
      cta: f.cta,
      booking_url: f.booking_url,
      booking_label: f.booking_label,
      in_house_href: f.in_house_href,
      in_house_label: f.in_house_label,
      seo_title: f.seo_title,
      seo_description: f.seo_description,
      og_image: f.og_image,
      active: f.active,
      gallery: f.galleryText.split("\n").map((s) => s.trim()).filter(Boolean),
      intro: f.introText.split(/\n\s*\n/).map((s) => s.trim()).filter(Boolean),
      highlights: f.highlightsText
        .split("\n")
        .map((line) => {
          const [title, ...rest] = line.split("|");
          return { title: title?.trim() ?? "", detail: rest.join("|").trim() };
        })
        .filter((h) => h.title),
    };
    const res = await fetch("/api/admin/experiences", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    setState(res.ok ? "saved" : "error");
    if (res.ok) setTimeout(() => setState("idle"), 2500);
  }

  return (
    <div className="space-y-4 border-t border-forest-900/10 bg-cream/30 p-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <div><label className={labelCls}>Name</label><input className={inputCls} value={f.name} onChange={(e) => set("name", e.target.value)} /></div>
        <div><label className={labelCls}>Accent word</label><input className={inputCls} value={f.accent ?? ""} onChange={(e) => set("accent", e.target.value)} /></div>
        <div><label className={labelCls}>Category</label><input className={inputCls} value={f.category ?? ""} onChange={(e) => set("category", e.target.value)} /></div>
        <div><label className={labelCls}>Button text (CTA)</label><input className={inputCls} value={f.cta ?? ""} onChange={(e) => set("cta", e.target.value)} /></div>
      </div>
      <div>
        <label className={labelCls}>Short description</label>
        <textarea rows={2} className={inputCls} value={f.description ?? ""} onChange={(e) => set("description", e.target.value)} />
      </div>
      <div>
        <ImagePicker label="Hero image" value={f.image ?? ""} onChange={(v) => set("image", v)} />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className={labelCls}>Intro paragraphs (blank line between each)</label>
          <textarea rows={5} className={inputCls} value={f.introText} onChange={(e) => set("introText", e.target.value)} />
        </div>
        <div>
          <label className={labelCls}>Highlights — one per line: Title | Detail</label>
          <textarea rows={5} className={inputCls} value={f.highlightsText} onChange={(e) => set("highlightsText", e.target.value)} />
        </div>
      </div>
      <div>
        <label className={labelCls}>Gallery images — one path/URL per line</label>
        <textarea rows={3} className={inputCls} value={f.galleryText} onChange={(e) => set("galleryText", e.target.value)} />
      </div>
      <div>
        <label className={labelCls}>Notice / safety note</label>
        <textarea rows={2} className={inputCls} value={f.note ?? ""} onChange={(e) => set("note", e.target.value)} />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div><label className={labelCls}>Booking URL</label><input className={inputCls} value={f.booking_url ?? ""} onChange={(e) => set("booking_url", e.target.value)} /></div>
        <div><label className={labelCls}>Booking button label</label><input className={inputCls} value={f.booking_label ?? ""} onChange={(e) => set("booking_label", e.target.value)} /></div>
        <div><label className={labelCls}>In-house booking path</label><input className={inputCls} value={f.in_house_href ?? ""} onChange={(e) => set("in_house_href", e.target.value)} /></div>
        <div><label className={labelCls}>In-house button label</label><input className={inputCls} value={f.in_house_label ?? ""} onChange={(e) => set("in_house_label", e.target.value)} /></div>
      </div>
      <SeoFields
        title={f.seo_title ?? ""}
        description={f.seo_description ?? ""}
        ogImage={f.og_image ?? ""}
        onChange={(patch) => setF((p) => ({ ...p, ...patch }))}
      />
      <label className="flex items-center gap-2 text-sm font-semibold text-forest-800">
        <input type="checkbox" checked={f.active} onChange={(e) => set("active", e.target.checked)} className="h-4 w-4 accent-gold" />
        Published (visible on the website)
      </label>
      <div className="flex items-center gap-4">
        <button
          onClick={save}
          disabled={state === "saving"}
          className="rounded-lg bg-gold px-6 py-2.5 text-xs font-bold uppercase tracking-[0.18em] text-forest-950 transition hover:bg-gold-light disabled:opacity-60"
        >
          {state === "saving" ? "Saving…" : "Save changes"}
        </button>
        {state === "saved" && <span className="text-xs font-semibold text-emerald-700">✓ Saved — live now</span>}
        {state === "error" && <span className="text-xs font-semibold text-red-700">Save failed</span>}
      </div>
    </div>
  );
}

function LakesEditor() {
  const [rows, setRows] = useState<LakeRow[]>([]);
  const [open, setOpen] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/admin/lakes", { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : { lakes: [] }))
      .then((d) => setRows(d.lakes ?? []));
  }, []);

  return (
    <div className="space-y-3">
      {rows.map((r) => (
        <div key={r.slug} className="overflow-hidden rounded-xl border border-forest-900/10 bg-white shadow-card">
          <button
            onClick={() => setOpen(open === r.slug ? null : r.slug)}
            className="flex w-full items-center gap-4 px-5 py-4 text-left hover:bg-cream/40"
          >
            <div className="min-w-0 flex-1">
              <p className="text-sm font-bold text-forest-900">{r.number} · {r.name}</p>
              <p className="truncate text-xs text-forest-500">/{r.slug} · {r.tagline}</p>
            </div>
            <span className={`rounded-full px-2.5 py-1 text-[0.6rem] font-bold uppercase tracking-wider ${
              r.status === "open" ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"
            }`}>
              {r.status}
            </span>
            <span className="text-forest-400">{open === r.slug ? "▲" : "▼"}</span>
          </button>
          {open === r.slug && <LakeForm row={r} />}
        </div>
      ))}
    </div>
  );
}

function LakeForm({ row }: { row: LakeRow }) {
  const [f, setF] = useState({
    ...row,
    speciesText: (row.species ?? []).join(", "),
    featuresText: (row.features ?? []).join("\n"),
  });
  const [state, setState] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const set = (patch: Partial<typeof f>) => setF((p) => ({ ...p, ...patch }));

  async function save() {
    setState("saving");
    const payload = {
      slug: row.slug,
      name: f.name,
      number: f.number,
      tagline: f.tagline,
      category: f.category,
      description: f.description,
      image: f.image,
      status: f.status,
      status_note: f.status_note,
      booking_url: f.booking_url,
      booking_label: f.booking_label,
      seo_title: f.seo_title,
      seo_description: f.seo_description,
      og_image: f.og_image,
      species: f.speciesText.split(",").map((s) => s.trim()).filter(Boolean),
      features: f.featuresText.split("\n").map((s) => s.trim()).filter(Boolean),
    };
    const res = await fetch("/api/admin/lakes", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    setState(res.ok ? "saved" : "error");
    if (res.ok) setTimeout(() => setState("idle"), 2500);
  }

  return (
    <div className="space-y-4 border-t border-forest-900/10 bg-cream/30 p-5">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div><label className={labelCls}>Number</label><input className={inputCls} value={f.number ?? ""} onChange={(e) => set({ number: e.target.value })} /></div>
        <div><label className={labelCls}>Name</label><input className={inputCls} value={f.name} onChange={(e) => set({ name: e.target.value })} /></div>
        <div><label className={labelCls}>Category</label><input className={inputCls} value={f.category ?? ""} onChange={(e) => set({ category: e.target.value })} /></div>
        <div>
          <label className={labelCls}>Status</label>
          <select className={inputCls} value={f.status} onChange={(e) => set({ status: e.target.value as LakeRow["status"] })}>
            <option value="open">Open</option>
            <option value="renovation">Under renovation</option>
          </select>
        </div>
      </div>
      <div><label className={labelCls}>Tagline</label><input className={inputCls} value={f.tagline ?? ""} onChange={(e) => set({ tagline: e.target.value })} /></div>
      <div><label className={labelCls}>Description</label><textarea rows={3} className={inputCls} value={f.description ?? ""} onChange={(e) => set({ description: e.target.value })} /></div>
      <div><ImagePicker label="Image" value={f.image ?? ""} onChange={(v) => set({ image: v })} /></div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div><label className={labelCls}>Species — comma separated</label><textarea rows={3} className={inputCls} value={f.speciesText} onChange={(e) => set({ speciesText: e.target.value })} /></div>
        <div><label className={labelCls}>Features — one per line</label><textarea rows={3} className={inputCls} value={f.featuresText} onChange={(e) => set({ featuresText: e.target.value })} /></div>
      </div>
      <div><label className={labelCls}>Status note (e.g. renovation dates)</label><input className={inputCls} value={f.status_note ?? ""} onChange={(e) => set({ status_note: e.target.value })} /></div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div><label className={labelCls}>Booking URL</label><input className={inputCls} value={f.booking_url ?? ""} onChange={(e) => set({ booking_url: e.target.value })} /></div>
        <div><label className={labelCls}>Booking button label</label><input className={inputCls} value={f.booking_label ?? ""} onChange={(e) => set({ booking_label: e.target.value })} /></div>
      </div>
      <SeoFields
        title={f.seo_title ?? ""}
        description={f.seo_description ?? ""}
        ogImage={f.og_image ?? ""}
        onChange={(patch) => set(patch)}
      />
      <div className="flex items-center gap-4">
        <button
          onClick={save}
          disabled={state === "saving"}
          className="rounded-lg bg-gold px-6 py-2.5 text-xs font-bold uppercase tracking-[0.18em] text-forest-950 transition hover:bg-gold-light disabled:opacity-60"
        >
          {state === "saving" ? "Saving…" : "Save changes"}
        </button>
        {state === "saved" && <span className="text-xs font-semibold text-emerald-700">✓ Saved — live now</span>}
        {state === "error" && <span className="text-xs font-semibold text-red-700">Save failed</span>}
      </div>
    </div>
  );
}

function SeoFields({
  title,
  description,
  ogImage,
  onChange,
}: {
  title: string;
  description: string;
  ogImage: string;
  onChange: (patch: { seo_title?: string; seo_description?: string; og_image?: string }) => void;
}) {
  return (
    <details className="rounded-xl border-2 border-gold/40 bg-white">
      <summary className="cursor-pointer px-4 py-3 text-[0.7rem] font-bold uppercase tracking-widest text-forest-900">
        Search engine listing (SEO) — optional
      </summary>
      <div className="space-y-4 border-t border-forest-900/10 p-4">
        <p className="text-xs text-forest-600">
          Leave blank to use the automatic title and description.
        </p>
        <div>
          <label className={labelCls}>SEO title</label>
          <input className={inputCls} value={title} onChange={(e) => onChange({ seo_title: e.target.value })} />
        </div>
        <div>
          <label className={labelCls}>Meta description</label>
          <textarea rows={2} className={inputCls} value={description} onChange={(e) => onChange({ seo_description: e.target.value })} />
        </div>
        <ImagePicker
          label="Social share image (1200×630)"
          value={ogImage}
          onChange={(v) => onChange({ og_image: v })}
        />
      </div>
    </details>
  );
}
