import { NextResponse } from "next/server";
import { deleteProduct, getProductById, updateProduct } from "@/lib/store";
import { assertAdmin } from "@/lib/admin-guard";
import { httpError, parseProductPatch, ValidationError } from "@/lib/validation";

type Ctx = { params: Promise<{ id: string }> };

export const dynamic = "force-dynamic";

export async function GET(_request: Request, { params }: Ctx) {
  try {
    const { id } = await params;
    const product = await getProductById(id);
    if (!product) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(product);
  } catch (error) {
    const { error: message, status } = httpError(error, "Could not load product.");
    return NextResponse.json({ error: message }, { status });
  }
}

export async function PATCH(request: Request, { params }: Ctx) {
  const denied = await assertAdmin();
  if (denied) return denied;
  try {
    const { id } = await params;
    const body = (await request.json()) as Record<string, unknown>;
    const product = await updateProduct(id, parseProductPatch(body));
    if (!product) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(product);
  } catch (error) {
    const { error: message, status } = httpError(error, "Could not update product.");
    return NextResponse.json({ error: message }, { status: error instanceof ValidationError ? 400 : status });
  }
}

export async function DELETE(_request: Request, { params }: Ctx) {
  const denied = await assertAdmin();
  if (denied) return denied;
  try {
    const { id } = await params;
    const ok = await deleteProduct(id);
    if (!ok) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ ok: true });
  } catch (error) {
    const { error: message, status } = httpError(error, "Could not delete product.");
    return NextResponse.json({ error: message }, { status });
  }
}
