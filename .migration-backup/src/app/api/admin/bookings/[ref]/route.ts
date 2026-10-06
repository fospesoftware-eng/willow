import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { setBookingStatus } from "@/lib/store/booking";

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
    return NextResponse.json({ error: "Invalid status." }, { status: 400 });
  }
  const ok = await setBookingStatus(ref, status);
  return NextResponse.json({ ok });
}
