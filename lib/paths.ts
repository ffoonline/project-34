export function safeRedirect(value: string | null | undefined, fallback = "/") {
  if (!value) return fallback;
  if (!value.startsWith("/") || value.startsWith("//") || value.includes("://")) {
    return fallback;
  }
  return value;
}

export function isEmailIdentifier(identifier: string) {
  return identifier.includes("@");
}

export function normalizeIdentifier(identifier: string) {
  const trimmed = identifier.trim();
  return isEmailIdentifier(trimmed) ? trimmed.toLowerCase() : trimmed.replace(/\s+/g, "");
}
