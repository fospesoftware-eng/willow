"use client";

import { useEffect, useState } from "react";

export function NoticeBanner({ enabled, text }: { enabled: boolean; text: string }) {
  const storageKey = `wg-notice-dismissed:${text}`;
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (enabled && text) {
      try {
        setVisible(localStorage.getItem(storageKey) !== "1");
      } catch {
        setVisible(true);
      }
    }
  }, [enabled, text, storageKey]);

  if (!visible || !enabled || !text) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-[60] flex justify-center px-4 pb-4">
      <div className="pointer-events-auto flex max-w-2xl items-center gap-4 rounded-full border border-gold/40 bg-forest-950/95 py-2.5 pl-5 pr-2.5 text-ivory shadow-card backdrop-blur">
        <span className="h-2 w-2 shrink-0 rounded-full bg-gold" />
        <p className="text-xs leading-snug md:text-sm">{text}</p>
        <button
          onClick={() => {
            try {
              localStorage.setItem(storageKey, "1");
            } catch {
              /* ignore */
            }
            setVisible(false);
          }}
          aria-label="Dismiss announcement"
          className="ml-auto flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-ivory/10 text-sm text-ivory transition hover:bg-gold hover:text-forest-950"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
