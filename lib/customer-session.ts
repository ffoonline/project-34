import { cookies } from "next/headers";
import { getSessionUser } from "@/lib/auth";

export const CUSTOMER_COOKIE = "tf_customer";

export async function getCustomerIdentifier() {
  const user = await getSessionUser();
  if (user?.email) return user.email;
  const jar = await cookies();
  return jar.get(CUSTOMER_COOKIE)?.value ?? null;
}

export async function setCustomerCookie(identifier: string) {
  const jar = await cookies();
  jar.set(CUSTOMER_COOKIE, identifier, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
    secure: process.env.NODE_ENV === "production",
  });
}

export async function clearCustomerCookie() {
  const jar = await cookies();
  jar.delete(CUSTOMER_COOKIE);
}
