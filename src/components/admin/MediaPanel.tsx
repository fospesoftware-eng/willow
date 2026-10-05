"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { fetchMedia, uploadMedia, type MediaItem } from "./ImagePicker";

function formatSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

export function MediaPanel() {
  const [items, setItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [confirm, setConfirm] = useState<string | null>(null);
  const [copied, setCopied] = useState("");
  const [dragging, setDragging] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      setItems(await fetchMedia());
    } catch (e) {
      setError(String(e));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    setBusy(true);
    setError("");
    try {
      const uploaded: MediaItem[] = [];
      for (const f of Array.from(files)) uploaded.push(await uploadMedia(f));
      setItems((prev) => [...uploaded, ...prev]);
    } catch (e) {
      setError(String(e));
    } finally {
      setBusy(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  async function remove(name: string) {
    setBusy(true);
    try {
      const res = await fetch(`/api/admin/media/${encodeURIComponent(name)}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        throw new Error(d.error || "Delete failed");
      }
      setItems((prev) => prev.filter((i) => i.name !== name));
    } catch (e) {
      setError(String(e));
    } finally {
      setBusy(false);
      setConfirm(null);
    }
  }

  function copy(url: string) {
    navigator.clipboard?.writeText(url);
    setCopied(url);
    setTimeout(() => setCopied(""), 1500);
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-display text-lg font-bold text-forest-900">Media library</h2>
          <p className="text-sm text-forest-700">
            Upload images once, then reuse them across pages, lakes and experiences. Max 8MB each.
          </p>
        </div>
        <button
          onClick={() => fileRef.current?.click()}
          disabled={busy}
          className="rounded-lg bg-gold px-5 py-2.5 text-xs font-bold uppercase tracking-widest text-forest-950 hover:bg-gold-light disabled:opacity-50"
        >
          {busy ? "Uploading…" : "Upload images"}
        </button>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />
      </div>

      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          handleFiles(e.dataTransfer.files);
        }}
        className={`rounded-2xl border-2 border-dashed p-10 text-center transition ${
          dragging ? "border-gold bg-gold/10" : "border-forest-900/20"
        }`}
      >
        <p className="text-sm font-medium text-forest-800">Drag &amp; drop images here</p>
        <p className="mt-1 text-xs text-forest-600">or use the Upload images button</p>
      </div>

      {error && (
        <p className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-800">{error}</p>
      )}

      {loading ? (
        <p className="py-10 text-center text-sm text-forest-600">Loading media…</p>
      ) : items.length === 0 ? (
        <p className="py-10 text-center text-sm text-forest-600">No images uploaded yet.</p>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {items.map((item) => (
            <div
              key={item.name}
              className="overflow-hidden rounded-xl border border-forest-900/10 bg-white shadow-card"
            >
              <div className="aspect-square bg-forest-900/5">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={item.url} alt="" loading="lazy" className="h-full w-full object-cover" />
              </div>
              <div className="space-y-2 p-3">
                <p className="truncate text-[11px] text-forest-600" title={item.name}>
                  {item.name}
                </p>
                <p className="text-[10px] uppercase tracking-wider text-forest-600/70">
                  {formatSize(item.size)}
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => copy(item.url)}
                    className="flex-1 rounded-md bg-forest-900 px-2 py-1.5 text-[10px] font-bold uppercase tracking-wider text-ivory hover:bg-forest-700"
                  >
                    {copied === item.url ? "Copied!" : "Copy URL"}
                  </button>
                  <button
                    onClick={() => setConfirm(item.name)}
                    className="rounded-md border border-red-200 px-2 py-1.5 text-[10px] font-bold uppercase tracking-wider text-red-700 hover:bg-red-50"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {confirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-forest-950/60 p-4">
          <div className="w-full max-w-sm rounded-2xl bg-ivory p-6 shadow-soft">
            <h3 className="font-display text-lg font-bold text-forest-900">Delete image?</h3>
            <p className="mt-2 text-sm text-forest-700">
              This permanently removes it from the library. Pages already using the URL will show a
              broken image.
            </p>
            <div className="mt-5 flex justify-end gap-2">
              <button
                onClick={() => setConfirm(null)}
                className="rounded-lg border border-forest-900/20 px-4 py-2 text-xs font-semibold text-forest-800"
              >
                Cancel
              </button>
              <button
                onClick={() => remove(confirm)}
                disabled={busy}
                className="rounded-lg bg-red-700 px-4 py-2 text-xs font-bold uppercase tracking-widest text-white hover:bg-red-800 disabled:opacity-50"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
