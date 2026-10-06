import type { JsonRequest as Request } from "@/native-request";
import { requireAdmin } from "@/imported/lib/auth";
import { setBookingStatus } from "@/imported/lib/store/booking";

const STATUSES = ["pending", "paid", "requested", "cancelled"];

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ ref: string }> }
) {
  const guard = await requireAdmin();
  if (guard instanceof Response) return guard;
  const { ref } = await params;
  const { status } = await req.json().catch(() => ({}));
  if (!STATUSES.includes(status)) {
    return Response.json({ error: "Invalid status." }, { status: 400 });
  }
  const ok = await setBookingStatus(ref, status);
  return Response.json({ ok });
}
