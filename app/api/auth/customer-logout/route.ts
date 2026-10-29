import { NextResponse } from "next/server";
import { clearCustomerCookie } from "@/lib/customer-session";
import { isSupabaseConfigured } from "@/lib/supabase/env";

export async function POST() {
  if (isSupabaseConfigured()) {
    try {
      const { createClient } = await import("@/lib/supabase/server");
      const supabase = await createClient();
      await supabase.auth.signOut();
    } catch {
      // Cookie cleanup still runs.
    }
  }
  await clearCustomerCookie();
  return NextResponse.json({ ok: true });
}
