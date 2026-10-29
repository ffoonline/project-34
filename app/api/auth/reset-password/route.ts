import { NextResponse } from "next/server";
import { isIdentifierVerified } from "@/lib/otp-store";
import { findCustomer, updateCustomerPassword } from "@/lib/store";
import { setCustomerCookie } from "@/lib/customer-session";
import { normalizeIdentifier } from "@/lib/paths";

export async function POST(request: Request) {
  const body = (await request.json()) as { identifier?: string; password?: string };
  const identifier = normalizeIdentifier(body.identifier || "");
  const password = body.password || "";
  if (!identifier || password.length < 8) {
    return NextResponse.json(
      { error: "Use a verified identifier and a password of at least 8 characters." },
      { status: 400 },
    );
  }
  if (!(await isIdentifierVerified(identifier))) {
    return NextResponse.json(
      { error: "Verify the one-time code before changing the password." },
      { status: 403 },
    );
  }
  const existing = await findCustomer(identifier);
  if (!existing) {
    return NextResponse.json({ error: "No account exists for that identifier." }, { status: 404 });
  }
  // TODO: hash with bcryptjs.
  await updateCustomerPassword(identifier, password);
  await setCustomerCookie(identifier);
  return NextResponse.json({ ok: true, identifier });
}
