import { NextResponse } from "next/server";
import { setCustomerCookie } from "@/lib/customer-session";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { createCustomer } from "@/lib/store";
import { httpError, requireEmail, requirePassword, ValidationError } from "@/lib/validation";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { email?: unknown; password?: unknown };
    const email = requireEmail(body.email);
    const password = requirePassword(body.password);

    if (isSupabaseConfigured()) {
      const { createClient } = await import("@/lib/supabase/server");
      const supabase = await createClient();
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });
      if (error) {
        const status = /already|registered|exists/i.test(error.message) ? 409 : 400;
        return NextResponse.json({ error: error.message }, { status });
      }
      // Public signup is customer-only. Admin privileges are provisioned out of band.
      if (data.session || data.user) {
        await setCustomerCookie(email);
      }
      return NextResponse.json({
        ok: true,
        identifier: email,
        needsConfirm: !data.session,
        role: "customer",
      });
    }

    const created = await createCustomer({
      identifier: email,
      password,
      createdAt: new Date().toISOString(),
    });
    if (!created) {
      return NextResponse.json({ error: "An account with that email already exists." }, { status: 409 });
    }
    await setCustomerCookie(email);
    return NextResponse.json({ ok: true, identifier: email, role: "customer" });
  } catch (error) {
    const { error: message, status } = httpError(error, "Could not open the account.");
    return NextResponse.json({ error: message }, { status: error instanceof ValidationError ? 400 : status });
  }
}
