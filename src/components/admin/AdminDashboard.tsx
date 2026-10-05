"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { BookingsPanel } from "./BookingsPanel";
import { SlotsPanel } from "./SlotsPanel";
import { ContentPanel } from "./ContentPanel";
import { SettingsPanel } from "./SettingsPanel";
import { PagesPanel } from "./PagesPanel";
import { MediaPanel } from "./MediaPanel";

type Tab = "overview" | "bookings" | "slots" | "pages" | "content" | "media" | "settings";

const TABS: { id: Tab; label: string; icon: string }[] = [
  { id: "overview", label: "Overview", icon: "◈" },
  { id: "bookings", label: "Bookings", icon: "◉" },
  { id: "slots", label: "Sessions", icon: "▤" },
  { id: "pages", label: "Pages", icon: "📄" },
  { id: "content", label: "Lakes & Experiences", icon: "✎" },
  { id: "media", label: "Media Library", icon: "🖼" },
  { id: "settings", label: "Site Settings", icon: "⚙" },
];

export function AdminDashboard({ email }: { email: string }) {
  const [tab, setTab] = useState<Tab>("overview");
  const router = useRouter();

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.replace("/admin/login");
    router.refresh();
  }

  return (
    <div className="flex min-h-screen bg-cream">
      {/* Sidebar */}
      <aside className="fixed inset-y-0 left-0 hidden w-64 flex-col bg-forest-950 p-5 md:flex">
        <a href="/" className="mb-8 block font-display text-lg font-extrabold tracking-[0.16em] text-ivory">
          WILLOW GARTH
        </a>
        <nav className="flex-1 space-y-1">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex w-full items-center gap-3 rounded-lg px-4 py-2.5 text-left text-sm font-medium transition ${
                tab === t.id
                  ? "bg-gold text-forest-950"
                  : "text-ivory/65 hover:bg-white/5 hover:text-ivory"
              }`}
            >
              <span className="w-4 text-center text-xs">{t.icon}</span>
              {t.label}
            </button>
          ))}
        </nav>
        <div className="border-t border-white/10 pt-4">
          <p className="truncate px-2 text-xs text-ivory/50">{email}</p>
          <button
            onClick={logout}
            className="mt-2 w-full rounded-lg px-3 py-2 text-left text-xs font-semibold uppercase tracking-widest text-ivory/60 transition hover:text-gold"
          >
            Sign out
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 md:ml-64">
        {/* Mobile top bar */}
        <div className="sticky top-0 z-20 border-b border-forest-900/10 bg-ivory/90 px-4 py-3 backdrop-blur md:hidden">
          <div className="flex items-center justify-between">
            <span className="font-display text-sm font-extrabold tracking-[0.16em] text-forest-900">
              WILLOW GARTH
            </span>
            <button onClick={logout} className="text-xs font-semibold uppercase text-forest-600">
              Sign out
            </button>
          </div>
          <div className="mt-3 flex gap-1 overflow-x-auto pb-1">
            {TABS.map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-semibold transition ${
                  tab === t.id ? "bg-forest-900 text-ivory" : "bg-forest-900/5 text-forest-700"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        <header className="hidden items-center justify-between border-b border-forest-900/10 bg-ivory/70 px-8 py-5 backdrop-blur md:flex">
          <h1 className="font-display text-xl font-bold text-forest-900">
            {TABS.find((t) => t.id === tab)?.label}
          </h1>
          <a
            href="/"
            target="_blank"
            className="text-xs font-semibold uppercase tracking-widest text-forest-600 hover:text-gold"
          >
            View site ↗
          </a>
        </header>

        <div className="p-4 md:p-8">
          {tab === "overview" && <Overview onNavigate={setTab} />}
          {tab === "bookings" && <BookingsPanel />}
          {tab === "slots" && <SlotsPanel />}
          {tab === "pages" && <PagesPanel />}
          {tab === "content" && <ContentPanel />}
          {tab === "media" && <MediaPanel />}
          {tab === "settings" && <SettingsPanel />}
        </div>
      </div>
    </div>
  );
}

function Overview({ onNavigate }: { onNavigate: (t: Tab) => void }) {
  const cards = [
    {
      tab: "bookings" as Tab,
      title: "Sauna Bookings",
      body: "View all bookings, customer health forms and payment status. Mark payments and cancel sessions.",
      cta: "Manage bookings",
    },
    {
      tab: "slots" as Tab,
      title: "Sessions & Pricing",
      body: "Create sauna sessions, set times, capacity (max 6) and ticket prices. Customers only see sessions with places left.",
      cta: "Edit sessions",
    },
    {
      tab: "pages" as Tab,
      title: "Pages",
      body: "Edit every page's text, images, buttons and SEO settings — homepage, about, events, safety, booking, contact and legal pages.",
      cta: "Edit pages",
    },
    {
      tab: "content" as Tab,
      title: "Lakes & Experiences",
      body: "Edit lake and experience details, photos, descriptions, booking links and search engine settings.",
      cta: "Edit lakes & experiences",
    },
    {
      tab: "media" as Tab,
      title: "Media Library",
      body: "Upload and organise photos in one place, then insert them into any page via the image picker.",
      cta: "Open media library",
    },
    {
      tab: "settings" as Tab,
      title: "Site Settings",
      body: "Update contact details, phone, email, address, global SEO defaults and the homepage announcement banner.",
      cta: "Update settings",
    },
  ];

  return (
    <div className="grid gap-5 sm:grid-cols-2">
      {cards.map((c) => (
        <div key={c.tab} className="rounded-xl border border-forest-900/10 bg-white p-6 shadow-card">
          <h3 className="font-display text-lg font-bold text-forest-900">{c.title}</h3>
          <p className="mt-2 text-sm leading-relaxed text-forest-700">{c.body}</p>
          <button
            onClick={() => onNavigate(c.tab)}
            className="mt-4 text-xs font-bold uppercase tracking-[0.15em] text-gold hover:underline"
          >
            {c.cta} →
          </button>
        </div>
      ))}
    </div>
  );
}
