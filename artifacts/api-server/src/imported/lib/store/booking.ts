import { unstable_cache } from "@/cache";
import { supabaseAdmin } from "@/imported/lib/supabase";
import {
  DEFAULT_SAUNA_CONFIG,
  SAUNA_TICKETS,
  isSaunaDay,
  resolveSaunaConfig,
  timeGrid,
  ukNow,
  type SaunaConfig,
  type TicketType,
} from "@/imported/lib/cms/sauna";

export type HealthForm = {
  full_name: string;
  email: string;
  phone: string;
  age_confirmed: boolean;
  emergency_contact: string;
  medical_conditions: boolean;
  medical_details: string;
  cold_water_experience: string;
  consent: boolean;
};

export type SessionSlot = {
  id: number | null; // null until first booking auto-provisions the row
  date: string;
  time: string;
  capacity: number;
  price_pence: number;
  is_active: boolean;
  source: "manual" | "auto";
  available: number;
  saunaAvailable: boolean;
};

export type Slot = {
  id: number;
  date: string;
  time: string;
  capacity: number;
  price_pence: number;
  is_active: boolean;
  source: "manual" | "auto";
  created_at: string;
};

export type Booking = {
  id: number;
  ref: string;
  slot_id: number | null;
  customer_name: string | null;
  customer_email: string | null;
  customer_phone: string | null;
  party_size: number;
  health_form: HealthForm;
  status: "pending" | "paid" | "requested" | "cancelled";
  stripe_session_id: string | null;
  stripe_payment_intent: string | null;
  ticket_type: TicketType;
  unit_price_pence: number | null;
  session_date: string | null;
  session_time: string | null;
  pass_end: string | null;
  created_at: string;
  paid_at: string | null;
};

export type AdminBooking = Booking & { slot_date: string; slot_time: string };

// ---------- Schedule config -----------------------------------------------

export const getSaunaConfig = unstable_cache(
  async (): Promise<SaunaConfig> => {
    try {
      const { data } = await supabaseAdmin()
        .from("site_settings")
        .select("value")
        .eq("key", "sauna")
        .maybeSingle();
      return resolveSaunaConfig(data?.value ?? {});
    } catch {
      return DEFAULT_SAUNA_CONFIG;
    }
  },
  ["sauna-config"],
  { tags: ["sauna-config", "site-settings"], revalidate: 300 }
);

// ---------- Public reads ---------------------------------------------------

type AvailabilityRow = {
  id: number;
  date: string;
  time: string;
  capacity: number;
  price_pence: number;
  is_active: boolean;
  source: "manual" | "auto";
  available: number;
};

async function getRowsForDate(date: string): Promise<AvailabilityRow[]> {
  const { data, error } = await supabaseAdmin()
    .from("sauna_slot_availability")
    .select("*")
    .eq("date", date);
  if (error) throw new Error(error.message);
  return (data ?? []) as AvailabilityRow[];
}

/**
 * Generate the bookable sessions for a date from the schedule rules,
 * merging any DB rows (capacity overrides, closures, existing bookings).
 */
export async function getSessionsForDate(
  date: string,
  config?: SaunaConfig
): Promise<{ date: string; saunaDay: boolean; sessions: SessionSlot[] }> {
  const cfg = config ?? (await getSaunaConfig());
  const rows = await getRowsForDate(date);
  const byTime = new Map(rows.map((r) => [r.time, r]));
  const saunaDay = isSaunaDay(date, cfg);
  const now = ukNow();
  const isToday = date === now.date;

  const sessions: SessionSlot[] = [];
  for (const time of timeGrid(cfg)) {
    if (isToday && time <= now.time) continue; // start time already passed
    const row = byTime.get(time);
    if (row && !row.is_active) continue; // admin closure
    sessions.push({
      id: row?.id ?? null,
      date,
      time,
      capacity: row?.capacity ?? cfg.capacity,
      price_pence: row?.price_pence ?? 0,
      is_active: true,
      source: row?.source ?? "auto",
      available: row ? Math.max(0, row.available) : cfg.capacity,
      saunaAvailable: saunaDay,
    });
  }
  return { date, saunaDay, sessions };
}

