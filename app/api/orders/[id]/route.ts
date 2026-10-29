import { NextResponse } from "next/server";
import { getOrder, updateOrderStatus } from "@/lib/store";
import { assertAdmin } from "@/lib/admin-guard";
import { getCustomerIdentifier } from "@/lib/customer-session";
import { isAdmin } from "@/lib/auth";
import { httpError, parseOrderStatus, ValidationError } from "@/lib/validation";

type Ctx = { params: Promise<{ id: string }> };

export const dynamic = "force-dynamic";

function canReadOrder(order: { customer: { email: string; phone: string } }, identifier: string | null) {
  if (!identifier) return false;
  const email = identifier.toLowerCase();
  const phone = identifier.replace(/\s+/g, "");
  return (
    order.customer.email.toLowerCase() === email ||
    order.customer.phone.replace(/\s+/g, "") === phone
  );
}

export async function GET(_request: Request, { params }: Ctx) {
  try {
    const { id } = await params;
    const order = await getOrder(id);
    if (!order) return NextResponse.json({ error: "Not found" }, { status: 404 });
    if (await isAdmin()) return NextResponse.json(order);
    const identifier = await getCustomerIdentifier();
    if (!canReadOrder(order, identifier)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json(order);
  } catch (error) {
    const { error: message, status } = httpError(error, "Could not load the order.");
    return NextResponse.json({ error: message }, { status });
  }
}

export async function PATCH(request: Request, { params }: Ctx) {
  const denied = await assertAdmin();
  if (denied) return denied;
  try {
    const { id } = await params;
    const body = (await request.json()) as { status?: unknown };
    const status = parseOrderStatus(body.status);
    const order = await updateOrderStatus(id, status);
    if (!order) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(order);
  } catch (error) {
    const { error: message, status } = httpError(error, "Could not update the order.");
    return NextResponse.json({ error: message }, { status: error instanceof ValidationError ? 400 : status });
  }
}
