"use client";

import { useEffect, useState } from "react";
import { ImagePicker } from "./ImagePicker";

type RawSettings = Record<string, Record<string, unknown>>;

const inputCls =
  "w-full rounded-lg border border-forest-900/15 bg-white px-3 py-2.5 text-sm text-forest-900 outline-none transition focus:border-gold";
const labelCls = "mb-1 block text-[0.65rem] font-bold uppercase tracking-wider text-forest-500";

export function SettingsPanel() {
  const [settings, setSettings] = useState<RawSettings>({});
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch("/api/admin/settings", { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : { settings: {} }))
      .then((d) => setSettings(d.settings ?? {}))
      .finally(() => setLoading(false));
  }, []);

  const contact = settings.contact ?? {};
  const notice = settings.notice ?? {};
  const seo = settings.seo ?? {};
  const sauna = settings.sauna ?? {};

  function setContact(key: string, value: string) {
    setSettings((s) => ({ ...s, contact: { ...(s.contact ?? {}), [key]: value } }));
    setSaved(false);
  }
  function setNotice(key: string, value: string | boolean) {
    setSettings((s) => ({ ...s, notice: { ...(s.notice ?? {}), [key]: value } }));
    setSaved(false);
  }
  function setSeo(key: string, value: string) {
    setSettings((s) => ({ ...s, seo: { ...(s.seo ?? {}), [key]: value } }));
    setSaved(false);
  }
  function setSauna(key: string, value: unknown) {
    setSettings((s) => ({ ...s, sauna: { ...(s.sauna ?? {}), [key]: value } }));
    setSaved(false);
  }
  function toggleSaunaDay(day: number) {
    const current = Array.isArray(sauna.saunaDays) ? (sauna.saunaDays as number[]) : [0, 4, 6];
    const next = current.includes(day) ? current.filter((d) => d !== day) : [...current, day].sort();
    setSauna("saunaDays", next);
  }
  function setSaunaPrice(key: string, pounds: string) {
    const pence = Math.round((Number(pounds) || 0) * 100);
    const prices = { ...((sauna.prices as Record<string, number>) ?? {}) };
    prices[key] = pence;
    setSauna("prices", prices);
  }

  async function save(key: string) {
    const res = await fetch("/api/admin/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ key, value: settings[key] }),
    });
    if (res.ok) setSaved(true);
  }

  if (loading) return <p className="py-12 text-center text-sm text-forest-600">Loading settings…</p>;

  return (
    <div className="max-w-3xl space-y-6">
      {/* Contact */}
      <section className="rounded-xl border border-forest-900/10 bg-white p-6 shadow-card">
        <h2 className="font-display text-lg font-bold text-forest-900">Contact details</h2>
        <p className="mt-1 text-xs text-forest-600">Shown across the website, footer and contact page.</p>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <div><label className={labelCls}>Phone (display)</label>
            <input className={inputCls} value={(contact.phone as string) ?? ""} onChange={(e) => setContact("phone", e.target.value)} /></div>
          <div><label className={labelCls}>Phone (tel: link)</label>
            <input className={inputCls} value={(contact.phoneHref as string) ?? ""} onChange={(e) => setContact("phoneHref", e.target.value)} /></div>
          <div><label className={labelCls}>General email</label>
            <input className={inputCls} value={(contact.email as string) ?? ""} onChange={(e) => setContact("email", e.target.value)} /></div>
          <div><label className={labelCls}>Events email</label>
            <input className={inputCls} value={(contact.eventsEmail as string) ?? ""} onChange={(e) => setContact("eventsEmail", e.target.value)} /></div>
          <div><label className={labelCls}>WhatsApp link</label>
            <input className={inputCls} value={(contact.whatsappHref as string) ?? ""} onChange={(e) => setContact("whatsappHref", e.target.value)} /></div>
          <div><label className={labelCls}>what3words</label>
            <input className={inputCls} value={(contact.what3words as string) ?? ""} onChange={(e) => setContact("what3words", e.target.value)} /></div>
        </div>
        <div className="mt-4">
          <label className={labelCls}>Address</label>
          <input className={inputCls} value={(contact.address as string) ?? ""} onChange={(e) => setContact("address", e.target.value)} />
        </div>
        <div className="mt-4">
          <label className={labelCls}>Google Maps link</label>
          <input className={inputCls} value={(contact.mapsUrl as string) ?? ""} onChange={(e) => setContact("mapsUrl", e.target.value)} />
        </div>
        <div className="mt-5 flex items-center gap-4">
          <button onClick={() => save("contact")} className="rounded-lg bg-gold px-6 py-2.5 text-xs font-bold uppercase tracking-[0.18em] text-forest-950 transition hover:bg-gold-light">
            Save contact
          </button>
        </div>
      </section>

      {/* Notice banner */}
      <section className="rounded-xl border border-forest-900/10 bg-white p-6 shadow-card">
        <h2 className="font-display text-lg font-bold text-forest-900">Announcement banner</h2>
        <p className="mt-1 text-xs text-forest-600">A short site-wide message (e.g. weather closures, events).</p>
        <div className="mt-5 space-y-4">
          <label className="flex items-center gap-2 text-sm font-semibold text-forest-800">
            <input
              type="checkbox"
              className="h-4 w-4 accent-gold"
              checked={Boolean(notice.enabled)}
              onChange={(e) => setNotice("enabled", e.target.checked)}
            />
            Show banner on the website
          </label>
          <textarea
            rows={2}
            className={inputCls}
            placeholder="e.g. Oak Lake reopens 1 November — bookings now open."
            value={(notice.text as string) ?? ""}
            onChange={(e) => setNotice("text", e.target.value)}
          />
          <button onClick={() => save("notice")} className="rounded-lg bg-gold px-6 py-2.5 text-xs font-bold uppercase tracking-[0.18em] text-forest-950 transition hover:bg-gold-light">
            Save banner
          </button>
          {saved && <span className="ml-3 text-xs font-semibold text-emerald-700">✓ Saved</span>}
        </div>
      </section>

      {/* Sauna schedule & pricing */}
      <section className="rounded-xl border-2 border-gold/40 bg-white p-6 shadow-card">
        <h2 className="font-display text-lg font-bold text-forest-900">Sauna schedule &amp; pricing</h2>
        <p className="mt-1 text-xs text-forest-600">
          Drives the booking calendar. Cold-water bathing runs every day; the wood-fired sauna is
          offered on the ticked weekdays. Prices are per ticket in pounds.
        </p>

        <div className="mt-5">
          <label className={labelCls}>Sauna days (wood-fired sauna available)</label>
          <div className="flex flex-wrap gap-2">
            {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((name, i) => {
              // JS getDay(): Mon=1 … Sun=0
              const day = i === 6 ? 0 : i + 1;
              const days = Array.isArray(sauna.saunaDays) ? (sauna.saunaDays as number[]) : [0, 4, 6];
              const active = days.includes(day);
              return (
                <button
                  key={name}
                  type="button"
                  onClick={() => toggleSaunaDay(day)}
                  className={`rounded-full border px-4 py-2 text-xs font-bold uppercase tracking-wider transition ${
                    active
                      ? "border-gold bg-gold text-forest-950"
                      : "border-forest-900/15 bg-white text-forest-600 hover:border-gold/60"
                  }`}
                >
                  {name}
                </button>
              );
            })}
          </div>
          <p className="mt-2 text-[0.7rem] text-forest-500">
            Plunge-only tickets and passes remain bookable on all other days.
          </p>
        </div>

        <div className="mt-5 grid gap-4 sm:grid-cols-4">
          <div>
            <label className={labelCls}>Opening time</label>
            <input
              type="time"
              className={inputCls}
              value={(sauna.openTime as string) ?? "07:00"}
              onChange={(e) => setSauna("openTime", e.target.value)}
            />
          </div>
          <div>
            <label className={labelCls}>Closing time</label>
            <input
              type="time"
              className={inputCls}
              value={(sauna.closeTime as string) ?? "19:00"}
              onChange={(e) => setSauna("closeTime", e.target.value)}
            />
          </div>
          <div>
            <label className={labelCls}>Session interval (min)</label>
            <input
              type="number"
              min={15}
              step={5}
              className={inputCls}
              value={(sauna.intervalMinutes as number) ?? 60}
              onChange={(e) => setSauna("intervalMinutes", Number(e.target.value))}
            />
          </div>
          <div>
            <label className={labelCls}>Capacity / session</label>
            <input
              type="number"
              min={1}
              className={inputCls}
              value={(sauna.capacity as number) ?? 6}
              onChange={(e) => setSauna("capacity", Number(e.target.value))}
            />
          </div>
        </div>

        <div className="mt-4">
          <label className={labelCls}>Max people per online booking</label>
          <input
            type="number"
            min={1}
            className={inputCls}
            value={(sauna.maxParty as number) ?? 6}
            onChange={(e) => setSauna("maxParty", Number(e.target.value))}
          />
        </div>

        <div className="mt-5">
          <label className={labelCls}>Ticket prices (£)</label>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { key: "sauna_plunge", label: "Sauna & Plunge", def: 10 },
              { key: "plunge_only", label: "Plunge only", def: 5 },
              { key: "weekly_pass", label: "Weekly pass (7 days)", def: 20 },
              { key: "monthly_pass", label: "Monthly pass (30 days)", def: 40 },
            ].map((t) => {
              const pence = ((sauna.prices as Record<string, number> | undefined)?.[t.key] ?? t.def * 100) as number;
              return (
                <div key={t.key}>
                  <span className="mb-1 block text-[0.7rem] font-semibold text-forest-700">{t.label}</span>
                  <div className="relative">
                    <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm font-bold text-forest-500">£</span>
                    <input
                      type="number"
                      min={0}
                      step={0.5}
                      className={`${inputCls} pl-7`}
                      value={(pence / 100).toFixed(2)}
                      onChange={(e) => setSaunaPrice(t.key, e.target.value)}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="mt-5 flex items-center gap-4">
          <button onClick={() => save("sauna")} className="rounded-lg bg-gold px-6 py-2.5 text-xs font-bold uppercase tracking-[0.18em] text-forest-950 transition hover:bg-gold-light">
            Save schedule &amp; prices
          </button>
          {saved && <span className="text-xs font-semibold text-emerald-700">✓ Saved</span>}
        </div>
      </section>

      {/* Global SEO */}
      <section className="rounded-xl border-2 border-gold/40 bg-white p-6 shadow-card">
        <h2 className="font-display text-lg font-bold text-forest-900">Global SEO defaults</h2>
        <p className="mt-1 text-xs text-forest-600">
          Used as the fallback title, description and share image. Individual page SEO settings
          override these.
        </p>
        <div className="mt-5 space-y-4">
          <div>
            <label className={labelCls}>Default site title</label>
            <input
              className={inputCls}
              value={(seo.title as string) ?? ""}
              placeholder="Willow Garth Country Park — Fishing, Sauna & Dip near Doncaster"
              onChange={(e) => setSeo("title", e.target.value)}
            />
          </div>
          <div>
            <label className={labelCls}>Default meta description</label>
            <textarea
              rows={2}
              className={inputCls}
              value={(seo.description as string) ?? ""}
              placeholder="A short description of the whole site used by Google and social media."
              onChange={(e) => setSeo("description", e.target.value)}
            />
          </div>
          <ImagePicker
            label="Default social share image (1200×630)"
            value={(seo.ogImage as string) ?? ""}
            onChange={(v) => setSeo("ogImage", v)}
          />
          <button onClick={() => save("seo")} className="rounded-lg bg-gold px-6 py-2.5 text-xs font-bold uppercase tracking-[0.18em] text-forest-950 transition hover:bg-gold-light">
            Save SEO defaults
          </button>
          {saved && <span className="ml-3 text-xs font-semibold text-emerald-700">✓ Saved</span>}
        </div>
      </section>

      {/* Platform info */}
      <section className="rounded-xl border border-forest-900/10 bg-forest-950 p-6 text-ivory">
        <h2 className="font-display text-lg font-bold">Booking platform</h2>
        <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
          <div><dt className="text-[0.65rem] uppercase tracking-wider text-ivory/50">Database</dt><dd>Supabase Postgres (cloud)</dd></div>
          <div><dt className="text-[0.65rem] uppercase tracking-wider text-ivory/50">Payments</dt><dd>Stripe Checkout (configured in environment)</dd></div>
          <div><dt className="text-[0.65rem] uppercase tracking-wider text-ivory/50">Capacity</dt><dd>Max 6 per session · enforced atomically</dd></div>
          <div><dt className="text-[0.65rem] uppercase tracking-wider text-ivory/50">Webhook</dt><dd className="break-all">/api/stripe/webhook</dd></div>
        </dl>
      </section>
    </div>
  );
}
