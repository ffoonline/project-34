import { NextResponse } from "next/server";
import { clearAdminCookie } from "@/lib/auth";
import { clearCustomerCookie } from "@/lib/customer-session";
import { isSupabaseConfigured } from "@/lib/supabase/env";

export async function POST() {
  if (isSupabaseConfigured()) {
    try {
      const { createClient } = await import("@/lib/supabase/server");
      const supabase = await createClient();
      await supabase.auth.signOut();
    } catch {
      // Cookie and house-key cleanup still run.
    }
  }
  await clearAdminCookie();
  await clearCustomerCookie();
  return NextResponse.json({ ok: true });
}
