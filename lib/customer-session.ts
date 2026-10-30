import {
  createCipheriv,
  createDecipheriv,
  createHmac,
  randomBytes,
} from "node:crypto";
import { cookies } from "next/headers";
import { getSessionUser } from "@/lib/auth";
import { normalizeIdentifier } from "@/lib/paths";

export const CUSTOMER_COOKIE = "tf_customer";
const CUSTOMER_SESSION_VERSION = "v1";
const CUSTOMER_SESSION_TTL_SECONDS = 60 * 60 * 24 * 30;
const MIN_CUSTOMER_SESSION_SECRET_BYTES = 32;
const MAX_CUSTOMER_IDENTIFIER_LENGTH = 320;
const MAX_CUSTOMER_TOKEN_LENGTH = 4096;
const CUSTOMER_SESSION_AAD = Buffer.from("thirtyfour:customer-session:v1", "utf8");

function customerSessionSecret() {
  const secret = process.env.CUSTOMER_SESSION_SECRET;
  if (!secret || Buffer.byteLength(secret, "utf8") < MIN_CUSTOMER_SESSION_SECRET_BYTES) {
    return null;
  }
  return secret;
}

function customerSessionKey(secret: string) {
  return createHmac("sha256", secret)
    .update("thirtyfour:customer-session:aes-256-gcm:v1")
    .digest();
}

function createCustomerSessionToken(identifier: string, secret: string) {
  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", customerSessionKey(secret), iv);
  cipher.setAAD(CUSTOMER_SESSION_AAD);

  const expiresAt = Math.floor(Date.now() / 1000) + CUSTOMER_SESSION_TTL_SECONDS;
  const plaintext = Buffer.from(JSON.stringify({ identifier, expiresAt }), "utf8");
  const ciphertext = Buffer.concat([cipher.update(plaintext), cipher.final()]);
  const tag = cipher.getAuthTag();

  return [
    CUSTOMER_SESSION_VERSION,
    iv.toString("base64url"),
    ciphertext.toString("base64url"),
    tag.toString("base64url"),
  ].join(".");
}

function decodeBase64Url(value: string) {
  const decoded = Buffer.from(value, "base64url");
  return decoded.toString("base64url") === value ? decoded : null;
}

function readCustomerSessionToken(value: string | undefined) {
  const secret = customerSessionSecret();
  if (!secret || !value || value.length > MAX_CUSTOMER_TOKEN_LENGTH) return null;

  const parts = value.split(".");
  if (parts.length !== 4) return null;
  const [version, ivText, ciphertextText, tagText] = parts;
  if (
    version !== CUSTOMER_SESSION_VERSION ||
    !/^[A-Za-z0-9_-]{16}$/.test(ivText) ||
    !/^[A-Za-z0-9_-]+$/.test(ciphertextText) ||
    !/^[A-Za-z0-9_-]{22}$/.test(tagText)
  ) {
    return null;
  }

  const iv = decodeBase64Url(ivText);
  const ciphertext = decodeBase64Url(ciphertextText);
  const tag = decodeBase64Url(tagText);
  if (!iv || iv.length !== 12 || !ciphertext || ciphertext.length > 2048 || !tag || tag.length !== 16) {
    return null;
  }

  try {
    const decipher = createDecipheriv("aes-256-gcm", customerSessionKey(secret), iv);
    decipher.setAAD(CUSTOMER_SESSION_AAD);
    decipher.setAuthTag(tag);
    const plaintext = Buffer.concat([decipher.update(ciphertext), decipher.final()]);
    const payload = JSON.parse(plaintext.toString("utf8")) as {
      identifier?: unknown;
      expiresAt?: unknown;
    };
    const identifier = payload.identifier;
    const expiresAt = payload.expiresAt;

    if (
      typeof identifier !== "string" ||
      !identifier ||
      identifier.length > MAX_CUSTOMER_IDENTIFIER_LENGTH ||
      typeof expiresAt !== "number" ||
      !Number.isSafeInteger(expiresAt)
    ) {
      return null;
    }

    const now = Math.floor(Date.now() / 1000);
    if (
      expiresAt <= now ||
      expiresAt > now + CUSTOMER_SESSION_TTL_SECONDS + 60 ||
      normalizeIdentifier(identifier) !== identifier
    ) {
      return null;
    }

    return identifier;
  } catch {
    return null;
  }
}

export async function getCustomerIdentifier() {
  const user = await getSessionUser();
  if (user?.email) return user.email;

  const jar = await cookies();
  return readCustomerSessionToken(jar.get(CUSTOMER_COOKIE)?.value);
}

export async function setCustomerCookie(identifier: string) {
  const normalized = normalizeIdentifier(identifier);
  if (!normalized || normalized.length > MAX_CUSTOMER_IDENTIFIER_LENGTH) {
    throw new Error("A valid customer identifier is required to create a session.");
  }

  const secret = customerSessionSecret();
  if (!secret) {
    throw new Error("CUSTOMER_SESSION_SECRET must be configured with at least 32 random bytes.");
  }

  const token = createCustomerSessionToken(normalized, secret);
  const jar = await cookies();
  jar.set(CUSTOMER_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: CUSTOMER_SESSION_TTL_SECONDS,
    secure: process.env.NODE_ENV === "production",
  });
}

export async function clearCustomerCookie() {
  const jar = await cookies();
  jar.delete(CUSTOMER_COOKIE);
}
