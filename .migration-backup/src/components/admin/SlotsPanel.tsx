"use client";

import { useEffect, useState } from "react";

type SlotRow = {
  id: number;
  date: string;
  time: string;
  capacity: number;
  price_pence: number;
  is_active: boolean;
  source: "manual" | "auto";
  available: number;
};

const inputCls =
  "w-full rounded-lg border border-forest-900/15 bg-white px-3 py-2.5 text-sm text-forest-900 outline-none transition focus:border-gold";

export function SlotsPanel() {
  const [slots, setSlots] = useState<SlotRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    date: "",
    time: "10:00",
    capacity: 6,
    mode: "open" as "open" | "closed",
  });
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);

  async function load() {
    setLoading(true);
    const res = await fetch("/api/admin/slots", { cache: "no-store" });
    if (res.ok) {
      const data = await res.json();
      setSlots(data.slots ?? []);
    }
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function saveOverride(e: React.FormEvent) {
    e.preventDefault();
    setMsg(null);
    const res = await fetch("/api/admin/slots", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        date: form.date,
        time: form.time,
        capacity: Number(form.capacity),
        pricePence: 0,
        isActive: form.mode === "open",
      }),
    });
    const data = await res.json();
    if (res.ok) {
      setMsg({
        ok: true,
        text: form.mode === "closed" ? "Session closed." : "Capacity override saved.",
      });
      setForm({ date: "", time: "10:00", capacity: 6, mode: "open" });
      load();
    } else {
      setMsg({ ok: false, text: data.error ?? "Could not save." });
    }
  }

  async function toggle(row: SlotRow, active: boolean) {
    const res = await fetch(`/api/admin/slots/${row.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isActive: active }),
    });
    if (res.ok) {
      setSlots((prev) => prev.map((s) => (s.id === row.id ? { ...s, is_active: active, source: "manual" } : s)));
    }
  }

  async function remove(row: SlotRow) {
    if (!confirm("Remove this override and restore the automatic schedule?")) return;
    const res = await fetch(`/api/admin/slots/${row.id}`, { method: "DELETE" });
    if (res.ok) setSlots((prev) => prev.filter((s) => s.id !== row.id));
    else {
      const d = await res.json();
      alert(d.error ?? "Could not delete — it has bookings. Use Close instead.");
    }
  }

  const today = new Date().toISOString().slice(0, 10);
  const upcoming = slots.filter((s) => s.date >= today);
  const past = slots.filter((s) => s.date < today);

  return (
    <div className="grid gap-6 lg:grid-cols-[380px_1fr]">
      {/* Override / closure form */}
      <div className="h-fit rounded-xl border border-forest-900/10 bg-white p-6 shadow-card">
        <h2 className="font-display text-lg font-bold text-forest-900">
          Session override
        </h2>
        <p className="mt-1 text-xs leading-relaxed text-forest-600">
          Sessions are created automatically from the schedule in{" "}
          <strong>Site Settings → Sauna schedule &amp; pricing</strong> (bathing
          7am–7pm, sauna Thu/Sat/Sun). Use this to change capacity for one session
          or to close bathing at a specific time.
        </p>
        <form onSubmit={saveOverride} className="mt-5 space-y-4">
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-forest-500">Date</label>
            <input
              type="date"
              required
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
              className={inputCls}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-forest-500">Time</label>
              <input
                type="time"
                required
                value={form.time}
                onChange={(e) => setForm({ ...form, time: e.target.value })}
                className={inputCls}
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-forest-500">Capacity</label>
              <input
                type="number"
                min={1}
                max={20}
                disabled={form.mode === "closed"}
                required
                value={form.capacity}
                onChange={(e) => setForm({ ...form, capacity: Number(e.target.value) })}
                className={`${inputCls} disabled:opacity-40`}
              />
            </div>
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-forest-500">Mode</label>
            <select
              value={form.mode}
              onChange={(e) => setForm({ ...form, mode: e.target.value as "open" | "closed" })}
              className={inputCls}
            >
              <option value="open">Open — bookable</option>
              <option value="closed">Closed — no bathing</option>
            </select>
          </div>

          {msg && (
            <p className={`rounded-lg px-3 py-2 text-xs ${msg.ok ? "bg-emerald-50 text-emerald-800" : "bg-red-50 text-red-700"}`}>
              {msg.text}
            </p>
          )}

          <button
            type="submit"
            className="w-full rounded-lg bg-forest-900 px-5 py-3 text-xs font-bold uppercase tracking-[0.18em] text-ivory transition hover:bg-forest-800"
          >
            Save override
          </button>
        </form>
      </div>

      {/* Overrides / provisioned sessions */}
      <div>
        {loading ? (
          <p className="py-12 text-center text-sm text-forest-600">Loading sessions…</p>
        ) : upcoming.length === 0 ? (
          <div className="rounded-xl border border-dashed border-forest-900/20 bg-white/60 py-16 text-center text-sm text-forest-700">
            No overrides yet — the automatic schedule is active for every future
            date.
          </div>
        ) : (
          <div className="overflow-hidden rounded-xl border border-forest-900/10 bg-white shadow-card">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-forest-900/10 bg-cream/60 text-[0.65rem] uppercase tracking-wider text-forest-500">
                <tr>
                  <th className="px-5 py-3">Date</th>
                  <th className="px-5 py-3">Time</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3">Places</th>
                  <th className="px-5 py-3">Type</th>
                  <th className="px-5 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-forest-900/5">
                {upcoming.map((s) => (
                  <tr key={s.id} className="hover:bg-cream/40">
                    <td className="px-5 py-3 font-semibold text-forest-900">{s.date}</td>
                    <td className="px-5 py-3 text-forest-800">{s.time}</td>
                    <td className="px-5 py-3">
                      {s.is_active ? (
                        <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-[0.65rem] font-bold uppercase text-emerald-800">Open</span>
                      ) : (
                        <span className="rounded-full bg-red-100 px-2.5 py-1 text-[0.65rem] font-bold uppercase text-red-700">Closed</span>
                      )}
                    </td>
                    <td className="px-5 py-3">
                      {s.is_active ? (
                        <span className={s.available === 0 ? "text-red-600" : "text-forest-800"}>
                          {s.available}/{s.capacity}
                        </span>
                      ) : (
                        "—"
                      )}
                    </td>
                    <td className="px-5 py-3">
                      <span className={`rounded-full px-2.5 py-1 text-[0.65rem] font-semibold uppercase ${s.source === "manual" ? "bg-gold/20 text-forest-800" : "bg-forest-900/5 text-forest-600"}`}>
                        {s.source === "manual" ? "Override" : "Auto"}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-right">
                      <div className="flex justify-end gap-3">
                        {s.is_active ? (
                          <button
                            onClick={() => toggle(s, false)}
                            className="text-xs font-semibold text-amber-700 hover:text-amber-800"
                          >
                            Close
                          </button>
                        ) : (
                          <button
                            onClick={() => toggle(s, true)}
                            className="text-xs font-semibold text-emerald-700 hover:text-emerald-800"
                          >
                            Reopen
                          </button>
                        )}
                        <button
                          onClick={() => remove(s)}
                          className="text-xs font-semibold text-red-600/80 hover:text-red-700"
                        >
                          Reset
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {past.length > 0 && (
          <details className="mt-4">
            <summary className="cursor-pointer text-xs font-semibold uppercase tracking-wider text-forest-500 hover:text-forest-800">
              Past sessions ({past.length})
            </summary>
            <div className="mt-2 overflow-hidden rounded-xl border border-forest-900/10 bg-white/70">
              <table className="w-full text-left text-xs">
                <tbody className="divide-y divide-forest-900/5">
                  {past.map((s) => (
                    <tr key={s.id}>
                      <td className="px-4 py-2 text-forest-700">{s.date} · {s.time}</td>
                      <td className="px-4 py-2 text-forest-500">{s.is_active ? `${s.available}/${s.capacity} places` : "closed"}</td>
                      <td className="px-4 py-2 text-right">
                        <button onClick={() => remove(s)} className="text-red-600/70 hover:text-red-700">Reset</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </details>
        )}
      </div>
    </div>
  );
}
