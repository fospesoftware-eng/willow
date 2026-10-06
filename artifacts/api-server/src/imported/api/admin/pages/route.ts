import { requireAdmin } from "@/imported/lib/auth";
import { ensurePageRows, listPagesFromDb } from "@/imported/lib/store/pages";

export async function GET() {
  const guard = await requireAdmin();
  if (guard instanceof Response) return guard;
  await ensurePageRows();
  return Response.json({ pages: await listPagesFromDb() });
}
