import { NextResponse } from "next/server";
import { findCustomer } from "@/lib/store";
import { setCustomerCookie } from "@/lib/customer-session";
import { isEmailIdentifier, normalizeIdentifier } from "@/lib/paths";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { sessionHasAdminRole, setAdminCookie } from "@/lib/auth";

export async function POST(request: Request) {
  const body = (await request.json()) as { identifier?: string; password?: string };
  const identifier = normalizeIdentifier(body.identifier || "");
  const password = body.password || "";
  if (!identifier || !password) {
    return NextResponse.json({ error: "Identifier and password are required." }, { status: 400 });
  }

  if (isSupabaseConfigured() && isEmailIdentifier(identifier)) {
    const { createClient } = await import("@/lib/supabase/server");
    const supabase = await createClient();
    const { data, error } = await supabase.auth.signInWithPassword({
      email: identifier,
      password,
    });
    if (error || !data.user) {
      return NextResponse.json({ error: "That sign-in does not match an account." }, { status: 401 });
    }
    await setCustomerCookie(identifier);
    if (await sessionHasAdminRole(data.user)) {
      await setAdminCookie();
    }
    return NextResponse.json({ ok: true, identifier });
  }

  const user = await findCustomer(identifier);
  if (!user || user.password !== password) {
    return NextResponse.json({ error: "That sign-in does not match an account." }, { status: 401 });
  }
  await setCustomerCookie(identifier);
  return NextResponse.json({ ok: true, identifier });
}
