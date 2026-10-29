import type { MetadataRoute } from "next";
import { site } from "@/lib/site";
import { listProducts } from "@/lib/store";
import { journal } from "@/lib/journal";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const products = await listProducts();
  const now = new Date();
  const staticRoutes = [
    "",
    "/shop",
    "/about",
    "/journal",
    "/contact",
    "/faq",
    "/terms",
    "/privacy",
    "/cookies",
    "/shipping",
    "/returns",
    "/wishlist",
    "/cart",
    "/checkout",
    "/account/login",
    "/account/signup",
  ];
  return [
    ...staticRoutes.map((path) => ({
      url: `${site.url}${path}`,
      lastModified: now,
    })),
    ...products.map((product) => ({
      url: `${site.url}/products/${product.slug}`,
      lastModified: now,
    })),
    ...journal.map((entry) => ({
      url: `${site.url}/journal/${entry.slug}`,
      lastModified: now,
    })),
  ];
}
