import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { listBookings } from "@/lib/store/booking";

export async function GET() {
  const guard = await requireAdmin();
  if (guard instanceof Response) return guard;
  return NextResponse.json({ bookings: await listBookings() });
}
