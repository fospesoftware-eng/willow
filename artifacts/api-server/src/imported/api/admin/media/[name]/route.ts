import type { JsonRequest as Request } from "@/native-request";
import { requireAdmin } from "@/imported/lib/auth";
import { deleteMedia } from "@/imported/lib/store/media";

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ name: string }> }
) {
  const guard = await requireAdmin();
  if (guard instanceof Response) return guard;
  const { name } = await params;
  try {
    await deleteMedia(decodeURIComponent(name));
    return Response.json({ ok: true });
  } catch (err) {
    return Response.json({ error: String(err) }, { status: 400 });
  }
}
