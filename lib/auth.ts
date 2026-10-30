import { cookies } from "next/headers";
import type { User } from "@supabase/supabase-js";
import { isSupabaseConfigured } from "./supabase/env";
import {
  ADMIN_COOKIE,
  ADMIN_TOKEN_TTL_SECONDS,
  createAdminToken,
  verifyAdminToken,
} from "./admin-token";

export { ADMIN_COOKIE };

export function adminPassword() {
  return process.env.ADMIN_PASSWORD || "";
}

export async function setAdminCookie() {
  const token = await createAdminToken();
  if (!token) {
    // No signing secret configured: do not set an unverifiable cookie.
    return;
  }
  const jar = await cookies();
  jar.set(ADMIN_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: ADMIN_TOKEN_TTL_SECONDS,
    secure: process.env.NODE_ENV === "production",
  });
}

export async function clearAdminCookie() {
  const jar = await cookies();
  jar.delete(ADMIN_COOKIE);
}

export function isAdminClaim(claims: unknown) {
  if (!claims || typeof claims !== "object") return false;
  const record = claims as {
    app_metadata?: { role?: unknown };
    app_role?: unknown;
  };
  if (record.app_metadata?.role === "admin") return true;
  return record.app_role === "admin";
}

export async function getSessionUser(): Promise<User | null> {
  if (!isSupabaseConfigured()) return null;
  try {
    const { createClient } = await import("./supabase/server");
    const supabase = await createClient();
    const { data } = await supabase.auth.getUser();
    return data.user ?? null;
  } catch {
    return null;
  }
}

export async function sessionHasAdminRole(user: User | null) {
  if (!user) return false;
  if (user.app_metadata?.role === "admin") return true;
  if (!isSupabaseConfigured()) return false;
  try {
    const { createClient } = await import("./supabase/server");
    const supabase = await createClient();
    const { data } = await supabase.from("profiles").select("role").eq("id", user.id).maybeSingle();
    return data?.role === "admin";
  } catch {
    return false;
  }
}

export async function isAdmin() {
  const jar = await cookies();
  if (await verifyAdminToken(jar.get(ADMIN_COOKIE)?.value)) return true;
  const user = await getSessionUser();
  return sessionHasAdminRole(user);
}
