import "server-only";

import { newStreetwearProducts, seedProducts } from "./catalog";
import { filterProducts, type ProductQuery } from "./filter-products";
import { createAdminClient } from "./supabase/admin";
import { isSupabaseConfigured } from "./supabase/env";
import type { Product } from "./types";

export type ProductRow = {
  id: string;
  slug: string;
  name: string;
  category: Product["category"];
  subcategory: string;
  collection: string;
  price: number | string;
  compare_at: number | string | null;
  description: string;
  story: string;
  fabric: string;
  care: string;
  sizes: string[];
  colors: Product["colors"];
  stock: number;
  featured: boolean;
  new_arrival: boolean;
  best_seller: boolean | null;
  demand: Product["demand"];
  images: string[];
  created_at?: string;
};

export function mapProduct(row: ProductRow): Product {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    category: row.category,
    subcategory: row.subcategory,
    collection: row.collection,
    price: Number(row.price),
    compareAt: row.compare_at != null ? Number(row.compare_at) : undefined,
    description: row.description,
    story: row.story,
    fabric: row.fabric,
    care: row.care,
    sizes: row.sizes ?? [],
    colors: row.colors ?? [],
    stock: row.stock,
    featured: Boolean(row.featured),
    newArrival: Boolean(row.new_arrival),
    bestSeller: Boolean(row.best_seller),
    demand: row.demand,
    images: row.images?.length ? row.images : ["/catalog/women-atelier.jpg"],
  };
}

export function toProductRow(product: Product): Omit<ProductRow, "created_at"> {
  return {
    id: product.id,
    slug: product.slug,
    name: product.name,
    category: product.category,
    subcategory: product.subcategory,
    collection: product.collection,
    price: product.price,
    compare_at: product.compareAt ?? null,
    description: product.description,
    story: product.story,
    fabric: product.fabric,
    care: product.care,
    sizes: product.sizes,
    colors: product.colors,
    stock: product.stock,
    featured: product.featured,
    new_arrival: product.newArrival,
    best_seller: Boolean(product.bestSeller),
    demand: product.demand,
    images: product.images,
  };
}

async function productClient() {
  const admin = createAdminClient();
  if (admin) return admin;
  if (!isSupabaseConfigured()) return null;
  const { createClient } = await import("./supabase/server");
  return createClient();
}

let seeded = false;

export async function ensureCatalogSeeded() {
  if (seeded || !isSupabaseConfigured()) return;
  const admin = createAdminClient();
  if (!admin) return;
  const { count, error } = await admin
    .from("products")
    .select("id", { count: "exact", head: true });
  if (error) {
    console.error("ensureCatalogSeeded count:", error.message);
    return;
  }
  if ((count ?? 0) === 0) {
    const { error: insertError } = await admin
      .from("products")
      .upsert(seedProducts.map(toProductRow), { onConflict: "id" });
    if (insertError) {
      console.error("ensureCatalogSeeded insert:", insertError.message);
      return;
    }
  } else {
    const additionIds = newStreetwearProducts.map((product) => product.id);
    const { data: existing, error: lookupError } = await admin
      .from("products")
      .select("id")
      .in("id", additionIds);
    if (lookupError) {
      console.error("ensureCatalogSeeded additions lookup:", lookupError.message);
      return;
    }
    const existingIds = new Set((existing ?? []).map((row) => row.id as string));
    const missing = newStreetwearProducts.filter((product) => !existingIds.has(product.id));
    if (missing.length > 0) {
      const { error: additionsError } = await admin
        .from("products")
        .upsert(missing.map(toProductRow), { onConflict: "id", ignoreDuplicates: true });
      if (additionsError) {
        console.error("ensureCatalogSeeded additions:", additionsError.message);
        return;
      }
    }
  }
  seeded = true;
}

