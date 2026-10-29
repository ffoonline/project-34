import { NextResponse } from "next/server";
import { isIdentifierVerified } from "@/lib/otp-store";
import { createCustomer, findCustomer } from "@/lib/store";
import { setCustomerCookie } from "@/lib/customer-session";
import { isEmailIdentifier, normalizeIdentifier } from "@/lib/paths";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { requirePassword } from "@/lib/validation";

export async function POST(request: Request) {
  const body = (await request.json()) as { identifier?: string; password?: string };
  const identifier = normalizeIdentifier(body.identifier || "");
  const password = body.password || "";
  if (!identifier || password.length < 8) {
    return NextResponse.json(
      { error: "Use a verified email or phone, and a password of at least 8 characters." },
      { status: 400 },
    );
  }
  try {
    requirePassword(password);
  } catch {
    return NextResponse.json(
      { error: "Use a verified email or phone, and a password of at least 8 characters." },
      { status: 400 },
    );
  }

  if (isSupabaseConfigured() && isEmailIdentifier(identifier)) {
    if (!(await isIdentifierVerified(identifier))) {
      return NextResponse.json(
        { error: "Verify the one-time code before opening an account." },
        { status: 403 },
      );
    }
    const { createClient } = await import("@/lib/supabase/server");
    const supabase = await createClient();
    const { error } = await supabase.auth.signUp({ email: identifier, password });
    if (error) {
      const status = /already|registered|exists/i.test(error.message) ? 409 : 400;
      return NextResponse.json({ error: error.message }, { status });
    }
    await setCustomerCookie(identifier);
    return NextResponse.json({ ok: true, identifier });
  }

  if (!(await isIdentifierVerified(identifier))) {
    return NextResponse.json(
      { error: "Verify the one-time code before opening an account." },
      { status: 403 },
    );
  }
  if (await findCustomer(identifier)) {
    return NextResponse.json({ error: "An account with that identifier already exists." }, { status: 409 });
  }
  await createCustomer({
    identifier,
    password,
    createdAt: new Date().toISOString(),
  });
  await setCustomerCookie(identifier);
  return NextResponse.json({ ok: true, identifier });
}
