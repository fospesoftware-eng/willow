import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { deleteMedia } from "@/lib/store/media";

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ name: string }> }
) {
  const guard = await requireAdmin();
  if (guard instanceof Response) return guard;
  const { name } = await params;
  try {
    await deleteMedia(decodeURIComponent(name));
    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 400 });
  }
}