export async function queryProducts(query?: ProductQuery) {
  await ensureCatalogSeeded();
  const client = await productClient();
  if (!client) return filterProducts(seedProducts, query ?? {});

  let request = client.from("products").select("*");
  if (query?.category && query.category !== "sale") {
    request = request.eq("category", query.category);
  }
  if (query?.subcategory) request = request.eq("subcategory", query.subcategory);
  if (query?.collection) request = request.eq("collection", query.collection);
  if (query?.q) {
    const needle = query.q.replace(/[%*,()]/g, "").slice(0, 80);
    if (needle) {
      request = request.or(
        `name.ilike.%${needle}%,slug.ilike.%${needle}%,description.ilike.%${needle}%,category.ilike.%${needle}%`,
      );
    }
  }
  if (query?.sort === "price-asc") request = request.order("price", { ascending: true });
  else if (query?.sort === "price-desc") request = request.order("price", { ascending: false });
  else if (query?.sort === "newest" || query?.sort === "new") {
    request = request.order("created_at", { ascending: false });
  } else {
    request = request.order("created_at", { ascending: false });
  }

  const { data, error } = await request;
  if (error) throw new Error(error.message);
  let products = (data as ProductRow[]).map(mapProduct);
  if (query?.category === "sale" || query?.sale === "1") {
    products = products.filter((product) => (product.compareAt ?? 0) > product.price);
  }
  if (query?.sort === "best") {
    products = [...products].sort((a, b) => Number(b.bestSeller) - Number(a.bestSeller));
  } else if (!query?.sort) {
    products = [...products].sort(
      (a, b) => Number(b.featured) - Number(a.featured) || a.name.localeCompare(b.name),
    );
  }
  return products;
}

export async function fetchProductBySlug(slug: string) {
  await ensureCatalogSeeded();
  const client = await productClient();
  if (!client) return seedProducts.find((product) => product.slug === slug) ?? null;
  const { data, error } = await client.from("products").select("*").eq("slug", slug).maybeSingle();
  if (error) throw new Error(error.message);
  return data ? mapProduct(data as ProductRow) : null;
}

export async function fetchProductById(id: string) {
  await ensureCatalogSeeded();
  const client = await productClient();
  if (!client) {
    return seedProducts.find((product) => product.id === id || product.slug === id) ?? null;
  }
  const { data, error } = await client
    .from("products")
    .select("*")
    .or(`id.eq.${id},slug.eq.${id}`)
    .maybeSingle();
  if (error) throw new Error(error.message);
  return data ? mapProduct(data as ProductRow) : null;
}

export async function insertProduct(product: Product) {
  const admin = createAdminClient();
  if (!admin) throw new Error("Supabase service role is not configured.");
  const { data, error } = await admin
    .from("products")
    .insert(toProductRow(product))
    .select("*")
    .single();
  if (error) throw new Error(error.message);
  return mapProduct(data as ProductRow);
}

export async function patchProduct(id: string, patch: Partial<Product>) {
  const admin = createAdminClient();
  if (!admin) throw new Error("Supabase service role is not configured.");
  const row: Record<string, unknown> = {};
  if (patch.slug != null) row.slug = patch.slug;
  if (patch.name != null) row.name = patch.name;
  if (patch.category != null) row.category = patch.category;
  if (patch.subcategory != null) row.subcategory = patch.subcategory;
  if (patch.collection != null) row.collection = patch.collection;
  if (patch.price != null) row.price = patch.price;
  if (patch.compareAt !== undefined) row.compare_at = patch.compareAt ?? null;
  if (patch.description != null) row.description = patch.description;
  if (patch.story != null) row.story = patch.story;
  if (patch.fabric != null) row.fabric = patch.fabric;
  if (patch.care != null) row.care = patch.care;
  if (patch.sizes != null) row.sizes = patch.sizes;
  if (patch.colors != null) row.colors = patch.colors;
  if (patch.stock != null) row.stock = patch.stock;
  if (patch.featured != null) row.featured = patch.featured;
  if (patch.newArrival != null) row.new_arrival = patch.newArrival;
  if (patch.bestSeller != null) row.best_seller = patch.bestSeller;
  if (patch.demand != null) row.demand = patch.demand;
  if (patch.images != null) row.images = patch.images;
  const { data, error } = await admin.from("products").update(row).eq("id", id).select("*").maybeSingle();
  if (error) throw new Error(error.message);
  return data ? mapProduct(data as ProductRow) : null;
}

export async function removeProduct(id: string) {
  const admin = createAdminClient();
  if (!admin) throw new Error("Supabase service role is not configured.");
  const { data, error } = await admin.from("products").delete().eq("id", id).select("id");
  if (error) throw new Error(error.message);
  return Boolean(data?.length);
}
