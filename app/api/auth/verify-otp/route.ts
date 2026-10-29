import { NextResponse } from "next/server";
import { verifyOtp } from "@/lib/otp-store";

export async function POST(request: Request) {
  const body = (await request.json()) as { identifier?: string; code?: string };
  if (!body.identifier || !body.code) {
    return NextResponse.json({ error: "Identifier and code are required." }, { status: 400 });
  }
  const result = await verifyOtp(body.identifier, body.code);
  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }
  return NextResponse.json({ ok: true, identifier: result.identifier });
}
