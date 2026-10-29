import { NextResponse } from "next/server";
import { addMessage, newId } from "@/lib/store";
import { httpError, requireEmail, ValidationError } from "@/lib/validation";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      name?: unknown;
      email?: unknown;
      phone?: unknown;
      message?: unknown;
    };
    const name = typeof body.name === "string" ? body.name.trim() : "";
    const message = typeof body.message === "string" ? body.message.trim() : "";
    const email = requireEmail(body.email);
    if (!name || !message) {
      return NextResponse.json({ error: "Name, email, and message are required." }, { status: 400 });
    }
    const row = await addMessage({
      id: newId("msg"),
      name,
      email,
      phone: typeof body.phone === "string" ? body.phone.trim() : undefined,
      message,
      at: new Date().toISOString(),
    });
    return NextResponse.json(row, { status: 201 });
  } catch (error) {
    const { error: message, status } = httpError(error, "Could not send the note.");
    return NextResponse.json({ error: message }, { status: error instanceof ValidationError ? 400 : status });
  }
}
