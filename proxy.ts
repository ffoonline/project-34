import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { ADMIN_COOKIE, ADMIN_COOKIE_VALUE, isAdminClaim } from "@/lib/auth";
import { isMaintenanceMode } from "@/lib/storefront-config";
import { updateSession } from "@/lib/supabase/middleware";

function copyCookies(from: NextResponse, to: NextResponse) {
  from.cookies.getAll().forEach((cookie) => {
    to.cookies.set(cookie);
  });
  return to;
}

function isMaintenanceOpenPath(pathname: string) {
  return (
    pathname.startsWith("/admin") ||
    pathname.startsWith("/login") ||
    pathname.startsWith("/register") ||
    pathname.startsWith("/api") ||
    pathname === "/maintenance"
  );
}

export async function proxy(request: NextRequest) {
  const { response: supabaseResponse, claims } = await updateSession(request);
  const { pathname } = request.nextUrl;

  if ((await isMaintenanceMode()) && !isMaintenanceOpenPath(pathname)) {
    const url = request.nextUrl.clone();
    url.pathname = "/maintenance";
    const rewrite = NextResponse.rewrite(url);
    rewrite.headers.set("Retry-After", "300");
    rewrite.headers.set("X-Robots-Tag", "noindex");
    return copyCookies(supabaseResponse, rewrite);
  }

  if (!pathname.startsWith("/admin")) {
    return supabaseResponse;
  }

  const houseKey = request.cookies.get(ADMIN_COOKIE)?.value === ADMIN_COOKIE_VALUE;
  if (houseKey || isAdminClaim(claims)) {
    return supabaseResponse;
  }

  const signedIn = Boolean(claims?.sub);
  const dest = new URL(signedIn ? "/" : "/login", request.url);
  if (!signedIn) dest.searchParams.set("next", request.nextUrl.pathname);
  const redirect = NextResponse.redirect(dest);
  return copyCookies(supabaseResponse, redirect);
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
