"use client";

import { useEffect, useMemo, useState } from "react";
import { SAUNA_TICKETS, type TicketType } from "@/lib/cms/sauna";

type AdminBooking = {
  ref: string;
  slot_date: string;
  slot_time: string;
  customer_name: string | null;
  customer_email: string | null;
  customer_phone: string | null;
  party_size: number;
  status: "pending" | "paid" | "requested" | "cancelled";
  ticket_type?: TicketType;
  unit_price_pence?: number | null;
  session_date?: string | null;
  session_time?: string | null;
  pass_end?: string | null;
  health_form: {
    emergency_contact?: string;
    medical_conditions?: boolean;
    medical_details?: string;
    cold_water_experience?: string;
    age_confirmed?: boolean;
  };
  created_at: string;
};

const STATUS_STYLES: Record<string, string> = {
  paid: "bg-emerald-100 text-emerald-800 border-emerald-200",
  pending: "bg-amber-100 text-amber-800 border-amber-200",
  requested: "bg-sky-100 text-sky-800 border-sky-200",
  cancelled: "bg-stone-200 text-stone-600 border-stone-300",
};

export function BookingsPanel() {
  const [bookings, setBookings] = useState<AdminBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("all");
  const [expanded, setExpanded] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/bookings", { cache: "no-store" });
      if (res.status === 401) {
        window.location.href = "/admin/login";
        return;
      }
      const data = await res.json();
      setBookings(data.bookings ?? []);
    } catch {
      setError("Could not load bookings. Is the database connected?");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function changeStatus(ref: string, status: string) {
    const res = await fetch(`/api/admin/bookings/${ref}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    if (res.ok) {
      setBookings((prev) => prev.map((b) => (b.ref === ref ? { ...b, status: status as AdminBooking["status"] } : b)));
    }
  }

  const filtered = useMemo(
    () => (filter === "all" ? bookings : bookings.filter((b) => b.status === filter)),
    [bookings, filter]
  );

  const counts = useMemo(() => {
    const c: Record<string, number> = { all: bookings.length };
    for (const b of bookings) c[b.status] = (c[b.status] ?? 0) + 1;
    return c;
  }, [bookings]);

  return (
    <div>
      <div className="mb-5 flex flex-wrap items-center gap-2">
        {["all", "paid", "pending", "requested", "cancelled"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-wider transition ${
              filter === f ? "bg-forest-900 text-ivory" : "bg-white text-forest-700 border border-forest-900/15"
            }`}
          >
            {f} {counts[f] ? `(${counts[f]})` : ""}
          </button>
        ))}
        <button onClick={load} className="ml-auto text-xs font-semibold text-forest-600 hover:text-gold">
          ↻ Refresh
        </button>
      </div>

      {loading && <p className="py-12 text-center text-sm text-forest-600">Loading bookings…</p>}
      {error && <p className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">{error}</p>}

      {!loading && !error && filtered.length === 0 && (
        <div className="rounded-xl border border-dashed border-forest-900/20 bg-white/60 py-16 text-center">
          <p className="text-sm text-forest-700">No bookings here yet.</p>
          <p className="mt-1 text-xs text-forest-500">New sauna reservations will appear in real time.</p>
        </div>
      )}

      <div className="space-y-3">
        {filtered.map((b) => (
          <div key={b.ref} className="overflow-hidden rounded-xl border border-forest-900/10 bg-white shadow-card">
            <button
              onClick={() => setExpanded(expanded === b.ref ? null : b.ref)}
              className="flex w-full flex-wrap items-center gap-x-4 gap-y-2 px-5 py-4 text-left transition hover:bg-cream/50"
            >
              <span className={`rounded-full border px-3 py-1 text-[0.65rem] font-bold uppercase tracking-wider ${STATUS_STYLES[b.status]}`}>
                {b.status}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-bold text-forest-900">
                  {b.customer_name ?? (b.status === "pending" ? "Awaiting payment details" : "—")}
                </p>
                <p className="truncate text-xs text-forest-600">{b.customer_email ?? "—"}</p>
              </div>
              <div className="text-right">
                {(() => {
                  const ticket = b.ticket_type ? SAUNA_TICKETS[b.ticket_type] : null;
                  const isPass = ticket?.kind === "pass";
                  const date = b.session_date ?? b.slot_date;
                  const time = b.session_time ?? b.slot_time;
                  return (
                    <>
                      {ticket && (
                        <p className="text-[0.65rem] font-bold uppercase tracking-wider text-gold">
                          {ticket.shortName}
                          {b.unit_price_pence != null && ` · £${((b.unit_price_pence * (isPass ? 1 : b.party_size)) / 100).toFixed(2)}`}
                        </p>
                      )}
                      {isPass ? (
                        <p className="text-sm font-semibold text-forest-900">
                          {date} → {b.pass_end ?? "—"}
                        </p>
                      ) : (
                        <p className="text-sm font-semibold text-forest-900">{date} · {time}</p>
                      )}
                      <p className="text-xs text-forest-500">
                        {isPass ? "Pass" : `Party of ${b.party_size}`} · {b.ref}
                      </p>
                    </>
                  );
                })()}
              </div>
            </button>

            {expanded === b.ref && (
              <div className="border-t border-forest-900/10 bg-cream/40 px-5 py-4">
                <dl className="grid gap-3 text-sm sm:grid-cols-2">
                  <div>
                    <dt className="text-xs uppercase tracking-wider text-forest-500">Ticket</dt>
                    <dd className="font-medium text-forest-900">
                      {b.ticket_type ? SAUNA_TICKETS[b.ticket_type].name : "Sauna booking"}
                      {b.unit_price_pence != null && (
                        <span className="ml-2 text-forest-500">
                          £{(b.unit_price_pence / 100).toFixed(2)}
                          {b.ticket_type && SAUNA_TICKETS[b.ticket_type].kind === "single" && b.party_size > 1
                            ? ` × ${b.party_size} = £${((b.unit_price_pence * b.party_size) / 100).toFixed(2)}`
                            : ""}
                        </span>
                      )}
                    </dd>
                  </div>
                  {(() => {
                    const ticket = b.ticket_type ? SAUNA_TICKETS[b.ticket_type] : null;
                    const date = b.session_date ?? b.slot_date;
                    return ticket?.kind === "pass" ? (
                      <div>
                        <dt className="text-xs uppercase tracking-wider text-forest-500">Pass valid</dt>
                        <dd className="font-medium text-forest-900">{date} → {b.pass_end ?? "—"}</dd>
                      </div>
                    ) : (
                      <div>
                        <dt className="text-xs uppercase tracking-wider text-forest-500">Session</dt>
                        <dd className="font-medium text-forest-900">{date} · {b.session_time ?? b.slot_time}</dd>
                      </div>
                    );
                  })()}
                  <div><dt className="text-xs uppercase tracking-wider text-forest-500">Phone</dt><dd className="font-medium text-forest-900">{b.customer_phone ?? "—"}</dd></div>
                  <div><dt className="text-xs uppercase tracking-wider text-forest-500">Health declaration</dt><dd className="font-medium text-forest-900">Completed onsite via Sentinel before the session</dd></div>
                  <div><dt className="text-xs uppercase tracking-wider text-forest-500">Booked</dt><dd className="font-medium text-forest-900">{new Date(b.created_at).toLocaleString("en-GB")}</dd></div>
                </dl>
                <div className="mt-4 flex flex-wrap items-center gap-2">
                  <span className="text-xs font-semibold uppercase tracking-wider text-forest-500">Set status:</span>
                  {(["paid", "requested", "pending", "cancelled"] as const).map((s) => (
                    <button
                      key={s}
                      disabled={s === b.status}
                      onClick={() => changeStatus(b.ref, s)}
                      className="rounded-full border border-forest-900/20 px-3 py-1 text-xs font-semibold capitalize text-forest-800 transition hover:border-gold hover:text-gold disabled:cursor-default disabled:opacity-40"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
