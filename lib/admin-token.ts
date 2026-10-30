// Signed admin-cookie token, shared by the API routes (Node runtime) and the
// proxy middleware (Edge runtime). Only uses Web Crypto (globalThis.crypto),
// so it is safe to import from both.

export const ADMIN_COOKIE = "tf_admin";
export const ADMIN_TOKEN_TTL_SECONDS = 60 * 60 * 24 * 7; // keep in sync with the cookie maxAge

// `house-<expiryEpochSeconds>.<hmac-sha256>`
const TOKEN_RE = /^house-(\d{1,10})\.([0-9a-f]{64})$/;

function adminSessionSecret() {
  // ADMIN_SESSION_SECRET is the dedicated signing key. ADMIN_PASSWORD is an
  // acceptable fallback for the zero-config local path: knowing the password
  // already implies admin, so deriving the key from it grants nothing extra.
  // When neither is set no token can be issued or verified, and the cookie
  // alone grants nothing.
  return (
    process.env.ADMIN_SESSION_SECRET?.trim() ||
    process.env.ADMIN_PASSWORD?.trim() ||
    ""
  );
}

const encoder = new TextEncoder();

async function hmac(payload: string) {
  const secret = adminSessionSecret();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(payload));
  return [...new Uint8Array(signature)]
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

function timingSafeEqual(a: string, b: string) {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i += 1) {
    diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return diff === 0;
}

/**
 * Mints `house-<expiry>.<hmac>`. Returns null when no secret is configured,
 * in which case the caller must not set the admin cookie.
 */
export async function createAdminToken(nowMs = Date.now()) {
  if (!adminSessionSecret()) return null;
  const expiresAt = Math.floor(nowMs / 1000) + ADMIN_TOKEN_TTL_SECONDS;
  const payload = `house-${expiresAt}`;
  return `${payload}.${await hmac(payload)}`;
}

/**
 * Verifies the token signature and expiry. Rejects everything that is not
 * an exact `house-...` token, including the old static `house` value.
 */
export async function verifyAdminToken(
  token: string | undefined | null,
  nowMs = Date.now(),
) {
  if (!token || !adminSessionSecret()) return false;
  const match = TOKEN_RE.exec(token);
  if (!match) return false;
  const expiresAt = Number(match[1]);
  if (!Number.isFinite(expiresAt) || expiresAt < Math.floor(nowMs / 1000)) return false;
  const expected = await hmac(`house-${expiresAt}`);
  return timingSafeEqual(expected, match[2]);
}
