"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { formatHM, type SaunaConfig, type TicketType } from "@/lib/cms/sauna";

type SessionTime = {
  time: string;
  capacity: number;
  available: number;
  saunaAvailable: boolean;
};

type Props = {
  date: string;
  ticketType: TicketType;
  config: SaunaConfig;
  time: string | null;
  quantity: number;
  onTime: (t: string) => void;
  onQuantity: (n: number) => void;
};

export function TimeGrid({
  date,
  ticketType,
  config,
  time,
  quantity,
  onTime,
  onQuantity,
}: Props) {
  const [sessions, setSessions] = useState<SessionTime[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetch(`/api/sauna/slots?date=${date}&ticket=${ticketType}`)
      .then((r) => r.json())
      .then((data) => {
        if (cancelled) return;
        setSessions(data.sessions ?? []);
      })
      .catch(() => setSessions([]))
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, [date, ticketType]);

  if (loading) {
    return (
      <div className="rounded-[1.75rem] border border-forest-900/10 bg-ivory p-8 text-center text-forest-600">
        Loading session times…
      </div>
    );
  }

  if (sessions.length === 0) {
    return (
      <div className="rounded-[1.75rem] border border-forest-900/10 bg-ivory p-10 text-center">
        <p className="font-serif text-2xl text-forest-900">No times available</p>
        <p className="mt-2 text-sm text-forest-700/70">
          Bathing has finished for today. Please pick another date — sessions run{" "}
          {config.openTime}–{config.closeTime}.
        </p>
      </div>
    );
  }

  const selectedSession = sessions.find((s) => s.time === time);
  const maxForSelected = selectedSession
    ? Math.min(config.maxParty, selectedSession.available)
    : config.maxParty;

  return (
    <div className="rounded-[1.75rem] border border-forest-900/10 bg-ivory p-5 shadow-card md:p-7">
      <h3 className="font-display text-lg font-bold uppercase tracking-wide text-forest-900">
        Choose a time
      </h3>
      <p className="mt-1 text-xs text-forest-600/70">
        Hourly sessions from {formatHM(config.openTime)} to {formatHM(config.closeTime)}
      </p>

      <div className="mt-5 grid grid-cols-3 gap-2.5 sm:grid-cols-4 md:grid-cols-6">
        {sessions.map((s) => {
          const full = s.available <= 0;
          const selected = time === s.time;
          return (
            <motion.button
              key={s.time}
              type="button"
              whileHover={full ? undefined : { scale: 1.04 }}
              whileTap={full ? undefined : { scale: 0.96 }}
              disabled={full}
              onClick={() => onTime(s.time)}
              className={`rounded-xl border px-2 py-3 text-center transition-colors ${
                selected
                  ? "border-gold bg-gold/[0.12]"
                  : full
                  ? "cursor-not-allowed border-forest-900/10 bg-cream/50 opacity-50"
                  : "border-forest-900/12 bg-white hover:border-gold/60"
              }`}
            >
              <span className="block font-display text-base font-extrabold text-forest-900">
                {formatHM(s.time)}
              </span>
              <span
                className={`mt-0.5 block text-[10px] font-semibold uppercase tracking-wider ${
                  full ? "text-red-600" : "text-forest-600/70"
                }`}
              >
                {full ? "Full" : `${s.available} left`}
              </span>
            </motion.button>
          );
        })}
      </div>

      {selectedSession && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-gold/40 bg-gold/[0.07] px-5 py-4"
        >
 <div>
            <p className="text-sm font-bold text-forest-900">
              How many people?
            </p>
            <p className="text-xs text-forest-600/70">
              Up to {maxForSelected} available at {formatHM(selectedSession.time)} ·{" "}
              {config.maxParty} max per booking
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => onQuantity(Math.max(1, quantity - 1))}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-forest-900/15 text-lg text-forest-800 hover:bg-forest-900 hover:text-ivory"
            >
              −
            </button>
            <span className="w-8 text-center font-display text-xl font-extrabold text-forest-900">
              {quantity}
            </span>
            <button
              type="button"
              onClick={() => onQuantity(Math.min(maxForSelected, quantity + 1))}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-forest-900/15 text-lg text-forest-800 hover:bg-forest-900 hover:text-ivory"
            >
              +
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
}
