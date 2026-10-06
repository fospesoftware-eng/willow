/**
 * Lightweight analytics event tracker.
 *
 * Wire up a provider (e.g. Google Analytics, Plausible, PostHog) by setting
 * the window-level function. No secrets are hard-coded.
 *
 * Usage:
 *   trackEvent("booking_click", { experience: "fishing" })
 */

type EventName =
  | "booking_click"
  | "fishing_booking_click"
  | "sauna_booking_click"
  | "water_dip_booking_click"
  | "event_enquiry"
  | "phone_click"
  | "whatsapp_click"
  | "email_click"
  | "map_click";

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[];
    gtag?: (...args: unknown[]) => void;
    plausible?: (event: string, props?: Record<string, unknown>) => void;
  }
}

export function trackEvent(
  event: EventName,
  props: Record<string, unknown> = {}
) {
  if (typeof window === "undefined") return;

  // Google Analytics 4
  if (typeof window.gtag === "function") {
    window.gtag("event", event, props);
  }
  // dataLayer (GTM)
  if (Array.isArray(window.dataLayer)) {
    window.dataLayer.push({ event, ...props });
  }
  // Plausible
  if (typeof window.plausible === "function") {
    window.plausible(event, { props });
  }
}
