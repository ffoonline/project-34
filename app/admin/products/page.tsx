import type { Metadata } from "next";
import { AdminProducts } from "@/components/AdminProducts";
import { listProducts } from "@/lib/store";

export const metadata: Metadata = {
  title: "Products",
};

export default async function AdminProductsPage() {
  const products = await listProducts();
  return (
    <div>
      <p className="kicker">Catalogue</p>
      <h1 className="font-heading mt-2 text-5xl">Products</h1>
      <p className="mt-3 max-w-xl text-sm text-muted-foreground">
        Upload photos as URLs for now, edit descriptions, prices, sizes, colours,
        stock, and collections.
      </p>
      <div className="mt-10">
        <AdminProducts initial={products} />
      </div>
    </div>
  );
}
