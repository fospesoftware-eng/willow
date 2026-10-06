"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export type MediaItem = {
  name: string;
  url: string;
  size: number;
  mimetype: string;
  createdAt: string;
};

export async function fetchMedia(): Promise<MediaItem[]> {
  const res = await fetch("/api/admin/media", { cache: "no-store" });
  if (res.status === 401) {
    window.location.href = "/admin/login";
    return [];
  }
  if (!res.ok) throw new Error("Failed to load media");
  const data = await res.json();
  return data.files ?? [];
}

export async function uploadMedia(file: File): Promise<MediaItem> {
  const body = new FormData();
  body.append("file", file);
  const res = await fetch("/api/admin/media", { method: "POST", body });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || "Upload failed");
  return data.file as MediaItem;
}

function Thumb({ url, className = "" }: { url: string; className?: string }) {
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={url} alt="" loading="lazy" className={`object-cover ${className}`} />;
}

export function ImagePicker({
  value,
  onChange,
  label = "Image",
}: {
  value: string;
  onChange: (url: string) => void;
  label?: string;
}) {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [manual, setManual] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      setItems(await fetchMedia());
    } catch (e) {
      setError(String(e));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (open && items.length === 0) load();
  }, [open, items.length, load]);

  async function onUpload(files: FileList | null) {
    if (!files || files.length === 0) return;
    setLoading(true);
    setError("");
    try {
      let first: MediaItem | null = null;
      for (const f of Array.from(files)) {
        const item = await uploadMedia(f);
        if (!first) first = item;
        setItems((prev) => [item, ...prev]);
      }
      if (first) onChange(first.url);
      await load();
    } catch (e) {
      setError(String(e));
    } finally {
      setLoading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  return (
    <div>
      {label && (
        <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.14em] text-forest-600">
          {label}
        </label>
      )}
      <div className="flex items-start gap-3">
        <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-forest-900/15 bg-forest-900/5">
          {value ? (
            <Thumb url={value} className="h-full w-full" />
          ) : (
            <span className="text-[10px] text-forest-600">No image</span>
          )}
        </div>
        <div className="flex-1 space-y-2">
          <input
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Image URL"
            className="w-full rounded-lg border border-forest-900/15 px-3 py-2 text-sm"
          />
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setOpen(true)}
              className="rounded-lg bg-forest-900 px-3 py-1.5 text-xs font-semibold text-ivory hover:bg-forest-700"
            >
              Media library
            </button>
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="rounded-lg border border-forest-900/20 px-3 py-1.5 text-xs font-semibold text-forest-800 hover:bg-forest-900/5"
            >
              Upload new
            </button>
            {value && (
              <button
                type="button"
                onClick={() => onChange("")}
                className="rounded-lg px-3 py-1.5 text-xs font-semibold text-red-700 hover:underline"
              >
                Remove
              </button>
            )}
            <button
              type="button"
              onClick={() => setManual((m) => !m)}
              className="rounded-lg px-3 py-1.5 text-xs text-forest-600 hover:underline"
            >
              {manual ? "Hide URL" : "Paste URL"}
            </button>
          </div>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={(e) => onUpload(e.target.files)}
          />
          {manual && (
            <input
              value={value}
              onChange={(e) => onChange(e.target.value)}
              placeholder="https://… or /images/…"
              className="w-full rounded-lg border border-dashed border-forest-900/25 px-3 py-2 text-xs"
            />
          )}
        </div>
      </div>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-forest-950/60 p-4"
          onClick={() => setOpen(false)}
        >
          <div
            className="flex max-h-[85vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl bg-ivory shadow-soft"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-forest-900/10 px-6 py-4">
              <h3 className="font-display text-lg font-bold text-forest-900">Media library</h3>
              <button onClick={() => setOpen(false)} className="text-forest-600 hover:text-forest-900">
                ✕
              </button>
            </div>
            <div className="border-b border-forest-900/10 px-6 py-3">
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                disabled={loading}
                className="rounded-lg bg-gold px-4 py-2 text-xs font-bold uppercase tracking-widest text-forest-950 hover:bg-gold-light disabled:opacity-50"
              >
                {loading ? "Working…" : "Upload images"}
              </button>
              {error && <p className="mt-2 text-xs text-red-700">{error}</p>}
            </div>
            <div className="flex-1 overflow-y-auto p-6">
              {loading && items.length === 0 ? (
                <p className="py-10 text-center text-sm text-forest-600">Loading…</p>
              ) : items.length === 0 ? (
                <p className="py-10 text-center text-sm text-forest-600">
                  No images yet — upload your first one.
                </p>
              ) : (
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
                  {items.map((item) => (
                    <button
                      key={item.name}
                      type="button"
                      onClick={() => {
                        onChange(item.url);
                        setOpen(false);
                      }}
                      className={`group overflow-hidden rounded-lg border-2 text-left transition ${
                        value === item.url
                          ? "border-gold"
                          : "border-transparent hover:border-forest-600"
                      }`}
                    >
                      <div className="aspect-square">
                        <Thumb url={item.url} className="h-full w-full" />
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
