import type { JsonRequest as Request } from "@/native-request";
import { revalidatePath } from "@/cache";
import { requireAdmin } from "@/imported/lib/auth";
import { adminListLakes, updateLake } from "@/imported/lib/store/content";

export async function GET() {
  const guard = await requireAdmin();
  if (guard instanceof Response) return guard;
  return Response.json({ lakes: await adminListLakes() });
}

const EDITABLE: (keyof Awaited<ReturnType<typeof adminListLakes>>[number])[] = [
  "name",
  "number",
  "tagline",
  "category",
  "description",
  "image",
  "species",
  "features",
  "status",
  "status_note",
  "booking_url",
  "booking_label",
  "seo_title",
  "seo_description",
  "og_image",
];

export async function PATCH(req: Request) {
  const guard = await requireAdmin();
  if (guard instanceof Response) return guard;

  const body = await req.json().catch(() => null);
  if (!body?.slug) {
    return Response.json({ error: "slug required" }, { status: 400 });
  }
  const patch: Record<string, unknown> = {};
  for (const key of EDITABLE) {
    if (key in body) patch[key] = body[key];
  }
  try {
    await updateLake(body.slug, patch);
    revalidatePath("/", "layout");
    revalidatePath(`/lakes/${body.slug}`);
    return Response.json({ ok: true });
  } catch (err) {
    return Response.json({ error: String(err) }, { status: 500 });
  }
}
