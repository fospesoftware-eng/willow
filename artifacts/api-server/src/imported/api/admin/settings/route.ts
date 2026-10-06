import type { JsonRequest as Request } from "@/native-request";
import { revalidatePath, revalidateTag } from "@/cache";
import { requireAdmin } from "@/imported/lib/auth";
import { adminGetSettingsRaw, setSetting } from "@/imported/lib/store/content";

export async function GET() {
  const guard = await requireAdmin();
  if (guard instanceof Response) return guard;
  return Response.json({ settings: await adminGetSettingsRaw() });
}

export async function PUT(req: Request) {
  const guard = await requireAdmin();
  if (guard instanceof Response) return guard;
  const body = await req.json().catch(() => null);
  if (!body?.key || typeof body.value !== "object") {
    return Response.json({ error: "key and value(object) required" }, { status: 400 });
  }
  await setSetting(body.key, body.value);
  revalidatePath("/", "layout");
  revalidateTag("site-settings", { expire: 0 });
  revalidateTag("sauna-config", { expire: 0 });
  return Response.json({ ok: true });
}
