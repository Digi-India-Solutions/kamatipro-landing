import { GADS_CONVERSION } from "./config";

type TrackParams = Record<string, unknown>;

export function track(
  event: string,
  params: TrackParams = {},
  fbEvent?: string
): void {
  if (typeof window === "undefined") return;
  const w = window as unknown as {
    gtag?: (...args: unknown[]) => void;
    fbq?: (...args: unknown[]) => void;
  };
  try {
    if (typeof w.gtag === "function") {
      w.gtag("event", event, params);
    }
    if (fbEvent && typeof w.fbq === "function") {
      w.fbq("track", fbEvent);
    }
  } catch {}
}

export function trackConversion(): void {
  if (typeof window === "undefined" || !GADS_CONVERSION) return;
  const w = window as unknown as { gtag?: (...args: unknown[]) => void };
  if (typeof w.gtag !== "function") return;
  try {
    w.gtag("event", "conversion", { send_to: GADS_CONVERSION });
  } catch {}
}