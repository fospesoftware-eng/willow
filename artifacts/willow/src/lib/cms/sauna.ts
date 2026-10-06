// Isomorphic sauna ticket catalog + schedule rules.
// No server-only imports — safe in client components.

export type TicketType =
  | "sauna_plunge"
  | "plunge_only"
  | "weekly_pass"
  | "monthly_pass";

export type TicketKind = "single" | "pass";

export type TicketDef = {
  type: TicketType;
  name: string;
  shortName: string;
  blurb: string;
  kind: TicketKind;
  needsSauna: boolean;
  validityDays?: number;
  defaultPricePence: number;
};

export const SAUNA_TICKETS: Record<TicketType, TicketDef> = {
  sauna_plunge: {
    type: "sauna_plunge",
    name: "Sauna & Plunge",
    shortName: "Sauna & Plunge",
    blurb: "Wood-fired sauna session with a cold-water plunge.",
    kind: "single",
    needsSauna: true,
    defaultPricePence: 1000,
  },
  plunge_only: {
    type: "plunge_only",
    name: "Plunge Only",
    shortName: "Plunge Only",
    blurb: "Cold-water bathing in the natural dip lake, no sauna.",
    kind: "single",
    needsSauna: false,
    defaultPricePence: 500,
  },
  weekly_pass: {
    type: "weekly_pass",
    name: "Weekly Pass",
    shortName: "Weekly Pass",
    blurb: "Unlimited bathing for 7 consecutive days.",
    kind: "pass",
    needsSauna: false,
    validityDays: 7,
    defaultPricePence: 2000,
  },
  monthly_pass: {
    type: "monthly_pass",
    name: "Monthly Pass",
    shortName: "Monthly Pass",
    blurb: "Unlimited bathing for 30 consecutive days.",
    kind: "pass",
    needsSauna: false,
    validityDays: 30,
    defaultPricePence: 4000,
  },
};

export const TICKET_ORDER: TicketType[] = [
  "sauna_plunge",
  "plunge_only",
  "weekly_pass",
  "monthly_pass",
];

export type SaunaConfig = {
  // JS getDay(): 0 Sunday … 6 Saturday
  saunaDays: number[];
  openTime: string;
  closeTime: string;
  intervalMinutes: number;
  capacity: number;
  maxParty: number;
  prices: Record<TicketType, number>;
};

export const DEFAULT_SAUNA_CONFIG: SaunaConfig = {
  saunaDays: [0, 4, 6], // Thursday, Saturday, Sunday
  openTime: "07:00",
  closeTime: "19:00",
  intervalMinutes: 60,
  capacity: 6,
  maxParty: 6,
  prices: {
    sauna_plunge: 1000,
    plunge_only: 500,
    weekly_pass: 2000,
    monthly_pass: 4000,
  },
};

export function resolveSaunaConfig(raw: unknown): SaunaConfig {
  const r = (raw ?? {}) as Partial<{
    saunaDays: number[];
    openTime: string;
    closeTime: string;
    intervalMinutes: number;
    capacity: number;
    maxParty: number;
    prices: Partial<Record<TicketType, number>>;
  }>;
  const days =
    Array.isArray(r.saunaDays) && r.saunaDays.length > 0
      ? r.saunaDays.map(Number).filter((d) => d >= 0 && d <= 6)
      : DEFAULT_SAUNA_CONFIG.saunaDays;
  const toMin = (t: string | undefined) => {
    const m = /^(\d{2}):(\d{2})$/.exec(t ?? "");
    return m ? Number(m[1]) * 60 + Number(m[2]) : null;
  };
  const open = toMin(r.openTime) ?? 7 * 60;
  const close = toMin(r.closeTime) ?? 19 * 60;
  const interval =
    Number.isInteger(r.intervalMinutes) && (r.intervalMinutes as number) >= 15
      ? (r.intervalMinutes as number)
      : 60;
  const num = (v: unknown, d: number) => {
    const n = Number(v);
    return Number.isFinite(n) && n > 0 ? n : d;
  };
  const prices = { ...DEFAULT_SAUNA_CONFIG.prices } as Record<TicketType, number>;
  for (const k of TICKET_ORDER) {
    const p = Number(r.prices?.[k]);
    if (Number.isFinite(p) && p >= 0) prices[k] = p;
  }
  return {
    saunaDays: days,
    openTime: minToHM(open),
    closeTime: minToHM(Math.max(close, open + interval)),
    intervalMinutes: interval,
    capacity: num(r.capacity, 6),
    maxParty: num(r.maxParty, 6),
    prices,
  };
}

function minToHM(min: number) {
  return `${String(Math.floor(min / 60)).padStart(2, "0")}:${String(min % 60).padStart(2, "0")}`;
}

export function ticketPrice(config: SaunaConfig, type: TicketType): number {
  return config.prices[type] ?? SAUNA_TICKETS[type].defaultPricePence;
}

// ---------- date/time helpers (all wall-clock, UK site) --------------------

function hmToMin(t: string) {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
}

/** Start-time grid; last start leaves one full interval before close. */
export function timeGrid(config: SaunaConfig): string[] {
  const start = hmToMin(config.openTime);
  const end = hmToMin(config.closeTime);
  const out: string[] = [];
  for (let t = start; t + config.intervalMinutes <= end; t += config.intervalMinutes) {
    out.push(minToHM(t));
  }
  return out;
}

/** Weekday (JS getDay, UTC-safe for YYYY-MM-DD) of a date string. */
export function weekdayOf(dateStr: string): number {
  return new Date(`${dateStr}T00:00:00Z`).getUTCDay();
}

export function isSaunaDay(dateStr: string, config: SaunaConfig): boolean {
  return config.saunaDays.includes(weekdayOf(dateStr));
}

/** Whether a ticket can start on the given date (ignoring same-day time cutoff). */
export function ticketAllowedOnDate(
  type: TicketType,
  dateStr: string,
  config: SaunaConfig
): boolean {
  const def = SAUNA_TICKETS[type];
  if (!def.needsSauna) return true; // plunge-only and passes: every day
  return isSaunaDay(dateStr, config);
}

/** Current UK wall-clock date/time (Europe/London), accounting for BST. */
export function ukNow(): { date: string; time: string } {
  const fmt = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Europe/London",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
  const parts = fmt.formatToParts(new Date());
  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? "00";
  return {
    date: `${get("year")}-${get("month")}-${get("day")}`,
    time: `${get("hour") === "24" ? "00" : get("hour")}:${get("minute")}`,
  };
}

export function addDays(dateStr: string, days: number): string {
  const d = new Date(`${dateStr}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}

export function passEndDate(start: string, type: TicketType): string {
  const days = SAUNA_TICKETS[type].validityDays ?? 0;
  return addDays(start, Math.max(0, days - 1));
}

export function formatHM(t: string): string {
  const [h, m] = t.split(":").map(Number);
  const ampm = h >= 12 ? "pm" : "am";
  const hr = h % 12 === 0 ? 12 : h % 12;
  return `${hr}${m === 0 ? "" : ":" + String(m).padStart(2, "0")}${ampm}`;
}

export function formatDateLong(dateStr: string): string {
  return new Date(`${dateStr}T00:00:00Z`).toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
}

export function formatDateShort(dateStr: string): string {
  return new Date(`${dateStr}T00:00:00Z`).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });
}

export function formatGBP(pence: number): string {
  return `£${(pence / 100).toFixed(2)}`;
}

export const SAUNA_DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
