import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { supabasePublishableKey, supabaseUrl } from "./env";

export type SessionClaims = Record<string, unknown> | null;

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });
  let claims: SessionClaims = null;

  const url = supabaseUrl();
  const key = supabasePublishableKey();
  if (!url || !key) {
    return { response: supabaseResponse, claims };
  }

  // With Fluid compute, don't put this client in a global environment
  // variable. Always create a new one on each request.
  const supabase = createServerClient(url, key, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        supabaseResponse = NextResponse.next({
          request,
        });
        cookiesToSet.forEach(({ name, value, options }) =>
          supabaseResponse.cookies.set(name, value, options),
        );
      },
    },
  });

  // Do not run code between createServerClient and supabase.auth.getClaims().
  // Removing getClaims() can log users out during server-side rendering.
  const { data } = await supabase.auth.getClaims();
  claims = (data?.claims as SessionClaims) ?? null;

  // Keep the shop, bag, and product pages open to guests. Login is offered at
  // checkout, not here. Return the supabaseResponse so auth cookies stay in sync.
  return { response: supabaseResponse, claims };
}
