import type { Booking } from "../imported/lib/store/booking";

export type BookingConfirmation = Pick<Booking,
  "ref" | "ticket_type" | "session_date" | "session_time" | "pass_end" |
  "party_size" | "unit_price_pence" | "status"
>;

// An allowlist prevents new database columns from becoming public accidentally.
export function toBookingConfirmation(booking: Booking | null): BookingConfirmation | null {
  if (!booking) return null;
  return {
    ref: booking.ref,
    ticket_type: booking.ticket_type,
    session_date: booking.session_date,
    session_time: booking.session_time,
    pass_end: booking.pass_end,
    party_size: booking.party_size,
    unit_price_pence: booking.unit_price_pence,
    status: booking.status,
  };
}
