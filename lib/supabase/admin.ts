import "server-only";

import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import {
  isSupabaseAdminConfigured,
  supabaseServiceRoleKey,
  supabaseUrl,
} from "./env";

export function createAdminClient(): SupabaseClient | null {
  if (!isSupabaseAdminConfigured()) return null;
  return createClient(supabaseUrl(), supabaseServiceRoleKey(), {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

export function requireAdminClient() {
  const client = createAdminClient();
  if (!client) {
    throw new Error("Supabase service role is not configured.");
  }
  return client;
}
