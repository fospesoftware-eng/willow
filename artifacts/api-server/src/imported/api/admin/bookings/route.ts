import { requireAdmin } from "@/imported/lib/auth";
import { listBookings } from "@/imported/lib/store/booking";

export async function GET() {
  const guard = await requireAdmin();
  if (guard instanceof Response) return guard;
  return Response.json({ bookings: await listBookings() });
}
