"use client";

import { useEffect, useRef, useState } from "react";

const SENTINEL_SRC = "https://sentinel.breatheolution.com/willowgarthcountrypark";

/**
 * Embedded Sentinel cold-water screening questionnaire.
 * The upstream app is hosted by Breatheolution and already frame-friendly
 * (no X-Frame-Options / CSP ancestor restriction).
 */
export function SentinelEmbed() {
  const frameRef = useRef<HTMLIFrameElement>(null);
  const [loaded, setLoaded] = useState(false);
  const [autoHeight, setAutoHeight] = useState<number | null>(null);

  // Some embed providers postMessage the document height — grow if they do.
  useEffect(() => {
    function onMessage(e: MessageEvent) {
      if (e.origin !== new URL(SENTINEL_SRC).origin) return;
      const d = e.data;
      const h =
        (typeof d === "number" && d) ||
        (d && typeof d === "object" &&
          (d.height ?? d.frameHeight ?? d.message?.height ?? d.data?.height));
      if (typeof h === "number" && h > 400 && h < 4000) setAutoHeight(h);
    }
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, []);

  return (
    <div className="relative overflow-hidden rounded-[1.75rem] border border-forest-900/10 bg-white shadow-card">
      {/* Loading state */}
      {!loaded && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-4 bg-white">
          <span className="h-10 w-10 animate-spin rounded-full border-2 border-forest-900/15 border-t-gold" />
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-forest-600">
            Loading safety screening…
          </p>
        </div>
      )}

      <iframe
        ref={frameRef}
        src={SENTINEL_SRC}
        title="Sentinel health and safety screening — Willow Garth Country Park"
        onLoad={() => setLoaded(true)}
        className="w-full"
        style={{ height: autoHeight ?? undefined, minHeight: 820 }}
        loading="lazy"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope"
      />

      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-forest-900/10 bg-cream/60 px-5 py-3">
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-forest-600">
          Screening provided by Sentinel · Breatheolution
        </p>
        <a
          href={SENTINEL_SRC}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[11px] font-bold uppercase tracking-[0.14em] text-forest-800 underline underline-offset-2 hover:text-gold"
        >
          Open full screen ↗
        </a>
      </div>
    </div>
  );
}
