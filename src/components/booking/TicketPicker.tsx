"use client";

import { motion } from "framer-motion";
import {
  SAUNA_TICKETS,
  TICKET_ORDER,
  formatGBP,
  type SaunaConfig,
  type TicketType,
} from "@/lib/cms/sauna";

type Props = {
  value: TicketType;
  config: SaunaConfig;
  onChange: (t: TicketType) => void;
};

function scheduleNote(type: TicketType, config: SaunaConfig): string {
  switch (type) {
    case "sauna_plunge":
      return "Wood-fired sauna days · 7am–7pm";
    case "plunge_only":
      return "Every day · 7am–7pm";
    case "weekly_pass":
      return "Unlimited bathing · 7 consecutive days";
    case "monthly_pass":
      return "Unlimited bathing · 30 consecutive days";
  }
}

function saunaDayLabel(config: SaunaConfig): string {
  const names = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  return [...config.saunaDays].sort((a, b) => a - b).map((d) => names[d]).join(" · ");
}

export function TicketPicker({ value, config, onChange }: Props) {
  return (
    <div>
      <div className="mb-5 grid gap-4 sm:grid-cols-2">
        {TICKET_ORDER.map((type) => {
          const t = SAUNA_TICKETS[type];
          const selected = value === type;
          const isPass = t.kind === "pass";
          return (
            <motion.button
              key={type}
              type="button"
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.985 }}
              onClick={() => onChange(type)}
              aria-pressed={selected}
              className={`relative flex flex-col rounded-[1.4rem] border p-5 text-left transition-colors ${
                selected
                  ? "border-gold bg-gold/[0.08] shadow-card"
                  : "border-forest-900/10 bg-ivory hover:border-gold/50"
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <h3 className="font-display text-lg font-extrabold text-forest-900">
                  {t.name}
                </h3>
                {isPass && (
                  <span className="rounded-full bg-forest-900 px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.14em] text-gold-light">
                    Pass
                  </span>
                )}
              </div>
              <p className="mt-1.5 text-[13px] leading-relaxed text-forest-700/75">
                {t.blurb}
              </p>
              <div className="mt-4 flex items-end justify-between">
                <div>
                  <p className="font-display text-2xl font-extrabold text-forest-900">
                    {formatGBP(config.prices[type])}
                    {!isPass && (
                      <span className="ml-1 text-xs font-medium text-forest-600/70">
                        / person
                      </span>
                    )}
                  </p>
                  <p className="mt-0.5 text-[11px] font-semibold uppercase tracking-[0.1em] text-forest-600/70">
                    {type === "sauna_plunge" ? saunaDayLabel(config) : scheduleNote(type, config)}
                  </p>
                </div>
                <span
                  className={`flex h-6 w-6 items-center justify-center rounded-full border-2 text-xs transition-colors ${
                    selected
                      ? "border-gold bg-gold text-forest-950"
                      : "border-forest-900/25 text-transparent"
                  }`}
                >
                  ✓
                </span>
              </div>
            </motion.button>
          );
        })}
      </div>

      {value === "sauna_plunge" && (
        <p className="rounded-xl border border-gold/40 bg-gold/10 px-4 py-3 text-[13px] text-forest-800">
          The wood-fired sauna is currently lit on{" "}
          <strong>{saunaDayLabel(config)}</strong>. Cold-water plunge bathing is
          available every day from{" "}
          <strong>
            {config.openTime}–{config.closeTime}
          </strong>{" "}
          — choose Plunge Only on other days.
        </p>
      )}
    </div>
  );
}
