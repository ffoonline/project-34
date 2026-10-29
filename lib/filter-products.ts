import type { Product } from "./types";
import { productSearchText } from "./copy-catalog";

export type ProductQuery = {
  category?: string;
  subcategory?: string;
  collection?: string;
  q?: string;
  sale?: string;
  sort?: string;
};

export function filterProducts(products: Product[], query: ProductQuery) {
  let next = products;
  if (query.category === "sale") {
    next = next.filter((p) => (p.compareAt ?? 0) > p.price);
  } else if (query.category) {
    next = next.filter((p) => p.category === query.category);
  }
  if (query.subcategory) next = next.filter((p) => p.subcategory === query.subcategory);
  if (query.collection) next = next.filter((p) => p.collection === query.collection);
  if (query.sale === "1") next = next.filter((p) => (p.compareAt ?? 0) > p.price);
  if (query.q) {
    const needle = query.q.toLowerCase();
    next = next.filter((p) => productSearchText(p).includes(needle));
  }
  if (query.sort === "price-asc") next = [...next].sort((a, b) => a.price - b.price);
  else if (query.sort === "price-desc") next = [...next].sort((a, b) => b.price - a.price);
  else if (query.sort === "new") next = [...next].sort((a, b) => Number(b.newArrival) - Number(a.newArrival));
  else if (query.sort === "best") next = [...next].sort((a, b) => Number(b.bestSeller) - Number(a.bestSeller));
  else next = [...next].sort((a, b) => Number(b.featured) - Number(a.featured) || a.name.localeCompare(b.name));
  return next;
}
