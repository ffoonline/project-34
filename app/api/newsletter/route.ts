import { NextResponse } from "next/server";
import { addSubscriber } from "@/lib/store";
import { httpError, requireEmail, ValidationError } from "@/lib/validation";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { email?: unknown };
    const email = requireEmail(body.email);
    await addSubscriber(email);
    return NextResponse.json({ ok: true });
  } catch (error) {
    const { error: message, status } = httpError(error, "Could not subscribe.");
    return NextResponse.json({ error: message }, { status: error instanceof ValidationError ? 400 : status });
  }
}
