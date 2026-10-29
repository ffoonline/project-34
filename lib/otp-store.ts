import { isEmailIdentifier, normalizeIdentifier } from "./paths";

const OTP_TTL_SECONDS = 10 * 60;
const VERIFIED_TTL_SECONDS = 60 * 60;
const MAX_ATTEMPTS = 5;

type OtpRecord = {
  code: string;
  attempts: number;
};

const memory = globalThis as typeof globalThis & {
  __tfOtp?: Map<string, { value: string; expires: number }>;
};

function mem() {
  memory.__tfOtp ??= new Map();
  return memory.__tfOtp;
}

function redisConfigured() {
  return Boolean(process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN);
}

async function redis(command: (string | number)[]) {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;
  const res = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(command),
  });
  if (!res.ok) {
    throw new Error("OTP store is unavailable.");
  }
  return (await res.json()) as { result: string | number | null };
}

async function kvSet(key: string, value: string, ttlSeconds: number) {
  if (redisConfigured()) {
    await redis(["SET", key, value, "EX", ttlSeconds]);
    return;
  }
  mem().set(key, { value, expires: Date.now() + ttlSeconds * 1000 });
}

async function kvGet(key: string) {
  if (redisConfigured()) {
    const payload = await redis(["GET", key]);
    return payload?.result == null ? null : String(payload.result);
  }
  const row = mem().get(key);
  if (!row) return null;
  if (row.expires < Date.now()) {
    mem().delete(key);
    return null;
  }
  return row.value;
}

async function kvDel(key: string) {
  if (redisConfigured()) {
    await redis(["DEL", key]);
    return;
  }
  mem().delete(key);
}

export function sweepExpiredOtps() {
  if (redisConfigured()) return 0;
  const store = mem();
  const now = Date.now();
  let removed = 0;
  for (const [key, row] of store) {
    if (row.expires < now) {
      store.delete(key);
      removed += 1;
    }
  }
  return removed;
}

export async function sendEmailOtp(to: string, code: string) {
  console.log(`[THIRTY FOUR OTP email] ${to}: ${code}`);
  // TODO: Resend
  // if (process.env.RESEND_API_KEY) { await resend.emails.send(...) }
}

export async function sendSmsOtp(to: string, code: string) {
  console.log(`[THIRTY FOUR OTP sms] ${to}: ${code}`);
  // TODO: Twilio
  // if (process.env.TWILIO_ACCOUNT_SID) { await twilio.messages.create(...) }
}

export async function issueOtp(identifier: string) {
  const id = normalizeIdentifier(identifier);
  if (!id) throw new Error("Enter an email or phone number.");
  const code = String(100000 + Math.floor(Math.random() * 900000));
  const record: OtpRecord = { code, attempts: 0 };
  await kvSet(`otp:${id}`, JSON.stringify(record), OTP_TTL_SECONDS);
  const channel = isEmailIdentifier(id) ? "email" : "sms";
  if (channel === "email") await sendEmailOtp(id, code);
  else await sendSmsOtp(id, code);
  return { identifier: id, channel };
}

export async function verifyOtp(identifier: string, code: string) {
  const id = normalizeIdentifier(identifier);
  const raw = await kvGet(`otp:${id}`);
  if (!raw) return { ok: false as const, error: "That code has expired. Request a new one." };
  const record = JSON.parse(raw) as OtpRecord;
  if (record.attempts >= MAX_ATTEMPTS) {
    await kvDel(`otp:${id}`);
    return { ok: false as const, error: "Too many attempts. Request a new code." };
  }
  if (record.code !== code.trim()) {
    record.attempts += 1;
    await kvSet(`otp:${id}`, JSON.stringify(record), OTP_TTL_SECONDS);
    return { ok: false as const, error: "That code does not match." };
  }
  await kvDel(`otp:${id}`);
  await kvSet(`otp-verified:${id}`, "1", VERIFIED_TTL_SECONDS);
  return { ok: true as const, identifier: id };
}

export async function isIdentifierVerified(identifier: string) {
  const id = normalizeIdentifier(identifier);
  const flag = await kvGet(`otp-verified:${id}`);
  return flag === "1";
}
