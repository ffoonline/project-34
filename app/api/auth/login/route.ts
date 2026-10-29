import { NextResponse } from "next/server";
import {
  adminEmail,
  adminPassword,
  promoteAdminIfNeeded,
  sessionHasAdminRole,
  setAdminCookie,
} from "@/lib/auth";
import { setCustomerCookie } from "@/lib/customer-session";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { httpError, normalizeEmail, requirePassword, ValidationError } from "@/lib/validation";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { email?: unknown; password?: unknown };
    const email = normalizeEmail(body.email);
    const password = typeof body.password === "string" ? body.password : "";

    if (!password) {
      return NextResponse.json({ error: "Password is required." }, { status: 400 });
    }

    if (email && isSupabaseConfigured()) {
      requirePassword(password);
      const { createClient } = await import("@/lib/supabase/server");
      const supabase = await createClient();
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error || !data.user) {
        return NextResponse.json({ error: "That sign-in does not match an account." }, { status: 401 });
      }
      const promoted = await promoteAdminIfNeeded(data.user);
      const admin = promoted || (await sessionHasAdminRole(data.user)) || email === adminEmail();
      await setCustomerCookie(email);
      if (admin) await setAdminCookie();
      return NextResponse.json({
        ok: true,
        identifier: email,
        role: admin ? "admin" : "customer",
      });
    }

    if (password === adminPassword()) {
      await setAdminCookie();
      return NextResponse.json({ ok: true, role: "admin" });
    }

    return NextResponse.json({ error: "Invalid password" }, { status: 401 });
  } catch (error) {
    const { error: message, status } = httpError(error, "Could not sign in.");
    return NextResponse.json({ error: message }, { status: error instanceof ValidationError ? 400 : status });
  }
}