/** Month overview: every date the selected ticket could start. */
export function getBookableDates(
  year: number,
  month: number,
  config: SaunaConfig,
  ticketType: TicketType
): { date: string; sauna: boolean }[] {
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const today = ukNow().date;
  const needsSauna = SAUNA_TICKETS[ticketType].needsSauna;
  const out: { date: string; sauna: boolean }[] = [];
  for (let d = 1; d <= daysInMonth; d++) {
    const date = `${year}-${String(month + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
    if (date < today) continue;
    const sauna = isSaunaDay(date, config);
    if (needsSauna && !sauna) continue;
    out.push({ date, sauna });
  }
  return out;
}

export async function getSlot(id: number): Promise<Slot | null> {
  const { data } = await supabaseAdmin()
    .from("sauna_slots")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  return (data as Slot | null) ?? null;
}

// ---------- Checkout (atomic via Postgres RPC) ----------------------------

/** Find-or-create the shared capacity pool row for a date+time. */
export async function ensureSlot(params: {
  date: string;
  time: string;
  capacity: number;
}): Promise<Slot> {
  const { data, error } = await supabaseAdmin()
    .rpc("ensure_sauna_slot", {
      p_date: params.date,
      p_time: params.time,
      p_capacity: params.capacity,
      p_price: 0,
    })
    .single();
  if (error) throw new Error(error.message);
  return data as Slot;
}

export async function bookSlot(params: {
  slotId: number;
  name?: string | null;
  email?: string | null;
  phone?: string | null;
  partySize: number;
  ticketType: TicketType;
  unitPricePence: number;
  healthForm?: HealthForm | null;
  status: "pending" | "requested";
}): Promise<{ ok: true; booking: Booking } | { ok: false; code: string; error: string }> {
  const { data, error } = await supabaseAdmin()
    .rpc("book_sauna_slot", {
      p: {
        slot_id: params.slotId,
        name: params.name ?? null,
        email: params.email ?? null,
        phone: params.phone ?? null,
        party_size: params.partySize,
        health_form: params.healthForm ?? null,
        status: params.status,
        ticket_type: params.ticketType,
        unit_price_pence: params.unitPricePence,
      },
    })
    .single();
  if (error) throw new Error(error.message);
  return data as { ok: true; booking: Booking } | { ok: false; code: string; error: string };
}

export async function createPass(params: {
  startDate: string;
  validityDays: number;
  name?: string | null;
  email?: string | null;
  phone?: string | null;
  ticketType: TicketType;
  unitPricePence: number;
  healthForm?: HealthForm | null;
  status: "pending" | "requested";
}): Promise<{ ok: true; booking: Booking } | { ok: false; code: string; error: string }> {
  const { data, error } = await supabaseAdmin()
    .rpc("create_sauna_pass", {
      p: {
        start_date: params.startDate,
        validity_days: params.validityDays,
        name: params.name ?? null,
        email: params.email ?? null,
        phone: params.phone ?? null,
        health_form: params.healthForm ?? null,
        status: params.status,
        ticket_type: params.ticketType,
        unit_price_pence: params.unitPricePence,
      },
    })
    .single();
  if (error) throw new Error(error.message);
  return data as { ok: true; booking: Booking } | { ok: false; code: string; error: string };
}

// ---------- Confirmation / webhook ----------------------------------------

export async function getBookingByRef(ref: string): Promise<Booking | null> {
  const { data } = await supabaseAdmin()
    .from("sauna_bookings")
    .select("*")
    .eq("ref", ref)
    .maybeSingle();
  return (data as Booking | null) ?? null;
}

export async function getBookingById(id: number): Promise<Booking | null> {
  const { data } = await supabaseAdmin()
    .from("sauna_bookings")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  return (data as Booking | null) ?? null;
}

export async function getBookingByStripeSession(sessionId: string): Promise<Booking | null> {
  const { data } = await supabaseAdmin()
    .from("sauna_bookings")
    .select("*")
    .eq("stripe_session_id", sessionId)
    .maybeSingle();
  return (data as Booking | null) ?? null;
}

export async function setStripeSession(bookingId: number, sessionId: string): Promise<void> {
  const { error } = await supabaseAdmin()
    .from("sauna_bookings")
    .update({ stripe_session_id: sessionId })
    .eq("id", bookingId);
  if (error) throw new Error(error.message);
}

/** Populate contact details collected on the Stripe Checkout page. */
export async function setBookingCustomer(
  bookingId: number,
  details: { name?: string | null; email?: string | null; phone?: string | null }
): Promise<boolean> {
  const patch: Record<string, string> = {};
  if (details.name?.trim()) patch.customer_name = details.name.trim();
  if (details.email?.trim()) patch.customer_email = details.email.trim();
  if (details.phone?.trim()) patch.customer_phone = details.phone.trim();
  if (Object.keys(patch).length === 0) return true;
  const { error } = await supabaseAdmin()
    .from("sauna_bookings")
    .update(patch)
    .eq("id", bookingId);
  if (error) throw new Error(error.message);
  return true;
}

export async function markBookingPaid(
  bookingId: number,
  paymentIntent: string | null
): Promise<boolean> {
  const { data, error } = await supabaseAdmin()
    .rpc("mark_sauna_booking_paid", {
      p_booking_id: bookingId,
      p_payment_intent: paymentIntent,
    })
    .single();
  if (error) throw new Error(error.message);
  return Boolean(data);
}

// ---------- Admin ----------------------------------------------------------

export async function listSlots(): Promise<AvailabilityRow[]> {
  const { data } = await supabaseAdmin()
    .from("sauna_slot_availability")
    .select("*")
    .order("date")
    .order("time");
  return ((data ?? []) as AvailabilityRow[]) ?? [];
}

export async function createSlot(input: {
  date: string;
  time: string;
  capacity: number;
  pricePence: number;
  isActive: boolean;
}): Promise<number> {
  // Upsert so an admin override/closure replaces an auto-provisioned row
  const { data, error } = await supabaseAdmin()
    .from("sauna_slots")
    .upsert(
      {
        date: input.date,
        time: input.time,
        capacity: input.capacity,
        price_pence: input.pricePence,
        is_active: input.isActive,
        source: "manual",
      },
      { onConflict: "date,time" }
    )
    .select("id")
    .single();
  if (error) throw new Error(error.message);
  return data.id as number;
}

export async function setSlotActive(id: number, active: boolean): Promise<boolean> {
  const { error } = await supabaseAdmin()
    .from("sauna_slots")
    .update({ is_active: active, source: "manual" })
    .eq("id", id);
  return !error;
}

export async function deleteSlot(id: number): Promise<boolean> {
  const { error } = await supabaseAdmin().from("sauna_slots").delete().eq("id", id);
  if (error) return false;
  return true;
}

export async function listBookings(): Promise<AdminBooking[]> {
  const { data } = await supabaseAdmin()
    .from("sauna_bookings")
    .select("*, slot:sauna_slots(date, time)")
    .order("created_at", { ascending: false });
  return ((data ?? []) as unknown as Array<
    Booking & { slot: { date: string; time: string } | null }
  >).map((b) => ({
    ...b,
    slot_date: b.session_date ?? b.slot?.date ?? "—",
    slot_time: b.session_time ?? b.slot?.time ?? "—",
  }));
}

export async function setBookingStatus(ref: string, status: Booking["status"]): Promise<boolean> {
  const patch: Partial<Booking> = { status };
  if (status === "paid") patch.paid_at = new Date().toISOString();
  const { error } = await supabaseAdmin()
    .from("sauna_bookings")
    .update(patch)
    .eq("ref", ref);
  return !error;
}
