import type { JsonRequest as Request } from "@/native-request";
import { requireAdmin } from "@/imported/lib/auth";
import { deleteSlot, setSlotActive } from "@/imported/lib/store/booking";

type Params = { params: Promise<{ id: string }> };

export async function DELETE(_req: Request, { params }: Params) {
  const guard = await requireAdmin();
  if (guard instanceof Response) return guard;
  const { id } = await params;
  const ok = await deleteSlot(Number(id));
  if (!ok) {
    return Response.json(
      { error: "Cannot delete a session that has bookings — close it instead." },
      { status: 400 }
    );
  }
  return Response.json({ ok: true });
}

export async function PATCH(req: Request, { params }: Params) {
  const guard = await requireAdmin();
  if (guard instanceof Response) return guard;
  const { id } = await params;
  const body = await req.json().catch(() => null);
  if (typeof body?.isActive !== "boolean") {
    return Response.json({ error: "isActive boolean required." }, { status: 400 });
  }
  const ok = await setSlotActive(Number(id), body.isActive);
  if (!ok) {
    return Response.json({ error: "Could not update session." }, { status: 400 });
  }
  return Response.json({ ok: true });
}
