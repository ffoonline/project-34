import { NextResponse } from "next/server";
import { assertAdmin } from "@/lib/admin-guard";
import { createProduct, getProductBySlug, listProducts, newId } from "@/lib/store";
import { httpError, parseProductInput, ValidationError } from "@/lib/validation";
import type { ProductQuery } from "@/lib/filter-products";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const slug = url.searchParams.get("slug")?.trim();
    if (slug) {
      const product = await getProductBySlug(slug);
      if (!product) return NextResponse.json({ error: "Not found" }, { status: 404 });
      return NextResponse.json(product);
    }
    const query: ProductQuery = {
      q: url.searchParams.get("q") ?? undefined,
      category: url.searchParams.get("category") ?? undefined,
      subcategory: url.searchParams.get("subcategory") ?? undefined,
      collection: url.searchParams.get("collection") ?? undefined,
      sale: url.searchParams.get("sale") ?? undefined,
      sort: url.searchParams.get("sort") ?? undefined,
    };
    const featured = url.searchParams.get("featured") === "1";
    const products = await listProducts(query);
    return NextResponse.json(featured ? products.filter((product) => product.featured) : products);
  } catch (error) {
    const { error: message, status } = httpError(error, "Could not load products.");
    return NextResponse.json({ error: message }, { status });
  }
}

export async function POST(request: Request) {
  const denied = await assertAdmin();
  if (denied) return denied;
  try {
    const body = (await request.json()) as Record<string, unknown>;
    const product = parseProductInput(body, newId("tf"));
    await createProduct(product);
    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    const { error: message, status } = httpError(error, "Could not save product.");
    return NextResponse.json({ error: message }, { status: error instanceof ValidationError ? 400 : status });
  }
}
