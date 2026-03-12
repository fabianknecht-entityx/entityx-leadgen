type EventData = Record<string, string | number | boolean>;

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[];
  }
}

export function trackEvent(name: string, data?: EventData): void {
  if (typeof window === "undefined") return;

  console.log(`[trackEvent] ${name}`, data ?? "");

  // Push to GTM dataLayer if present
  if (window.dataLayer) {
    window.dataLayer.push({ event: name, ...data });
  }
}
