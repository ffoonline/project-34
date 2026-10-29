import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/auth";
import { getCustomerIdentifier } from "@/lib/customer-session";

export async function GET() {
  const [admin, identifier] = await Promise.all([isAdmin(), getCustomerIdentifier()]);
  return NextResponse.json({ admin, identifier });
}
