import { NextResponse } from "next/server";
import { assertAdmin } from "@/lib/admin-guard";
import { getSessionUser } from "@/lib/auth";
import { listOrders, placeHouseOrder } from "@/lib/store";
import {
  httpError,
  parseCurrency,
  parseCustomer,
  parseOrderLines,
  parsePaymentMethod,
  ValidationError,
} from "@/lib/validation";

export const dynamic = "force-dynamic";

export async function GET() {
  const denied = await assertAdmin();
  if (denied) return denied;
  try {
    return NextResponse.json(await listOrders());
  } catch (error) {
    const { error: message, status } = httpError(error, "Could not load orders.");
    return NextResponse.json({ error: message }, { status });
  }
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Record<string, unknown>;
    const customerRaw = (body.customer && typeof body.customer === "object"
      ? body.customer
      : {}) as Record<string, unknown>;
    const city =
      (typeof body.city === "string" && body.city) ||
      (typeof customerRaw.city === "string" && customerRaw.city) ||
      "Kabul";
    const items = parseOrderLines(body.items);
    const customer = parseCustomer({ ...customerRaw, city });
    const paymentMethod = parsePaymentMethod(body.paymentMethod);
    const user = await getSessionUser();
    const order = await placeHouseOrder({
      items,
      customer,
      currency: parseCurrency(body.currency),
      city,
      paymentMethod,
      channel: paymentMethod === "whatsapp" ? "whatsapp" : "checkout",
      userId: user?.id ?? null,
    });
    return NextResponse.json(order, { status: 201 });
  } catch (error) {
    const { error: message, status } = httpError(error, "Could not place the order.");
    return NextResponse.json({ error: message }, { status: error instanceof ValidationError ? 400 : status });
  }
}
