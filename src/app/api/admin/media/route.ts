import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { listMedia, uploadMedia } from "@/lib/store/media";

const MAX_BYTES = 8 * 1024 * 1024; // 8MB
const ALLOWED = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/avif", "image/svg+xml"];

export async function GET() {
  const guard = await requireAdmin();
  if (guard instanceof Response) return guard;
  return NextResponse.json({ files: await listMedia() });
}

export async function POST(req: Request) {
  const guard = await requireAdmin();
  if (guard instanceof Response) return guard;

  const form = await req.formData().catch(() => null);
  const file = form?.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No file uploaded." }, { status: 400 });
  }
  if (!ALLOWED.includes(file.type)) {
    return NextResponse.json(
      { error: "Use JPG, PNG, WebP, GIF, AVIF or SVG images." },
      { status: 400 }
    );
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: "Image must be 8MB or smaller." }, { status: 400 });
  }

  const bytes = await file.arrayBuffer();
  const media = await uploadMedia(file.name, bytes, file.type);
  return NextResponse.json({ ok: true, file: media }, { status: 201 });
}
