"use client";

import { useEffect, useState } from "react";
import { Calendar } from "./Calendar";
import { TimeGrid } from "./TimeGrid";
import { TicketPicker } from "./TicketPicker";
import { HealthForm } from "./HealthForm";
import type { HealthForm as HealthFormType } from "@/lib/store/booking";
import {
  DEFAULT_SAUNA_CONFIG,
  SAUNA_DAY_NAMES,
  SAUNA_TICKETS,
  formatDateLong,
  formatDateShort,
  formatGBP,
  formatHM,
  passEndDate,
  type SaunaConfig,
  type TicketType,
} from "@/lib/cms/sauna";

type Step = "ticket" | "datetime" | "health";

const TICKET_TYPES = Object.keys(SAUNA_TICKETS) as TicketType[];

function isTicketType(v: string | null): v is TicketType {
  return Boolean(v && (TICKET_TYPES as string[]).includes(v));
}

export function SaunaBooking({ initialTicket }: { initialTicket?: TicketType }) {
  const [config, setConfig] = useState<SaunaConfig>(DEFAULT_SAUNA_CONFIG);
  const [step, setStep] = useState<Step>(initialTicket ? "datetime" : "ticket");
  const [ticketType, setTicketType] = useState<TicketType>(
    initialTicket ?? "sauna_plunge"
  );
  const [date, setDate] = useState<string | null>(null);
  const [time, setTime] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Deep-link pre-selection, e.g. /book/sauna?ticket=plunge_only
  useEffect(() => {
    if (initialTicket) return;
    const param = new URLSearchParams(window.location.search).get("ticket");
    if (isTicketType(param)) {
      setTicketType(param);
      setStep("datetime");
    }
  }, [initialTicket]);

  useEffect(() => {
    fetch("/api/sauna/config")
      .then((r) => r.json())
      .then((d) => d.config && setConfig(d.config))
      .catch(() => {});
  }, []);

  const def = SAUNA_TICKETS[ticketType];
  const isPass = def.kind === "pass";
  const unitPrice = config.prices[ticketType];
  const totalPence = unitPrice * (isPass ? 1 : quantity);

  const chooseTicket = (t: TicketType) => {
    setTicketType(t);
    setDate(null);
    setTime(null);
    setQuantity(1);
    setStep("datetime");
  };

  const pickDate = (d: string) => {
    setDate(d);
    setTime(null);
    setQuantity(1);
  };

  const canContinue = isPass ? Boolean(date) : Boolean(date && time);

  const submitHealth = async (form: HealthFormType) => {
    if (!date || (!isPass && !time)) return;
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/sauna/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ticketType,
          date,
          time: isPass ? undefined : time,
          quantity: isPass ? 1 : quantity,
          healthForm: form,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Something went wrong.");
        return;
      }
      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
      } else if (data.redirectUrl) {
        window.location.href = data.redirectUrl;
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const saunaDaysLabel = [...config.saunaDays]
    .sort((a, b) => a - b)
    .map((d) => SAUNA_DAY_NAMES[d])
    .join(" · ");

  const stepIndex = step === "ticket" ? 0 : step === "datetime" ? 1 : 2;

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1.1fr_0.9fr]">
      <div className="space-y-6">
        {/* Schedule banner */}
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 rounded-2xl border border-forest-900/10 bg-forest-900 px-6 py-4 text-[12px] font-semibold uppercase tracking-[0.14em] text-ivory">
          <span>
            Bathing{" "}
            <span className="text-gold-light">
              {formatHM(config.openTime)}–{formatHM(config.closeTime)}
            </span>{" "}
            · 7 days
          </span>
          <span>
            Sauna <span className="text-gold-light">{saunaDaysLabel}</span>
          </span>
        </div>

        {/* Step indicator */}
        <ol className="flex items-center gap-2 rounded-full border border-forest-900/10 bg-ivory p-2 shadow-card">
          {[
            { label: "Choose ticket" },
            { label: isPass ? "Start date" : "Date & time" },
            { label: "Your details" },
          ].map((s, i) => {
            const active = i === stepIndex;
            const done = i < stepIndex;
            return (
              <li
                key={s.label}
                className={`flex flex-1 items-center justify-center gap-2 rounded-full px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.12em] transition-colors ${
                  active
                    ? "bg-forest-900 text-ivory"
                    : done
                    ? "bg-gold/20 text-forest-800"
                    : "text-forest-600/60"
                }`}
              >
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-ivory/20 text-[10px]">
                  {done ? "✓" : i + 1}
                </span>
                <span className="hidden sm:inline">{s.label}</span>
              </li>
            );
          })}
        </ol>

        {step === "ticket" && (
          <div className="rounded-[1.75rem] border border-forest-900/10 bg-white/60 p-5 md:p-7">
            <h2 className="font-display text-xl font-extrabold uppercase text-forest-900">
              Choose your ticket
            </h2>
            <p className="mt-1 text-sm text-forest-700/70">
              Single visits or unlimited passes — everyone completes a short health
              form before bathing.
            </p>
            <div className="mt-5">
              <TicketPicker value={ticketType} config={config} onChange={setTicketType} />
            </div>
            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setStep("datetime")}
                className="group inline-flex items-center gap-3 rounded-full bg-forest-900 py-3 pl-7 pr-2.5 text-[13px] font-semibold text-ivory hover:bg-forest-700"
              >
                Continue
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-ivory text-forest-900 transition-transform duration-500 group-hover:rotate-45">
                  →
                </span>
              </button>
            </div>
          </div>
        )}

        {step === "datetime" && (
          <div className="space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <button
                onClick={() => setStep("ticket")}
                className="text-xs font-semibold uppercase tracking-wide text-forest-700 underline-offset-4 hover:underline"
              >
                ‹ Change ticket
              </button>
              <p className="text-sm text-forest-700/80">
                <strong className="text-forest-900">{def.name}</strong>{" "}
                <span className="text-forest-600/70">· {formatGBP(unitPrice)}</span>
                {!isPass && <span className="text-forest-600/70"> / person</span>}
              </p>
            </div>

            <Calendar selected={date} ticketType={ticketType} onSelect={pickDate} />

            {date && !isPass && (
              <TimeGrid
                date={date}
                ticketType={ticketType}
                config={config}
                time={time}
                quantity={quantity}
                onTime={(t) => {
                  setTime(t);
                  setQuantity(1);
                }}
                onQuantity={setQuantity}
              />
            )}

            {date && isPass && (
              <div className="rounded-[1.75rem] border border-gold/40 bg-gold/[0.08] p-6 text-center shadow-card">
                <p className="text-sm font-semibold uppercase tracking-[0.16em] text-forest-700">
                  {def.name} valid
                </p>
                <p className="mt-2 font-display text-2xl font-extrabold text-forest-900">
                  {formatDateShort(date)}
                  <span className="mx-2 text-gold">→</span>
                  {formatDateShort(passEndDate(date, ticketType))}
                </p>
                <p className="mt-1 text-xs text-forest-600/70">
                  {def.validityDays} consecutive days of bathing, {formatHM(config.openTime)}–
                  {formatHM(config.closeTime)}.
                </p>
              </div>
            )}

            <div className="flex justify-end">
              <button
                disabled={!canContinue}
                onClick={() => setStep("health")}
                className="group inline-flex items-center gap-3 rounded-full bg-forest-900 py-3 pl-7 pr-2.5 text-[13px] font-semibold text-ivory hover:bg-forest-700 disabled:cursor-not-allowed disabled:opacity-40"
              >
                {isPass ? "Continue to details" : "Continue to details"}
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-ivory text-forest-900 transition-transform duration-500 group-hover:rotate-45">
                  →
                </span>
              </button>
            </div>
          </div>
        )}

        {step === "health" && date && (
          <div>
            <div className="mb-4 flex items-center justify-between">
              <p className="text-sm text-forest-700/70">
                Booking <strong className="text-forest-900">{def.name}</strong>
                {isPass
                  ? ` from ${formatDateLong(date)}`
                  : ` on ${formatDateLong(date)}${time ? ` at ${formatHM(time)}` : ""}`}
                {!isPass && quantity > 1 && ` · Party of ${quantity}`}
              </p>
              <button
                onClick={() => setStep("datetime")}
                className="text-xs font-semibold uppercase tracking-wide text-forest-700 underline-offset-4 hover:underline"
              >
                Change
              </button>
            </div>
            {error && (
              <div className="mb-4 rounded-xl border border-red-300 bg-red-50 p-4 text-sm text-red-700">
                {error}
              </div>
            )}
            <HealthForm onSubmit={submitHealth} submitting={submitting} />
          </div>
        )}
      </div>

      {/* Summary panel */}
      <aside className="lg:sticky lg:top-28 lg:self-start">
        <div className="rounded-[1.75rem] border border-forest-900/10 bg-forest-900 p-7 text-ivory shadow-card">
          <h3 className="font-display text-2xl font-extrabold uppercase">
            Your booking
          </h3>
          <dl className="mt-6 space-y-3 text-sm">
            <div className="flex justify-between gap-4">
              <dt className="text-sage-300">Ticket</dt>
              <dd className="text-right font-medium">{def.name}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-sage-300">{isPass ? "Starts" : "Date"}</dt>
              <dd className="text-right font-medium">
                {date ? formatDateShort(date) : "—"}
              </dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-sage-300">{isPass ? "Valid until" : "Session"}</dt>
              <dd className="text-right font-medium">
                {isPass
                  ? date
                    ? formatDateShort(passEndDate(date, ticketType))
                    : "—"
                  : time
                  ? formatHM(time)
                  : "—"}
              </dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-sage-300">{isPass ? "Passes" : "People"}</dt>
              <dd className="text-right font-medium">{isPass ? 1 : date && time ? quantity : "—"}</dd>
            </div>
            <div className="my-3 border-t border-ivory/15" />
            <div className="flex justify-between gap-4 text-base">
              <dt className="font-semibold">Total</dt>
              <dd className="font-display text-lg font-extrabold text-gold-light">
                {date && (isPass || time) ? formatGBP(totalPence) : "—"}
              </dd>
            </div>
          </dl>
          <p className="mt-6 text-[11px] leading-relaxed text-sage-400">
            Payment is processed securely by Stripe; bookings are confirmed after
            payment. Sauna sessions are limited to {config.maxParty} people. Strictly
            no under-16s at the sauna &amp; dip lake.
          </p>
        </div>
      </aside>
    </div>
  );
}
