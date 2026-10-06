"use client";

import { useState } from "react";
import { Reveal } from "@/components/ui/Reveal";
import { contact, site } from "@/data/site";
import { defaultPages } from "@/lib/cms/defaults";

type PanelContent = {
  eyebrow: string;
  title: string;
  accent: string;
  mapNote: string;
  successTitle: string;
  successText: string;
};

const D = defaultPages.find((p) => p.slug === "contact")!.content.panel as PanelContent;

const enquiryTypes = [
  "General Enquiry",
  "Fishing",
  "Sauna & Dip",
  "Events",
  "Camping",
  "Other",
];

type Status = "idle" | "loading" | "success" | "error";

export function ContactContent({ c }: { c?: Partial<PanelContent> }) {
  const t = { ...D, ...c };
  const [status, setStatus] = useState<Status>("idle");
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    enquiryType: "General Enquiry",
    message: "",
    consent: false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.consent) return;
    setStatus("loading");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setStatus("success");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  return (
    <section className="bg-ivory py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Contact details */}
          <div className="lg:col-span-5">
            <Reveal>
              <span className="text-[11px] uppercase tracking-[0.3em] text-forest-600">
                {t.eyebrow}
              </span>
            </Reveal>
            <Reveal delay={0.1}>
              <h2 className="mt-4 font-serif text-4xl md:text-5xl text-forest-900 leading-[1.08]">
                {t.title}
                <br />
                {t.accent && <span className="italic font-light">{t.accent}</span>}
              </h2>
            </Reveal>

            <div className="mt-10 space-y-8">
              <Reveal delay={0.15}>
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-forest-600 mb-2">
                    Address
                  </p>
                  <address className="not-italic text-forest-800 leading-relaxed">
                    {site.name}
                    <br />
                    {contact.address.line1}
                    <br />
                    {contact.address.line2}
                    <br />
                    {contact.address.postcode}
                    <br />
                    {contact.address.country}
                  </address>
                </div>
              </Reveal>

              <Reveal delay={0.2}>
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-forest-600 mb-2">
                    General Enquiries
                  </p>
                  <p className="text-forest-800">{contact.general.name}</p>
                  <a
                    href={contact.general.emailHref}
                    className="block text-forest-700 hover:text-forest-900"
                  >
                    {contact.general.email}
                  </a>
                  <a
                    href={contact.phoneHref}
                    className="block text-forest-700 hover:text-forest-900"
                  >
                    {contact.phone}
                  </a>
                </div>
              </Reveal>

              <Reveal delay={0.25}>
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-forest-600 mb-2">
                    Event Enquiries
                  </p>
                  <a
                    href={contact.events.emailHref}
                    className="block text-forest-700 hover:text-forest-900"
                  >
                    {contact.events.email}
                  </a>
                  <a
                    href={contact.phoneHref}
                    className="block text-forest-700 hover:text-forest-900"
                  >
                    {contact.phone}
                  </a>
                </div>
              </Reveal>

              <Reveal delay={0.3}>
                <div className="flex flex-wrap gap-3">
                  <a
                    href={contact.phoneHref}
                    className="inline-flex items-center gap-2 px-5 py-3 text-[12px] uppercase tracking-[0.16em] bg-forest-800 text-ivory hover:bg-forest-700 transition-colors"
                  >
                    Call
                  </a>
                  <a
                    href={contact.whatsappHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-3 text-[12px] uppercase tracking-[0.16em] border border-forest-900/30 text-forest-900 hover:bg-forest-900 hover:text-ivory transition-colors"
                  >
                    WhatsApp
                  </a>
                  <a
                    href={contact.general.emailHref}
                    className="inline-flex items-center gap-2 px-5 py-3 text-[12px] uppercase tracking-[0.16em] border border-forest-900/30 text-forest-900 hover:bg-forest-900 hover:text-ivory transition-colors"
                  >
                    Email
                  </a>
                  <a
                    href={contact.mapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-3 text-[12px] uppercase tracking-[0.16em] border border-forest-900/30 text-forest-900 hover:bg-forest-900 hover:text-ivory transition-colors"
                  >
                    Maps
                  </a>
                </div>
              </Reveal>
            </div>
          </div>

          {/* Form */}
          <div className="lg:col-span-7">
            <Reveal delay={0.1}>
              <div className="bg-forest-900 text-ivory p-8 md:p-12">
                {status === "success" ? (
                  <div className="py-12 text-center">
                    <h3 className="font-serif text-3xl mb-4">{t.successTitle}</h3>
                    <p className="text-sage-200">{t.successText}</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Field
                        label="Name"
                        required
                        value={form.name}
                        onChange={(v) => setForm({ ...form, name: v })}
                      />
                      <Field
                        label="Email"
                        type="email"
                        required
                        value={form.email}
                        onChange={(v) => setForm({ ...form, email: v })}
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Field
                        label="Phone"
                        type="tel"
                        value={form.phone}
                        onChange={(v) => setForm({ ...form, phone: v })}
                      />
                      <div>
                        <label className="block text-[11px] uppercase tracking-[0.2em] text-sage-400 mb-2">
                          Enquiry Type
                        </label>
                        <select
                          value={form.enquiryType}
                          onChange={(e) =>
                            setForm({ ...form, enquiryType: e.target.value })
                          }
                          className="w-full bg-transparent border border-ivory/20 px-4 py-3 text-ivory focus:border-gold outline-none transition-colors"
                        >
                          {enquiryTypes.map((t) => (
                            <option key={t} value={t} className="bg-forest-900">
                              {t}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="block text-[11px] uppercase tracking-[0.2em] text-sage-400 mb-2">
                        Message
                      </label>
                      <textarea
                        required
                        rows={5}
                        value={form.message}
                        onChange={(e) =>
                          setForm({ ...form, message: e.target.value })
                        }
                        className="w-full bg-transparent border border-ivory/20 px-4 py-3 text-ivory focus:border-gold outline-none transition-colors resize-none"
                      />
                    </div>
                    <label className="flex items-start gap-3">
                      <input
                        type="checkbox"
                        checked={form.consent}
                        onChange={(e) =>
                          setForm({ ...form, consent: e.target.checked })
                        }
                        className="mt-1 accent-gold"
                        required
                      />
                      <span className="text-sm text-sage-300">
                        I consent to Willow Garth storing my details to respond
                        to my enquiry.
                      </span>
                    </label>

                    {status === "error" && (
                      <p className="text-sm text-red-300">
                        We couldn't send your message. Please try again or
                        contact us directly.
                      </p>
                    )}

                    <button
                      type="submit"
                      disabled={status === "loading" || !form.consent}
                      className="inline-flex items-center justify-center gap-2 px-8 py-4 text-[13px] font-medium uppercase tracking-[0.18em] bg-gold text-forest-950 hover:bg-gold-light transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {status === "loading" ? "Sending…" : "Send Message"}
                      {status !== "loading" && <span>→</span>}
                    </button>
                  </form>
                )}
              </div>
            </Reveal>
          </div>
        </div>

        {/* Map */}
        <Reveal>
          <div className="mt-20">
            <div className="aspect-[16/8] w-full overflow-hidden bg-forest-800">
              <iframe
                title="Willow Garth Country Park location"
                src="https://www.google.com/maps?q=Marsh+Lane,+Arksey,+Doncaster,+DN5+0SH&output=embed"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
              />
            </div>
            <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
              <p className="text-sm text-forest-600">{t.mapNote}</p>
              <a
                href={contact.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-[12px] uppercase tracking-[0.16em] text-forest-900 hover:text-forest-600"
              >
                Get directions →
              </a>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function Field({
  label,
  type = "text",
  required,
  value,
  onChange,
}: {
  label: string;
  type?: string;
  required?: boolean;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <label className="block text-[11px] uppercase tracking-[0.2em] text-sage-400 mb-2">
        {label}
      </label>
      <input
        type={type}
        required={required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-transparent border border-ivory/20 px-4 py-3 text-ivory focus:border-gold outline-none transition-colors"
      />
    </div>
  );
}
