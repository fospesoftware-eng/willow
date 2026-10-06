import Link from "@/lib/next/link";
import type { Booking } from "@/lib/store/booking";
type BookingConfirmation = Pick<Booking, "ref" | "ticket_type" | "session_date" | "session_time" | "pass_end" | "party_size" | "unit_price_pence" | "status">;
import { formatPrice } from "@/lib/format";
import {
  SAUNA_TICKETS,
  formatDateLong,
  formatHM,
  type TicketType,
} from "@/lib/cms/sauna";

type Props = {
  searchParams: Promise<{ ref?: string; session_id?: string }>;
};

export default async function ConfirmationPage({ searchParams }: Props) {
  const { ref, session_id } = await searchParams;
  let booking: BookingConfirmation | null = null;
  const qs = session_id
    ? `session_id=${encodeURIComponent(session_id)}`
    : ref
      ? `ref=${encodeURIComponent(ref)}`
      : "";
  if (qs) {
    try {
      const res = await fetch(`/api/booking/confirmation?${qs}`, { cache: "no-store" });
      if (res.ok) booking = ((await res.json()) as BookingConfirmation | null) ?? null;
    } catch {
      booking = null;
    }
  }

  const ticket = booking
    ? SAUNA_TICKETS[(booking.ticket_type ?? "sauna_plunge") as TicketType]
    : null;
  const isPass = ticket?.kind === "pass";
  const amount = (booking?.unit_price_pence ?? 0) * (booking?.party_size ?? 1);

  return (
    <section className="bg-cream py-24 md:py-32">
      <div className="mx-auto max-w-2xl px-5 text-center md:px-10">
        {booking && ticket ? (
          <>
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gold text-3xl text-forest-950">
              ✓
            </div>
            <h1 className="mt-8 font-display text-4xl font-extrabold uppercase text-forest-900 md:text-5xl">
              {booking.status === "paid"
                ? isPass
                  ? "Pass confirmed"
                  : "Booking confirmed"
                : "Booking received"}
            </h1>
            <p className="mt-4 text-forest-700/80">
              {booking.status === "paid"
                ? "Your payment was successful. We look forward to welcoming you to Willow Garth."
                : "We've received your booking request. A member of the team will contact you to complete payment and confirm your place."}
            </p>

            <div className="mt-10 rounded-[1.75rem] border border-forest-900/10 bg-ivory p-8 text-left shadow-card">
              <dl className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <dt className="text-forest-600">Booking reference</dt>
                  <dd className="font-mono font-bold text-forest-900">{booking.ref}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-forest-600">Ticket</dt>
                  <dd className="font-medium text-forest-900">{ticket.name}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-forest-600">{isPass ? "Valid from" : "Session"}</dt>
                  <dd className="text-right font-medium text-forest-900">
                    {booking.session_date
                      ? formatDateLong(booking.session_date)
                      : "—"}
                    {!isPass && booking.session_time ? ` at ${formatHM(booking.session_time)}` : ""}
                  </dd>
                </div>
                {isPass && (
                  <div className="flex justify-between">
                    <dt className="text-forest-600">Valid until</dt>
                    <dd className="font-medium text-forest-900">
                      {booking.pass_end ? formatDateLong(booking.pass_end) : "—"}
                    </dd>
                  </div>
                )}
                {!isPass && (
                  <div className="flex justify-between">
                    <dt className="text-forest-600">People</dt>
                    <dd className="font-medium text-forest-900">{booking.party_size}</dd>
                  </div>
                )}
                <div className="my-2 border-t border-forest-900/10" />
                <div className="flex justify-between">
                  <dt className="font-semibold text-forest-900">Amount</dt>
                  <dd className="font-display text-lg font-extrabold text-forest-900">
                    {formatPrice(amount)}
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-forest-600">Status</dt>
                  <dd
                    className={`font-semibold uppercase ${
                      booking.status === "paid" ? "text-green-700" : "text-gold"
                    }`}
                  >
                    {booking.status}
                  </dd>
                </div>
              </dl>
            </div>

            <div className="mt-6 flex items-start gap-4 rounded-2xl border border-gold/40 bg-gold/[0.08] p-6 text-left">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gold/20 text-earth-700">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 9v4M12 17h.01" />
                  <path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z" />
                </svg>
              </span>
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-earth-700">
                  Before your session
                </p>
                <p className="mt-2 text-[13px] leading-relaxed text-forest-800">
                  Every guest must complete the short health &amp; safety
                  declaration onsite before entering the water. Arrive a few
                  minutes early, or{" "}
                  <Link
                    href="/sentinal"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-bold underline decoration-gold decoration-2 underline-offset-4"
                  >
                    complete the form now (opens in a new tab) ↗
                  </Link>
                  .
                </p>
              </div>
            </div>

            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link
                href="/"
                className="inline-flex items-center gap-2 rounded-full bg-forest-900 px-6 py-3 text-[12px] font-semibold uppercase tracking-[0.16em] text-ivory hover:bg-forest-700"
              >
                Back to Willow Garth
              </Link>
              <Link
                href="/experiences/sauna-dip"
                className="inline-flex items-center gap-2 rounded-full border border-forest-900/25 px-6 py-3 text-[12px] font-semibold uppercase tracking-[0.16em] text-forest-900 hover:bg-forest-900 hover:text-ivory"
              >
                About Sauna &amp; Dip
              </Link>
            </div>
          </>
        ) : (
          <>
            <h1 className="font-display text-4xl font-extrabold uppercase text-forest-900">
              Booking not found
            </h1>
            <p className="mt-4 text-forest-700/80">
              We couldn&apos;t find that booking reference. Please contact us if you
              need help.
            </p>
            <Link
              href="/book/sauna"
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-forest-900 px-6 py-3 text-[12px] font-semibold uppercase tracking-[0.16em] text-ivory hover:bg-forest-700"
            >
              Book a session →
            </Link>
          </>
        )}
      </div>
    </section>
  );
}
