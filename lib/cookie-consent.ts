export const COOKIE_CONSENT_KEY = "tf-cookie-consent";
export const COOKIE_SETTINGS_EVENT = "tf-open-cookie-settings";

export type CookieConsent = "necessary" | "analytics" | "marketing" | "all";
export type OptionalCookieCategory = "analytics" | "marketing";

const listeners = new Set<() => void>();
let volatileConsent: CookieConsent | null = null;

function emit() {
  listeners.forEach((listener) => listener());
}

export function subscribeCookieConsent(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function readCookieConsent(): CookieConsent | null {
  if (typeof window === "undefined") return null;
  try {
    const value = window.localStorage.getItem(COOKIE_CONSENT_KEY);
    if (value === "necessary" || value === "analytics" || value === "marketing" || value === "all") {
      volatileConsent = value;
      return value;
    }
    return volatileConsent;
  } catch {
    return volatileConsent;
  }
}

export function writeCookieConsent(value: CookieConsent) {
  if (typeof window === "undefined") return;
  volatileConsent = value;
  try {
    window.localStorage.setItem(COOKIE_CONSENT_KEY, value);
  } catch {
    // Keep the choice for this tab even when browser storage is unavailable.
  }
  emit();
}

export function hasCookieConsent(
  consent: CookieConsent | null,
  category: OptionalCookieCategory,
) {
  return consent === "all" || consent === category;
}

export function cookieConsentFromChoices(analytics: boolean, marketing: boolean): CookieConsent {
  if (analytics && marketing) return "all";
  if (analytics) return "analytics";
  if (marketing) return "marketing";
  return "necessary";
}

export function requestCookieSettings() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event(COOKIE_SETTINGS_EVENT));
  }
}
