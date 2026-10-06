import type { JsonRequest as Request } from "@/native-request";
import { migrationLogger as log } from "@/migration-logger";
import { requireAdmin } from "@/imported/lib/auth";
import { createSlot, listSlots } from "@/imported/lib/store/booking";

export async function GET() {
  const guard = await requireAdmin();
  if (guard instanceof Response) return guard;
  return Response.json({ slots: await listSlots() });
}

export async function POST(req: Request) {
  const guard = await requireAdmin();
  if (guard instanceof Response) return guard;

  const body = await req.json().catch(() => null);
  if (!body?.date || !body?.time) {
    return Response.json({ error: "Date and time are required." }, { status: 400 });
  }
  const capacity = Math.max(1, Math.min(20, Number(body.capacity) || 6));
  const pricePence = Math.max(0, Math.round(Number(body.pricePence) || 0));
  const isActive = body.isActive !== false; // default open
  const time = String(body.time).slice(0, 5);
  if (!/^\d{2}:\d{2}$/.test(time)) {
    return Response.json({ error: "Time must be HH:MM." }, { status: 400 });
  }
  try {
    // Manual override / closure for a specific date+time
    const id = await createSlot({ date: body.date, time, capacity, pricePence, isActive });
    return Response.json({ ok: true, id }, { status: 201 });
  } catch (err) {
    log.error("[admin slots] upsert failed", err);
    return Response.json(
      { error: "Could not save that session." },
      { status: 409 }
    );
  }
}
