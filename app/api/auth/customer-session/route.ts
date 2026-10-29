import { NextResponse } from "next/server";
import { getCustomerIdentifier } from "@/lib/customer-session";

export async function GET() {
  const identifier = await getCustomerIdentifier();
  return NextResponse.json({ identifier, isLoggedIn: Boolean(identifier) });
}
