import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { ensurePageRows, listPagesFromDb } from "@/lib/store/pages";

export async function GET() {
  const guard = await requireAdmin();
  if (guard instanceof Response) return guard;
  await ensurePageRows();
  return NextResponse.json({ pages: await listPagesFromDb() });
}
