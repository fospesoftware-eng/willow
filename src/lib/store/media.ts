import { supabaseAdmin } from "@/lib/supabase";

const BUCKET = "media";

export type MediaFile = {
  name: string;
  url: string;
  size: number;
  mimetype: string;
  createdAt: string;
};

export function publicMediaUrl(name: string): string {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
  return `${url}/storage/v1/object/public/${BUCKET}/${name}`;
}

export async function listMedia(): Promise<MediaFile[]> {
  const { data, error } = await supabaseAdmin()
    .storage.from(BUCKET)
    .list("", { limit: 200, sortBy: { column: "created_at", order: "desc" } });
  if (error) throw new Error(error.message);
  return (data ?? [])
    .filter((f) => f.name && f.id)
    .map((f) => ({
      name: f.name,
      url: publicMediaUrl(f.name),
      size: f.metadata?.size ?? 0,
      mimetype: f.metadata?.mimetype ?? "application/octet-stream",
      createdAt: f.created_at ?? "",
    }));
}

export async function uploadMedia(
  fileName: string,
  bytes: ArrayBuffer,
  contentType: string
): Promise<MediaFile> {
  const safe = fileName
    .toLowerCase()
    .replace(/[^a-z0-9.\-_]+/g, "-")
    .replace(/-+/g, "-")
    .slice(-80);
  const path = `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}-${safe}`;

  const { error } = await supabaseAdmin()
    .storage.from(BUCKET)
    .upload(path, bytes, { contentType, upsert: false, cacheControl: "31536000" });
  if (error) throw new Error(error.message);

  return {
    name: path,
    url: publicMediaUrl(path),
    size: bytes.byteLength,
    mimetype: contentType,
    createdAt: new Date().toISOString(),
  };
}

export async function deleteMedia(name: string): Promise<void> {
  // Guard against path traversal
  if (name.includes("/") || name.includes("..")) throw new Error("Invalid file name");
  const { error } = await supabaseAdmin().storage.from(BUCKET).remove([name]);
  if (error) throw new Error(error.message);
}
