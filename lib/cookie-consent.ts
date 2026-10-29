export const COOKIE_CONSENT_KEY = "tf-cookie-consent";

export type CookieConsent = "necessary" | "all";

const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((listener) => listener());
}

export function subscribeCookieConsent(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function readCookieConsent(): CookieConsent | null {
  if (typeof window === "undefined") return null;
  const value = window.localStorage.getItem(COOKIE_CONSENT_KEY);
  return value === "necessary" || value === "all" ? value : null;
}

export function writeCookieConsent(value: CookieConsent) {
  window.localStorage.setItem(COOKIE_CONSENT_KEY, value);
  emit();
}
