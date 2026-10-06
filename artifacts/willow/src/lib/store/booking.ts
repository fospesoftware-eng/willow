import type { TicketType } from "@/lib/cms/sauna";

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
