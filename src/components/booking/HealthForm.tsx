"use client";

import { useState } from "react";
import type { HealthForm } from "@/lib/store/booking";

type Props = {
  onSubmit: (form: HealthForm) => void;
  submitting: boolean;
};

const FIELD_BASE =
  "w-full rounded-xl border border-forest-900/15 bg-ivory px-4 py-3 text-forest-900 placeholder:text-forest-600/50 focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/30";

export function HealthForm({ onSubmit, submitting }: Props) {
  const [form, setForm] = useState<HealthForm>({
    full_name: "",
    email: "",
    phone: "",
    age_confirmed: false,
    emergency_contact: "",
    medical_conditions: false,
    medical_details: "",
    cold_water_experience: "",
    consent: false,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const update = <K extends keyof HealthForm>(key: K, value: HealthForm[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs: Record<string, string> = {};
    if (!form.full_name.trim()) errs.full_name = "Required";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = "Valid email required";
    if (!form.phone.trim()) errs.phone = "Required";
    if (!form.age_confirmed) errs.age_confirmed = "Required";
    if (!form.emergency_contact.trim()) errs.emergency_contact = "Required";
    if (form.medical_conditions && !form.medical_details.trim())
      errs.medical_details = "Please provide details";
    if (!form.cold_water_experience.trim()) errs.cold_water_experience = "Required";
    if (!form.consent) errs.consent = "Required";
    setErrors(errs);
    if (Object.keys(errs).length === 0) onSubmit(form);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 rounded-[1.75rem] border border-forest-900/10 bg-ivory p-6 shadow-card md:p-8"
    >
      <div>
        <h3 className="font-display text-2xl font-extrabold uppercase text-forest-900">
          Health & safety form
        </h3>
        <p className="mt-2 text-sm text-forest-700/70">
          Before your cold-water session, please complete this declaration. Your
          details are stored securely with your booking.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.12em] text-forest-700">
            Full name
          </label>
          <input
            className={FIELD_BASE}
            value={form.full_name}
            onChange={(e) => update("full_name", e.target.value)}
            placeholder="Jane Doe"
          />
          {errors.full_name && <p className="mt-1 text-xs text-red-600">{errors.full_name}</p>}
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.12em] text-forest-700">
            Email
          </label>
          <input
            className={FIELD_BASE}
            value={form.email}
            onChange={(e) => update("email", e.target.value)}
            placeholder="jane@example.com"
            type="email"
          />
          {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email}</p>}
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.12em] text-forest-700">
            Phone
          </label>
          <input
            className={FIELD_BASE}
            value={form.phone}
            onChange={(e) => update("phone", e.target.value)}
            placeholder="07123 456789"
          />
          {errors.phone && <p className="mt-1 text-xs text-red-600">{errors.phone}</p>}
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.12em] text-forest-700">
            Emergency contact (name & number)
          </label>
          <input
            className={FIELD_BASE}
            value={form.emergency_contact}
            onChange={(e) => update("emergency_contact", e.target.value)}
            placeholder="John Doe — 07987 654321"
          />
          {errors.emergency_contact && (
            <p className="mt-1 text-xs text-red-600">{errors.emergency_contact}</p>
          )}
        </div>
      </div>

      <div className="rounded-2xl border border-gold/30 bg-gold/[0.06] p-5">
        <label className="flex cursor-pointer items-start gap-3">
          <input
            type="checkbox"
            checked={form.age_confirmed}
            onChange={(e) => update("age_confirmed", e.target.checked)}
            className="mt-0.5 h-5 w-5 accent-forest-700"
          />
          <span className="text-sm text-forest-800">
            I confirm I am aged <strong>18 or over</strong>. Children under 16 are
            strictly not permitted at the sauna & dip lake.
          </span>
        </label>
        {errors.age_confirmed && <p className="mt-2 text-xs text-red-600">{errors.age_confirmed}</p>}
      </div>

      <div>
        <p className="mb-2 text-sm font-medium text-forest-800">
          Do you have any medical conditions we should be aware of?
        </p>
        <div className="flex gap-4">
          {[
            { v: false, label: "No" },
            { v: true, label: "Yes" },
          ].map((opt) => (
            <label
              key={String(opt.v)}
              className="flex cursor-pointer items-center gap-2 text-sm text-forest-800"
            >
              <input
                type="radio"
                name="medical"
                checked={form.medical_conditions === opt.v}
                onChange={() => update("medical_conditions", opt.v)}
                className="h-4 w-4 accent-forest-700"
              />
              {opt.label}
            </label>
          ))}
        </div>
        {form.medical_conditions && (
          <input
            className={`${FIELD_BASE} mt-3`}
            value={form.medical_details}
            onChange={(e) => update("medical_details", e.target.value)}
            placeholder="Please provide details"
          />
        )}
        {errors.medical_details && (
          <p className="mt-1 text-xs text-red-600">{errors.medical_details}</p>
        )}
      </div>

      <div>
        <label className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.12em] text-forest-700">
          Cold-water experience
        </label>
        <select
          className={FIELD_BASE}
          value={form.cold_water_experience}
          onChange={(e) => update("cold_water_experience", e.target.value)}
        >
          <option value="">Please select…</option>
          <option value="none">None — this is my first time</option>
          <option value="some">Some experience</option>
          <option value="regular">Regular cold-water swimmer</option>
        </select>
        {errors.cold_water_experience && (
          <p className="mt-1 text-xs text-red-600">{errors.cold_water_experience}</p>
        )}
      </div>

      <div className="rounded-2xl border border-forest-900/10 bg-cream/60 p-5">
        <label className="flex cursor-pointer items-start gap-3">
          <input
            type="checkbox"
            checked={form.consent}
            onChange={(e) => update("consent", e.target.checked)}
            className="mt-0.5 h-5 w-5 accent-forest-700"
          />
          <span className="text-sm text-forest-800">
            I consent to Willow Garth storing these details for my booking and
            confirm the information I have provided is accurate. I understand
            cold-water swimming carries inherent risks.
          </span>
        </label>
        {errors.consent && <p className="mt-2 text-xs text-red-600">{errors.consent}</p>}
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="group inline-flex w-full items-center justify-center gap-3 rounded-full bg-forest-900 py-4 text-[13px] font-semibold uppercase tracking-[0.16em] text-ivory hover:bg-forest-700 disabled:opacity-60"
      >
        {submitting ? "Processing…" : "Continue to payment"}
      </button>
    </form>
  );
}
