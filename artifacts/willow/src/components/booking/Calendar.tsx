"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { SAUNA_TICKETS, type TicketType } from "@/lib/cms/sauna";

type Props = {
  selected: string | null;
  ticketType: TicketType;
  onSelect: (date: string) => void;
};

type MonthDate = { date: string; sauna: boolean };

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];
const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

function todayLocalStr() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
    d.getDate()
  ).padStart(2, "0")}`;
}

function pad(n: number) {
  return String(n).padStart(2, "0");
}

export function Calendar({ selected, ticketType, onSelect }: Props) {
  const today = useMemo(() => new Date(), []);
  const [cursor, setCursor] = useState({
    year: today.getFullYear(),
    month: today.getMonth(),
  });
  const [dates, setDates] = useState<Map<string, boolean>>(new Map());

  useEffect(() => {
    let cancelled = false;
    const monthStr = `${cursor.year}-${pad(cursor.month + 1)}`;
    fetch(`/api/sauna/slots?month=${monthStr}&ticket=${ticketType}`)
      .then((r) => r.json())
      .then((data) => {
        if (cancelled) return;
        setDates(
          new Map((data.dates ?? []).map((d: MonthDate) => [d.date, d.sauna]))
        );
      })
      .catch(() => setDates(new Map()));
    return () => {
      cancelled = true;
    };
  }, [cursor, ticketType]);

  const firstDay = new Date(cursor.year, cursor.month, 1);
  const daysInMonth = new Date(cursor.year, cursor.month + 1, 0).getDate();
  const startOffset = (firstDay.getDay() + 6) % 7;

  const cells: (number | null)[] = [];
  for (let i = 0; i < startOffset; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  const isPast = (day: number) =>
    `${cursor.year}-${pad(cursor.month + 1)}-${pad(day)}` < todayLocalStr();

  const dateStr = (day: number) =>
    `${cursor.year}-${pad(cursor.month + 1)}-${pad(day)}`;

  const prev = () =>
    setCursor((c) =>
      c.month === 0
        ? { year: c.year - 1, month: 11 }
        : { year: c.year, month: c.month - 1 }
    );
  const next = () =>
    setCursor((c) =>
      c.month === 11
        ? { year: c.year + 1, month: 0 }
        : { year: c.year, month: c.month + 1 }
    );

  const canPrev =
    cursor.year > today.getFullYear() ||
    (cursor.year === today.getFullYear() && cursor.month > today.getMonth());

  const isPass = SAUNA_TICKETS[ticketType].kind === "pass";

  return (
    <div className="rounded-[1.75rem] border border-forest-900/10 bg-ivory p-5 shadow-card md:p-7">
      <div className="mb-1 flex items-center justify-between">
        <button
          onClick={prev}
          disabled={!canPrev}
          aria-label="Previous month"
          className="flex h-10 w-10 items-center justify-center rounded-full border border-forest-900/15 text-forest-800 transition-colors hover:bg-forest-900 hover:text-ivory disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-forest-800"
        >
          ‹
        </button>
        <h3 className="font-display text-lg font-bold uppercase tracking-wide text-forest-900">
          {MONTHS[cursor.month]} {cursor.year}
        </h3>
        <button
          onClick={next}
          aria-label="Next month"
          className="flex h-10 w-10 items-center justify-center rounded-full border border-forest-900/15 text-forest-800 transition-colors hover:bg-forest-900 hover:text-ivory"
        >
          ›
        </button>
      </div>
      <p className="mb-4 text-center text-[11px] font-semibold uppercase tracking-[0.14em] text-forest-600/70">
        {isPass
          ? "Choose pass start date"
          : ticketType === "sauna_plunge"
          ? "Sauna days highlighted"
          : "Choose your bathing day"}
      </p>

      <div className="grid grid-cols-7 gap-1.5 text-center">
        {WEEKDAYS.map((w) => (
          <div
            key={w}
            className="pb-2 text-[10px] font-semibold uppercase tracking-[0.15em] text-forest-600/70"
          >
            {w}
          </div>
        ))}
        {cells.map((day, i) => {
          if (day === null) return <div key={i} />;
          const ds = dateStr(day);
          const past = isPast(day);
          const saunaDay = dates.get(ds);
          const hasAvail = dates.has(ds);
          const isSelected = selected === ds;
          const clickable = !past && hasAvail;
          return (
            <motion.button
              key={i}
              whileHover={clickable ? { scale: 1.05 } : undefined}
              whileTap={clickable ? { scale: 0.95 } : undefined}
              onClick={() => clickable && onSelect(ds)}
              disabled={!clickable}
              className={`relative flex h-11 items-center justify-center rounded-full text-sm font-medium transition-colors md:h-12 ${
                isSelected
                  ? "bg-forest-900 text-ivory"
                  : clickable
                  ? "text-forest-900 hover:bg-gold hover:text-forest-950"
                  : "text-forest-400/50"
              }`}
            >
              {day}
              {clickable && !isSelected && (
                <span
                  className={`absolute bottom-1.5 h-1 w-1 rounded-full ${
                    saunaDay ? "bg-gold" : isPass ? "bg-forest-700/50" : "bg-forest-700"
                  }`}
                />
              )}
            </motion.button>
          );
        })}
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-4 text-[11px] text-forest-700/70">
        {!isPass && (
          <>
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-gold" /> Sauna &amp; plunge
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-forest-700" /> Plunge only
            </span>
          </>
        )}
        <span className="flex items-center gap-1.5">
          <span className="h-3 w-3 rounded-full bg-forest-900" /> Selected
        </span>
      </div>
    </div>
  );
}
