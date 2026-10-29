import { NextResponse } from "next/server";
import { issueOtp } from "@/lib/otp-store";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { identifier?: string };
    if (!body.identifier?.trim()) {
      return NextResponse.json({ error: "Enter an email or phone number." }, { status: 400 });
    }
    const result = await issueOtp(body.identifier);
    return NextResponse.json({
      ok: true,
      identifier: result.identifier,
      channel: result.channel,
      message: "A six-digit code is in the server console until Resend or Twilio is wired.",
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Could not send a code.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
